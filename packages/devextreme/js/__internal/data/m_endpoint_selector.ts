/* global Debug */
import errors from '@js/core/errors';
import { getWindow } from '@js/core/utils/window';

const window = getWindow();

let IS_WINJS_ORIGIN;
let IS_LOCAL_ORIGIN;

function isLocalHostName(url) {
  return /^(localhost$|127\.)/i.test(url); // TODO more precise check for 127.x.x.x IP
}

const EndpointSelector = function (config) {
  this.config = config;
  IS_WINJS_ORIGIN = window.location.protocol === 'ms-appx:';
  IS_LOCAL_ORIGIN = isLocalHostName(window.location.hostname);
};

EndpointSelector.prototype = {
  urlFor(key) {
    const bag = this.config[key];
    if (!bag) {
      throw errors.Error('E0006');
    }

    if (bag.production) {
      // @ts-expect-error
      if (IS_WINJS_ORIGIN && !Debug.debuggerEnabled || !IS_WINJS_ORIGIN && !IS_LOCAL_ORIGIN) {
        return bag.production;
      }
    }

    return bag.local;
  },

};

export default EndpointSelector;
