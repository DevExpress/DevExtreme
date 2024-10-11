/* global window */

import domAdapter from '@js/core/dom_adapter';

let hasWindowValue = typeof window !== 'undefined';

const hasWindow = () => hasWindowValue;

let windowObject: any = hasWindow() ? window : undefined;

if (!windowObject) {
  windowObject = {};
  windowObject.window = windowObject;
}

const getWindow = () => windowObject;

const setWindow = (newWindowObject, hasWindow) => {
  if (hasWindow === undefined) {
    hasWindowValue = typeof window !== 'undefined' && window === newWindowObject;
  } else {
    hasWindowValue = hasWindow;
  }
  windowObject = newWindowObject;
};

const hasProperty = (prop) => hasWindow() && prop in windowObject;

const defaultScreenFactorFunc = (width) => {
  if (width < 768) {
    return 'xs';
  } if (width < 992) {
    return 'sm';
  } if (width < 1200) {
    return 'md';
  }
  return 'lg';
};

const getCurrentScreenFactor = (screenFactorCallback) => {
  const screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;
  const windowWidth = domAdapter.getDocumentElement().clientWidth;

  return screenFactorFunc(windowWidth);
};

const getNavigator = () => (hasWindow() ? windowObject?.navigator : { userAgent: '' });

export {
  defaultScreenFactorFunc,
  getCurrentScreenFactor,
  getNavigator,
  getWindow,
  hasProperty,
  hasWindow,
  setWindow,
};

export default {
  defaultScreenFactorFunc,
  getCurrentScreenFactor,
  getNavigator,
  getWindow,
  hasProperty,
  hasWindow,
  setWindow,
};
