/* global window */

const domAdapter = require('../dom_adapter');

const hasWindow = typeof window !== 'undefined';

let windowObject = hasWindow && window;

if(!windowObject) {
    windowObject = {};
    windowObject.window = windowObject;
}

const hasWindowFn = () => hasWindow;

const getWindow = () => windowObject;

const hasProperty = (prop) => hasWindowFn() && prop in windowObject;

const defaultScreenFactorFunc = (width) => {
    if(width < 768) {
        return 'xs';
    } else if(width < 992) {
        return 'sm';
    } else if(width < 1200) {
        return 'md';
    } else {
        return 'lg';
    }
};

const getCurrentScreenFactor = (screenFactorCallback) => {
    const screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;
    const windowWidth = domAdapter.getDocumentElement()['clientWidth'];

    return screenFactorFunc(windowWidth);
};

const getNavigator = () => hasWindowFn() ? windowObject.navigator : { userAgent: '' };

module.exports = {
    hasWindow: hasWindowFn,
    getWindow,
    hasProperty,
    defaultScreenFactorFunc,
    getCurrentScreenFactor,
    getNavigator
};
