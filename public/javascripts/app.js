//
// Global variables
//
var LANG = 'ru';
var SINGLE_MODE = false;
var UPLOAD_LIMIT = 10; // MB
var TX_MIN = 1; // Mbps
var RX_MIN = 1; // Mbps
var REQUEST_INTERVAL = 60; // seconds

//
// RequireJS config
//
require.config({
    config: {
        replace: {
            pattern: "LANG",
            value: function() {
                return LANG;
            }
        }
    },
    paths: {
        replace: '../bower_components/require.replace/require.replace',
        text: '../bower_components/text/text',
        locale: 'locales/LANG',
        easyui: '../bower_components/jeasyui/locale/easyui-lang-LANG',
        ace: '../lib/ace'
    },
    shim: {
        'easyui': {
            exports: '$'
        }
    }
});

//
// Backbone config
//
Backbone.Model.prototype.idAttribute = '_id';

//
// Underscore extends
//
_.mixin({
    parseTemplate: function(template) {
        var $div = $('<div></div>').html(template);
        var templates = {};
        var scripts = $div.find('script[type="text/template"]');
        for (var i = 0, l = scripts.length; i < l; i++) {
            var id = scripts[i].id;
            templates[id] = $(scripts[i]).html();
        }
        return templates;
    },
    postMessage: function(message, targetOrigin, transfer) {
        var win = window.win || window;
        win.window.postMessage(message, targetOrigin, transfer);
    },
    truncateFilename: function(filename, length) {
        var extension = filename.indexOf('.') > -1 ? filename.split('.').pop() : '';
        if (filename.length > length) {
            filename = filename.substring(0, length - extension.length) + '...' + extension;
        }
        return filename;
    },
    isHttpStatusOK: function(url) {
        var status;
        $.ajax({
            url: url,
            type: 'HEAD',
            async: false,
            error: function() {
                status = false;
            },
            success: function() {
                status = true;
            }
        });
        return status;
    },
    // Generate a RFC4122 v4 (random) id
    uuid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});

//
// jQuery extends 
//
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        }
        else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//
// Application
//
require([
    "i18n",
    "router",
    "models/profile",
    "models/time"
], function(i18n, Router, ProfileModel, TimeModel) {
    console.log('app.js');
    // app
    window.app = {
        router: new Router(),
        time: new TimeModel(),
        profile: new ProfileModel(),
        login: function(username, password, error) {
            var self = this;
            this.profile.clear().save({
                username: username,
                password: password
            }, {
                success: function() {
                    self.time.syncTime();
                    self.connect();
                    self.router.navigate("", {
                        trigger: true
                    });
                },
                error: error
            });
        },
        logout: function(options) {
            var self = this;
            _.postMessage('clearCookies', '*');
            this.profile.destroy({
                success: function(model) {
                    model.clear();
                    self.time.stop();
                    self.disconnect();
                    self.router.navigate("login", {
                        trigger: true
                    });
                }
            });
        },
        connect: function(options) {
            if (this.io) return;
            var url = window.location.host;
            this.io = {
                notify: io.connect(url + '/notify', options),
                call: io.connect(url + '/webcall', options)
            };
        },
        disconnect: function() {
            for (var k in this.io) {
                if (this.io[k]) this.io[k].disconnect();
            }
            this.io = null;
        },
        isAuth: function() {
            return this.profile.has("username");
        },
        isMe: function(id) {
            return this.profile.get('_id') === id;
        },
        now: function() {
            return this.time.now();
        }
    };
    // starting
    $(document).ready(function() {
        console.log('ready');
        document.title = i18n.t('app.title');
        if (app.isAuth()) {
            app.time.syncTime();
            app.connect();
        }
        Backbone.history.start();
    });
});