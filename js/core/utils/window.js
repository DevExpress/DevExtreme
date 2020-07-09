/* global window */

import domAdapter from '../dom_adapter';

const hasWindow = () => typeof window !== 'undefined';

let windowObject = hasWindow() && window;

if(!windowObject) {
    windowObject = {};
    windowObject.window = windowObject;
}

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

export {
    hasWindow,
    getWindow,
    hasProperty,
    defaultScreenFactorFunc,
    getCurrentScreenFactor,
    getNavigator
};
