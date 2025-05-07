/* tslint:disable:max-line-length */
import {
  NgModule, Inject, NgZone, Optional, VERSION,
} from '@angular/core';
import { DOCUMENT, XhrFactory } from '@angular/common';
import httpRequest from 'devextreme/core/http_request';

import domAdapter from 'devextreme/core/dom_adapter';
import readyCallbacks from 'devextreme/core/utils/ready_callbacks';
import eventsEngine from 'devextreme/common/core/events/core/events_engine';

const outsideZoneEvents = ['mousemove', 'mouseover', 'mouseout'];
const insideZoneEvents = ['mouseup', 'click', 'mousedown', 'transitionend', 'wheel'];

let originalAdd;
let callbacks = [];
let readyCallbackAdd = function (callback) {
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

    listen(...args) {
      const eventName = args[1];
      if (outsideZoneEvents.includes(eventName)) {
        return ngZone.runOutsideAngular(() => this.callBase.apply(this, args));
      }

      if (ngZone.isStable && insideZoneEvents.includes(eventName)) {
        return ngZone.run(() => this.callBase.apply(this, args));
      }

      return this.callBase.apply(this, args);
    },

    isElementNode(element) {
      return element && element.nodeType === 1;
    },

    isTextNode(element) {
      return element && element.nodeType === 3;
    },

    isDocument(element) {
      return element && element.nodeType === 9;
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
  constructor(@Inject(DOCUMENT) document: any, ngZone: NgZone, @Optional() xhrFactory: XhrFactory) {
    doInjections(document, ngZone, xhrFactory);
  }
}
