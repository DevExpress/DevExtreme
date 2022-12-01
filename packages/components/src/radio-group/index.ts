/* eslint-disable import/exports-last */
import {
  createCore,
  Selector,
  StateConfigMap,
  Handlers,
  StateManager,
  ViewModelManager,
  Dispatcher,
  Disposable,
} from '@devexpress/core';

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

export enum Actions {
  updateValue = 'updateValue',
}

function updateValueHandler<T>(
  stateValue: RadioGroupState<T>,
  { value } : { value: T },
): Partial<RadioGroupState<T>> {
  return {
    ...stateValue,
    value,
  };
}

function createActionHandlers<T>(): Handlers<RadioGroupState<T>> {
  return {
    [Actions.updateValue]: updateValueHandler,
  };
}

// === selectors ===
export type RadioButtonVM = {
  selected: boolean;
};

export function createRadioButtonVMSelector<T>(
  value: T,
): Selector<RadioGroupState<T>, RadioButtonVM> {
  return (state) => ({
    selected: state.value === value,
  });
}

// === component ===
export type RadioGroupStateManager<T> =
  StateManager<RadioGroupState<T>>;
export type RadioGroupViewModelManager<T> =
  // eslint-disable-next-line @typescript-eslint/ban-types
  Disposable<ViewModelManager<RadioGroupState<T>, {}>>;
export type RadioGroupDispatcher<T> =
  Dispatcher<RadioGroupState<T>, Handlers<RadioGroupState<T>>>;
export type RadioGroupCore<T> = {
  stateManager: RadioGroupStateManager<T>,
  viewModelManager: RadioGroupViewModelManager<T>,
  dispatcher: RadioGroupDispatcher<T>,
};

export function createRadioGroupCore<T>(
  initialState: RadioGroupState<T>,
  config: StateConfigMap<RadioGroupState<T>>,
): RadioGroupCore<T> {
  return createCore()(initialState, config, createActionHandlers<T>());
}
