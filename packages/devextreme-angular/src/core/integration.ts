/* tslint:disable:max-line-length */
import {
  NgModule, Inject, NgZone, Optional, VERSION,
} from '@angular/core';
import { DOCUMENT, XhrFactory } from '@angular/common';
import httpRequest from 'devextreme/core/http_request';

import domAdapter from 'devextreme/core/dom_adapter';
import readyCallbacks from 'devextreme/core/utils/ready_callbacks';
import eventsEngine from 'devextreme/common/core/events/core/events_engine';

const outsideAngularEvents = ['mousemove', 'mouseover', 'mouseout'];
const insideAngularEvents = ['mouseup', 'click', 'mousedown', 'transitionend', 'wheel'];

let inOutsideAngularHandler = false;

export const isInOutsideAngularHandler = () => inOutsideAngularHandler;

export const isZoneless = (ngZone: NgZone) => !(ngZone instanceof NgZone);
export const canMarkForCheck = (ngZone: NgZone) => isZoneless(ngZone) || NgZone.isInAngularZone();

type ReadyCallback = () => void;
type ReadyCallbackAdd = (callback: ReadyCallback) => void;
interface ReadyCallbackAddContext {
  callBase: ReadyCallbackAdd;
}

let originalAdd: ReadyCallbackAdd;
let callbacks: ReadyCallback[] = [];
let readyCallbackAdd = function (this: ReadyCallbackAddContext, callback: ReadyCallback) {
  if (!originalAdd) {
    originalAdd = this.callBase.bind(this);
  }
  callbacks.push(callback);
};

readyCallbacks.inject({
  add(callback) {
    return readyCallbackAdd.call(this, callback);
  },
});

let doInjections = (document: any, ngZone: NgZone, xhrFactory: XhrFactory) => {
  if (Number(VERSION.major) < 12) {
    console.warn('Your version of Angular is not supported. Please update your project to version 12 or later.'
        + ' Please refer to the Angular Update Guide for more information: https://update.angular.io');
  }

  domAdapter.inject({
    _document: document,

    listen(this: { callBase: (...args: any[]) => any }, element, event: string, callback, options) {
      if (outsideAngularEvents.includes(event)) {
        const trackedCallback = function (this: unknown, e: Event) {
          const prevInOutsideAngularHandler = inOutsideAngularHandler;
          inOutsideAngularHandler = true;
          try {
            return callback.call(this, e);
          } finally {
            inOutsideAngularHandler = prevInOutsideAngularHandler;
          }
        };
        return ngZone.runOutsideAngular(() => this.callBase(element, event, trackedCallback, options));
      }

      if (ngZone.isStable && insideAngularEvents.includes(event)) {
        return ngZone.run(() => this.callBase(element, event, callback, options));
      }

      return this.callBase(element, event, callback, options);
    },

    isElementNode(element) {
      return element?.nodeType === 1;
    },

    isTextNode(element) {
      return element?.nodeType === 3;
    },

    isDocument(element) {
      return element?.nodeType === 9;
    },
  });

  httpRequest.inject({
    getXhr() {
      if (!xhrFactory) {
        return this.callBase.apply(this);
      }
      const _xhr = xhrFactory.build();
      if (!('withCredentials' in _xhr)) {
        (_xhr as any).withCredentials = false;
      }

      return _xhr;
    },
  });

  const runReadyCallbacksInZone = () => {
    ngZone.run(() => {
      eventsEngine.set({});
      callbacks.forEach((callback) => originalAdd.call(null, callback));
      callbacks = [];
      readyCallbacks.fire();
    });
  };

  runReadyCallbacksInZone();

  readyCallbackAdd = (callback) => ngZone.run(() => callback());
  doInjections = runReadyCallbacksInZone;
};

@NgModule({})
export class DxIntegrationModule {
  static initialized = false;

  constructor(@Inject(DOCUMENT) document: any, ngZone: NgZone, @Optional() xhrFactory: XhrFactory) {
    doInjections(document, ngZone, xhrFactory);
    DxIntegrationModule.initialized = true;
  }
}
