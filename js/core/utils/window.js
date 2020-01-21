/* global window */

const domAdapter = require('../dom_adapter');

const windowObject = window ?? { window: windowObject };

const hasWindow = () => typeof window !== 'undefined';

const getWindow = () => windowObject;

const hasProperty = (prop) => hasWindow() && prop in windowObject;

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

const getNavigator = () => hasWindow() ? windowObject.navigator : { userAgent: '' };

module.exports = {
    hasWindow,
    getWindow,
    hasProperty,
    defaultScreenFactorFunc,
    getCurrentScreenFactor,
    getNavigator
};
