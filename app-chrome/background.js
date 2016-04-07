chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(portOnMessageHanlder);

    function portOnMessageHanlder(message) {
        if (!message) return;
        switch (message.id) {
            case 'chooseSourceId':
                var session = ['screen'];
                chrome.desktopCapture.chooseDesktopMedia(session, port.sender.tab, function(sourceId) {
                    // if "cancel" button is clicked
                    if (!sourceId || !sourceId.length) {
                        return port.postMessage('PermissionDeniedError');
                    }
                    var output = {
                        id: 'sourceId',
                        target: message.target,
                        data: sourceId
                    };
                    port.postMessage(output);
                });
                break;
            case 'takeScreenshot':
                chrome.tabs.captureVisibleTab(null, {
                    format: 'png'
                }, function(dataUrl) {
                    var output = {
                        id: 'screenshot',
                        target: message.target,
                        data: dataUrl
                    };
                    port.postMessage(output);
                });
                break;
            case 'getVersion':
                function getChromeVersion() {
                    var match = window.navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9\.]+)/);
                    return match ? match[1] : null;
                }
                var manifest = chrome.runtime.getManifest();
                var version = {
                    version: manifest.version,
                    engine: 'chrome',
                    release: getChromeVersion()
                };
                var output = {
                    id: 'version',
                    target: message.target,
                    data: version
                };
                port.postMessage(output);
                break;
        }
    }
});