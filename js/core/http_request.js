import windowUtils from './utils/window';
const window = windowUtils.getWindow();
import injector from './utils/dependency_injector';

const nativeXMLHttpRequest = {
    getXhr: function() {
        return new window.XMLHttpRequest();
    }
};

export default injector(nativeXMLHttpRequest);
