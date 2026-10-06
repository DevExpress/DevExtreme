/* global window */

import domAdapter from '@js/core/dom_adapter';

let hasWindowValue = typeof window !== 'undefined';

const hasWindow = (): boolean => hasWindowValue;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a stub object without a window
let windowObject: any = hasWindow() ? window : undefined;

if (!windowObject) {
  windowObject = {};
  windowObject.window = windowObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- callers use non-Window members
const getWindow = (): any => windowObject;

const setWindow = (
  newWindowObject: Window | Record<string, unknown>,
  newHasWindow?: boolean,
): void => {
  if (newHasWindow === undefined) {
    hasWindowValue = typeof window !== 'undefined' && window === newWindowObject;
  } else {
    hasWindowValue = newHasWindow;
  }
  windowObject = newWindowObject;
};

const hasProperty = (prop: string): boolean => hasWindow() && prop in windowObject;

const defaultScreenFactorFunc = (width: number): 'xs' | 'sm' | 'md' | 'lg' => {
  if (width < 768) {
    return 'xs';
  } if (width < 992) {
    return 'sm';
  } if (width < 1200) {
    return 'md';
  }
  return 'lg';
};

const getCurrentScreenFactor = (screenFactorCallback?: (width: number) => string): string => {
  const screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;
  const windowWidth = domAdapter.getDocumentElement().clientWidth;

  return screenFactorFunc(windowWidth);
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-return -- windowObject is any
const getNavigator = (): Navigator => (hasWindow() ? windowObject?.navigator : { userAgent: '' });

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
