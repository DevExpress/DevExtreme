/* eslint-disable import/no-import-module-exports */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import resizeObserverSingleton from '@js/core/resize_observer';
import { each } from '@js/core/utils/iterator';
import _windowResizeCallbacks from '@js/core/utils/resize_callbacks';
import { format as _stringFormat } from '@js/core/utils/string';
import { version } from '@js/core/version';
import warnings from '@js/viz/core/errors_warnings';
import { normalizeEnum } from '@ts/viz/core/utils';

const { ERROR_MESSAGES } = warnings;

export function createEventTrigger(eventsMap, callbackGetter) {
  let triggers = {};

  each(eventsMap, (name, info) => {
    if (info.name) {
      createEvent(name);
    }
  });
  let changes;
  triggerEvent.change = function (name) {
    const eventInfo = eventsMap[name];
    if (eventInfo) {
      (changes = changes || {})[name] = eventInfo;
    }
    return !!eventInfo;
  };
  triggerEvent.applyChanges = function () {
    if (changes) {
      each(changes, (name, eventInfo) => {
        createEvent(eventInfo.newName || name);
      });
      changes = null;
    }
  };
  triggerEvent.dispose = function () {
    // @ts-expect-error
    eventsMap = callbackGetter = triggers = null;
  };

  return triggerEvent;

  function createEvent(name) {
    const eventInfo = eventsMap[name];

    triggers[eventInfo.name] = callbackGetter(name, eventInfo.actionSettings);
  }

  function triggerEvent(name, arg, complete) {
    triggers[name](arg);
    complete?.();
  }
}

export let createIncidentOccurred = function (widgetName, eventTrigger) {
  return function incidentOccurred(id, args) {
    eventTrigger('incidentOccurred', {
      target: {
        id,
        type: id[0] === 'E' ? 'error' : 'warning',
        args,
        // @ts-expect-error
        text: _stringFormat.apply(null, [ERROR_MESSAGES[id]].concat(args || [])),
        widget: widgetName,
        version,
      },
    });
  };
};

function getResizeManager(resizeCallback) {
  return (observe, unsubscribe) => {
    const { handler, dispose } = createDeferredHandler(resizeCallback, unsubscribe);

    observe(handler);
    return dispose;
  };
}

function createDeferredHandler(callback, unsubscribe) {
  let timeout;

  const handler = function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, 100);
  };

  return {
    handler,
    dispose() {
      clearTimeout(timeout);
      unsubscribe(handler);
    },
  };
}

export function createResizeHandler(contentElement, redrawOnResize, resize) {
  let disposeHandler;
  const resizeManager = getResizeManager(resize);

  if (normalizeEnum(redrawOnResize) === 'windowonly') {
    disposeHandler = resizeManager(
      (handler) => _windowResizeCallbacks.add(handler),
      (handler) => _windowResizeCallbacks.remove(handler),
    );
  } else if (redrawOnResize === true) {
    disposeHandler = resizeManager(
      (handler) => resizeObserverSingleton.observe(contentElement, handler),
      () => resizeObserverSingleton.unobserve(contentElement),
    );
  }
  return disposeHandler;
}

/// #DEBUG
export { createEventTrigger as DEBUG_createEventTrigger };

export const DEBUG_createIncidentOccurred = createIncidentOccurred;

exports.DEBUG_stub_createIncidentOccurred = function (stub) {
  createIncidentOccurred = stub;
};

exports.DEBUG_restore_createIncidentOccurred = function () {
  createIncidentOccurred = DEBUG_createIncidentOccurred;
};

export { createResizeHandler as DEBUG_createResizeHandler };
/// #ENDDEBUG
