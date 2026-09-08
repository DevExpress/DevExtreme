/* global Debug */
import errors from '@js/core/errors';
import { getWindow } from '@js/core/utils/window';

const window = getWindow();

interface Endpoint {
  local: string;
  production?: string;
}

type EndpointConfig = Record<string, Endpoint | undefined>;

let isWinJsOrigin = false;
let isLocalOrigin = false;

function isLocalHostName(url: string): boolean {
  return /^(localhost$|127\.)/i.test(url); // TODO more precise check for 127.x.x.x IP
}

class EndpointSelector {
  config: EndpointConfig;

  constructor(config: EndpointConfig) {
    this.config = config;
    isWinJsOrigin = window.location.protocol === 'ms-appx:';
    isLocalOrigin = isLocalHostName(window.location.hostname);
  }

  urlFor(key: string): string {
    const bag = this.config[key];
    if (!bag) {
      throw errors.Error('E0006');
    }

    if (bag.production) {
      // @ts-expect-error `Debug` is a WinJS global that has no ambient declaration here
      if ((isWinJsOrigin && !Debug.debuggerEnabled) || (!isWinJsOrigin && !isLocalOrigin)) {
        return bag.production;
      }
    }

    return bag.local;
  }
}

export default EndpointSelector;
