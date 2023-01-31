/* eslint-disable import/exports-last */
import {
  createSelector,
  createStore,
  Selector,
  StateConfigMap,
  Store,
} from '@devextreme/core';
import { UpdateStateAction } from '@devextreme/core/src/store';

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

function updateValueAction<T>(
  value: T | undefined,
): UpdateStateAction<RadioGroupState<T>> {
  return (state) => ({
    ...state,
    value,
  });
}

export const RADIO_GROUP_ACTIONS = {
  updateValue: updateValueAction,
};

// === selectors ===
export function createCheckedSelector<T>(
  value: T,
): Selector<RadioGroupState<T>, boolean> {
  return createSelector(
    (state) => ({ stateValue: state.value }),
    ({ stateValue }) => stateValue === value,
  );
}

// === component ===
export type RadioGroupStore<T> = Store<RadioGroupState<T>>;

export function createRadioGroupStore<T>(
  initialState: RadioGroupState<T>,
  config: StateConfigMap<RadioGroupState<T>>,
): RadioGroupStore<T> {
  return createStore(initialState, config);
}
