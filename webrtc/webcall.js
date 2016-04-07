module.exports = function(io, targets) {
    var config = require('nconf');
    var kurento = require('kurento-client');
    var logger = require('../common/logger');

    /*
     * Definition of global variables
     */
    var userRegistry = new UserRegistry();
    var idCounter = 0;
    var candidatesQueue = {};
    var kurentoClient = null;

    function nextUniqueId() {
        idCounter++;
        return idCounter.toString();
    }

    /*
     * Definition of helper classes
     */

    // Represents caller and callee sessions
    function UserSession(id, name, ws) {
        this.id = id;
        this.name = name;
        this.ws = ws;
        this.viewers = {};
        this.presenter = null;
        this.pipeline = null;
        this.recorder = null;
        this.endpoint = null;
    }
    UserSession.prototype.send = function(message) {
        message.name = this.name;
        return send(this.ws, message);
    };

    // Represents registrar of users
    function UserRegistry() {
        this.users = {};
    }
    UserRegistry.prototype.register = function(user) {
        if (user) this.users[user.name] = user;
    };
    UserRegistry.prototype.unregister = function(user) {
        if (user) delete this.users[user.name];
    };
    UserRegistry.prototype.getByName = function(name) {
        if (name) return this.users[name];
    };

    /*
     * Definition of functions
     */

    function send(ws, message) {
        try {
            ws.send(JSON.stringify(message));
        }
        catch (exception) {
            return exception;
        }
    }

    /**
     * Определение параметров WebRTC по user.name.
     * 
     * @param {string} user.name - Идентификатор камеры
     * 
     * Веб-камера: webcamId-sessionId (например, webcam1-df488635565cef31799b167c7682af98)
     * Экран: screenId-sessionId (например, screen1-df488635565cef31799b167c7682af98)
     * IP-камера: ipcamId-sessionId (например, ipcam1-df488635565cef31799b167c7682af98)
     * Без записи: devId@loopback-sessionId (например, camera1@loopback-df488635565cef31799b167c7682af98)
     */
    function getEndpointParams(user) {
        var username = user.name || "";
        var webRtcParams = [];
        if (~username.indexOf('ipcam')) {
            var ipcamId = username.split('-')[1];
            webRtcParams.push({
                type: 'PlayerEndpoint',
                params: {
                    uri: config.get('ipcam:uri') + ipcamId
                }
            });
        }
        else {
            webRtcParams.push({
                type: 'WebRtcEndpoint',
                params: {}
            });
        }
        if (!~username.indexOf('loopback')) {
            webRtcParams.push({
                type: 'RecorderEndpoint',
                params: {
                    uri: config.get('recorder:uri') + Date.now() + '_' + username + '.webm',
                    mediaProfile: ~username.indexOf('screen') ? 'WEBM_VIDEO_ONLY' : 'WEBM'
                }
            });
        }
        return webRtcParams;
    }

    // Bind socket
    function bind(socket) {
        socket.on('connection', function(ws) {
            var sessionId = nextUniqueId();
            logger.debug('Connection received with sessionId ' + sessionId);
            ws.on('disconnect', function() {
                logger.debug('Connection ' + sessionId + ' closed');
                close(sessionId);
            });
            ws.on('message', function(_message) {
                var message = JSON.parse(_message);
                logger.debug('Connection ' + sessionId + ' received message: ' + JSON.stringify(message));
                switch (message.id) {
                    case 'presenter':
                        startPresenter(sessionId, message.name, ws, message.sdpOffer, function(error) {
                            stop(sessionId, message.name);
                            send(ws, {
                                id: 'presenterResponse',
                                name: message.name,
                                response: 'rejected',
                                message: error
                            });
                        });
                        break;
                    case 'viewer':
                        startViewer(sessionId, message.name, message.presenter, ws, message.sdpOffer, function(error) {
                            stop(sessionId, message.name);
                            send(ws, {
                                id: 'viewerResponse',
                                name: message.name,
                                response: 'rejected',
                                message: error
                            });
                        });
                        break;
                    case 'start':
                        start(sessionId, message.name, message.viewer, ws);
                        break;
                    case 'stop':
                        stop(sessionId, message.name);
                        break;
                    case 'onIceCandidate':
                        onIceCandidate(message.name, message.candidate);
                        break;
                }
            });
        });
    }

    function startPresenter(sessionId, _presenter, ws, sdpOffer, onError) {

        if (!_presenter) return onError("empty user name");
        var presenter = userRegistry.getByName(_presenter);
        if (presenter) return onError("presenter is already active");

        presenter = new UserSession(sessionId, _presenter, ws);
        userRegistry.register(presenter);
        presenter.ws = ws;

        clearCandidatesQueue(presenter.name);

        getKurentoClient(function(error, kurentoClient) {
            if (error) return onError(error);

            kurentoClient.create('MediaPipeline', function(error, pipeline) {
                if (error) return onError(error);

                presenter.pipeline = pipeline;

                pipeline.create(getEndpointParams(presenter), function(error, elements) {
                    if (error) return onError(error);

                    var endpoint = elements[0];
                    var recorder = elements[1];

                    presenter.endpoint = endpoint;

                    if (endpoint instanceof kurento.register.classes.WebRtcEndpoint) {

                        if (candidatesQueue[presenter.name]) {
                            while (candidatesQueue[presenter.name].length) {
                                var candidate = candidatesQueue[presenter.name].shift();
                                endpoint.addIceCandidate(candidate);
                            }
                        }

                        endpoint.on('OnIceCandidate', function(event) {
                            var candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
                            presenter.send({
                                id: 'iceCandidate',
                                candidate: candidate
                            });
                        });

                        if (recorder) {
                            endpoint.connect(recorder, function(error) {
                                if (error) return onError(error);
                                recorder.record(function(error) {
                                    if (error) return onError(error);
                                    presenter.recorder = recorder;
                                });
                            });

                        }

                        endpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
                            if (error) return onError(error);
                            endpoint.gatherCandidates(function(error) {
                                if (error) return onError(error);
                            });
                            presenter.send({
                                id: 'presenterResponse',
                                response: 'accepted',
                                sdpAnswer: sdpAnswer
                            });
                        });

                    }
                    else if (endpoint instanceof kurento.register.classes.PlayerEndpoint) {
                        
                        endpoint.on('EndOfStream', function() {
                            pipeline.release();
                        });

                        endpoint.play(function(error) {
                            if (error) return onError(error);
                            if (recorder) {
                                endpoint.connect(recorder, function(error) {
                                    if (error) return onError(error);
                                    recorder.record(function(error) {
                                        if (error) return onError(error);
                                        presenter.recorder = recorder;
                                    });
                                });
                            }
                            presenter.send({
                                id: 'presenterResponse',
                                response: 'accepted'
                            });
                        });
                    }

                });
            });
        });
    }

    function startViewer(sessionId, _viewer, _presenter, ws, sdpOffer, onError) {

        if (!_presenter || !_viewer) return onError("empty user name");
        var presenter = userRegistry.getByName(_presenter);
        if (!presenter) return onError("presenter is not active");
        var viewer = userRegistry.getByName(_viewer);
        if (viewer) return onError("viewer is already active");

        viewer = new UserSession(sessionId, _viewer, ws);
        userRegistry.register(viewer);
        viewer.ws = ws;
        viewer.presenter = presenter;

        clearCandidatesQueue(viewer.name);

        if (!presenter.pipeline) return onError("no media pipeline");

        presenter.pipeline.create('WebRtcEndpoint', function(error, webRtcEndpoint) {
            if (error) return onError(error);

            viewer.endpoint = webRtcEndpoint;
            presenter.viewers[viewer.name] = viewer;

            if (candidatesQueue[viewer.name]) {
                while (candidatesQueue[viewer.name].length) {
                    var candidate = candidatesQueue[viewer.name].shift();
                    webRtcEndpoint.addIceCandidate(candidate);
                }
            }

            webRtcEndpoint.on('OnIceCandidate', function(event) {
                var candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
                viewer.send({
                    id: 'iceCandidate',
                    candidate: candidate
                });
            });

            webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer) {
                if (error) return onError(error);
                presenter.endpoint.connect(webRtcEndpoint, function(error) {
                    if (error) return onError(error);
                    webRtcEndpoint.gatherCandidates(function(error) {
                        if (error) return onError(error);
                    });
                    viewer.send({
                        id: 'viewerResponse',
                        response: 'accepted',
                        sdpAnswer: sdpAnswer
                    });
                });
            });
        });
    }

    function start(sessionId, name, _viewer, ws) {
        var user = userRegistry.getByName(name);
        if (!user || user.id !== sessionId) return;
        send(ws, {
            id: 'startCommunication',
            name: _viewer,
            presenter: name
        });
    }

    function stop(sessionId, name) {
        var user = userRegistry.getByName(name);
        if (!user || user.id !== sessionId) return;
        // если это presenter, то остановить все viewer
        for (var i in user.viewers) {
            if (user.viewers[i].ws) {
                user.viewers[i].send({
                    id: 'stopCommunication'
                });
            }
            dispose(user.viewers[i]);
            delete user.viewers[i];
        }
        // если это viewer, то удалить себя из presenter
        if (user.presenter && user.presenter.viewers) {
            dispose(user.presenter.viewers[user.name]);
            delete user.presenter.viewers[user.name];
        }
        dispose(user);
    }

    function dispose(user) {
        if (!user) return;
        if (user.recorder) user.recorder.stop();
        if (user.endpoint) user.endpoint.release();
        if (user.pipeline) user.pipeline.release();
        clearCandidatesQueue(user.name);
        userRegistry.unregister(user);
    }

    function close(sessionId) {
        for (var k in userRegistry.users) {
            stop(sessionId, k);
        }
    }

    function clearCandidatesQueue(name) {
        if (candidatesQueue[name]) {
            delete candidatesQueue[name];
        }
    }

    function onIceCandidate(name, _candidate) {
        if (!name) return;
        var candidate = kurento.register.complexTypes.IceCandidate(_candidate);
        var user = userRegistry.getByName(name);
        if (user && user.endpoint) {
            user.endpoint.addIceCandidate(candidate);
        }
        else {
            if (!candidatesQueue[name]) {
                candidatesQueue[name] = [];
            }
            candidatesQueue[name].push(candidate);
        }
    }

    // Recover kurentoClient for the first time
    function getKurentoClient(callback) {
        if (kurentoClient !== null) {
            return callback(null, kurentoClient);
        }
        var ws_uri = config.get('ws:uri');
        kurento(ws_uri, function(error, _kurentoClient) {
            if (error) {
                logger.error('Coult not find media server at address ' + ws_uri);
                return callback('Kurento client error: ' + error);
            }
            kurentoClient = _kurentoClient;
            callback(null, kurentoClient);
        });
    }

    /*
     * Bind sockets
     */
    for (var i in targets) {
        var socket = io.of(targets[i]);
        bind(socket);
    }
};