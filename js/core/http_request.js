const windowUtils = require('./utils/window');
const window = windowUtils.getWindow();
const injector = require('./utils/dependency_injector');

const nativeXMLHttpRequest = {
    getXhr: function() {
        return new window.XMLHttpRequest();
    }
};

module.exports = injector(nativeXMLHttpRequest);
