/* eslint-disable object-shorthand */
import eventsEngine from '@js/common/core/events/core/events_engine';
import domAdapter from '@js/core/dom_adapter';
import MemorizedCallbacks from '@js/core/memorized_callbacks';

type DataKey = string;

type ElementData = Record<DataKey, unknown>;

type DataArgs = [element?: Node | null, key?: DataKey, value?: unknown];

type NodeCollection = ArrayLike<Node> & Iterable<Node>;

type CleanDataHook = (nodes: ArrayLike<Node>) => void;

export interface DataStrategy {
  data: (...args: DataArgs) => unknown;
  removeData: (element: Node, key?: DataKey) => void;
  cleanData: (nodes: NodeCollection) => unknown;
}

const dataMap = new WeakMap<object, ElementData>();

export const strategyChanging = new MemorizedCallbacks();
let beforeCleanDataFunc: CleanDataHook = function () {};
let afterCleanDataFunc: CleanDataHook = function () {};

const defaultStrategy: DataStrategy = {
  data: function (...args: DataArgs): unknown {
    const element = args[0];
    const key = args[1];
    const value = args[2];

    if (!element) return undefined;

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

  removeData: function (element: Node, key?: DataKey): void {
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

  cleanData: function (elements: NodeCollection): void {
    for (const element of elements) {
      eventsEngine.off(element);
      dataMap.delete(element);
    }
  },
};

let strategy: DataStrategy = defaultStrategy;

export const setDataStrategy = function (value: DataStrategy): void {
  strategyChanging.fire(value);

  strategy = value;

  const originalCleanData = strategy.cleanData;

  strategy.cleanData = function (nodes: NodeCollection): unknown {
    beforeCleanDataFunc(nodes);

    const result = originalCleanData.call(this, nodes);

    afterCleanDataFunc(nodes);

    return result;
  };
};

setDataStrategy(defaultStrategy);

export function getDataStrategy(): DataStrategy {
  return strategy;
}

export function data<TValue = unknown>(...args: DataArgs): TValue {
  return strategy.data.apply(this, args) as TValue;
}

export function beforeCleanData(callback: CleanDataHook): void {
  beforeCleanDataFunc = callback;
}

export function afterCleanData(callback: CleanDataHook): void {
  afterCleanDataFunc = callback;
}

export function cleanData(nodes: NodeCollection): unknown {
  return strategy.cleanData.call(this, nodes);
}

export function removeData(element: Node, key?: DataKey): void {
  return strategy.removeData.call(this, element, key);
}

export function cleanDataRecursive(element: Node | null | undefined, cleanSelf?: boolean): void {
  if (!domAdapter.isElementNode(element)) {
    return;
  }

  const childElements = (element as Element).getElementsByTagName('*');

  strategy.cleanData(childElements);

  if (cleanSelf) {
    strategy.cleanData([element as Element]);
  }
}
