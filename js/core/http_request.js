var windowUtils = require('./utils/window');
var window = windowUtils.getWindow();
var injector = require('./utils/dependency_injector');

var nativeXMLHttpRequest = {
    getXhr: function() {
        return new window.XMLHttpRequest();
    }
};

module.exports = injector(nativeXMLHttpRequest);
