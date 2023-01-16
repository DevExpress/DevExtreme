/* eslint-disable import/exports-last */
import {
  createStore,
  Handlers,
  Selector,
  StateConfigMap,
  Store,
} from '@devextreme/core';

// === props ===
export type ValueProps<T> = {
  value?: T;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ReadonlyProps = {};

// eslint-disable-next-line @typescript-eslint/ban-types
export type TemplateProps = {};

// === state ===
export type RadioGroupState<T> = ValueProps<T>;

// === actions ===

type RadioGroupActions<T> = {
  updateValue: { value: T }
};

type RadioGroupHandlers<T> = Handlers<RadioGroupState<T>, RadioGroupActions<T>>;

function createActionHandlers<T>(): RadioGroupHandlers<T> {
  return {
    updateValue(stateValue, { value }) {
      return {
        ...stateValue,
        value,
      };
    },
  };
}

// === selectors ===
export function createCheckedSelector<T>(
  value: T,
): Selector<RadioGroupState<T>, boolean> {
  return (state) => state.value === value;
}

// === component ===
export type RadioGroupStore<T> = Store<RadioGroupState<T>, RadioGroupHandlers<T>>;

export function createRadioGroupStore<T>(
  initialState: RadioGroupState<T>,
  config: StateConfigMap<RadioGroupState<T>>,
): RadioGroupStore<T> {
  return createStore(initialState, config, createActionHandlers<T>());
}
