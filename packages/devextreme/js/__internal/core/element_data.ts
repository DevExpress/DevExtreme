/* eslint-disable object-shorthand */
import eventsEngine from '@js/common/core/events/core/events_engine';
import domAdapter from '@js/core/dom_adapter';
import MemorizedCallbacks from '@js/core/memorized_callbacks';

const dataMap = new WeakMap();
let strategy;

export const strategyChanging = new MemorizedCallbacks();
let beforeCleanDataFunc: any = function () {};
let afterCleanDataFunc: any = function () {};

export const setDataStrategy = function (value) {
  strategyChanging.fire(value);

  strategy = value;

  const { cleanData } = strategy;

  strategy.cleanData = function (nodes) {
    beforeCleanDataFunc(nodes);

    const result = cleanData.call(this, nodes);

    afterCleanDataFunc(nodes);

    return result;
  };
};

setDataStrategy({
  data: function (...args) {
    const element = args[0];
    const key = args[1];
    const value = args[2];

    if (!element) return;

    let elementData = dataMap.get(element);

    if (!elementData) {
      elementData = {};
      dataMap.set(element, elementData);
    }

    if (key === undefined) {
      return elementData;
    }

    if (args.length === 2) {
      return elementData[key];
    }

    elementData[key] = value;
    return value;
  },

  removeData: function (element, key) {
    if (!element) return;
    if (key === undefined) {
      dataMap.delete(element);
    } else {
      const elementData = dataMap.get(element);
      if (elementData) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete elementData[key];
      }
    }
  },

  cleanData: function (elements) {
    for (let i = 0; i < elements.length; i++) {
      eventsEngine.off(elements[i]);
      dataMap.delete(elements[i]);
    }
  },
});

export function getDataStrategy() {
  return strategy;
}

export function data(...args) {
  return strategy.data.apply(this, args);
}

export function beforeCleanData(callback) {
  beforeCleanDataFunc = callback;
}

export function afterCleanData(callback) {
  afterCleanDataFunc = callback;
}

export function cleanData(nodes) {
  return strategy.cleanData.call(this, nodes);
}

export function removeData(element, key) {
  return strategy.removeData.call(this, element, key);
}

export function cleanDataRecursive(element, cleanSelf?: boolean) {
  if (!domAdapter.isElementNode(element)) {
    return;
  }

  const childElements = element.getElementsByTagName('*');

  strategy.cleanData(childElements);

  if (cleanSelf) {
    strategy.cleanData([element]);
  }
}
