import {
  createCore,
  Dispatcher,
  Disposable,
  Handlers,
  StateConfigMap,
  StateManager,
  ViewModelManager,
} from '@devexpress/core';
import { createActionHandlers } from './actions';
import { RadioGroupState } from './state';
import { RadioGroupVMs } from './view-models';

export type RadioGroupStateManager<T> =
  StateManager<RadioGroupState<T>>;
export type RadioGroupViewModelManager<T> =
  Disposable<ViewModelManager<RadioGroupState<T>, RadioGroupVMs<T>>>;
export type RadioGroupDispatcher<T> =
  Dispatcher<RadioGroupState<T>, Handlers<RadioGroupState<T>>>;
export type RadioGroupContextData<T> =
  [
    viewModelManager: RadioGroupViewModelManager<T>,
    dispatcher: RadioGroupDispatcher<T>,
  ];

export function createRadioGroupCore<T>(
  state: RadioGroupState<T>,
  config: StateConfigMap<RadioGroupState<T>>,
): [
  stateManager: RadioGroupStateManager<T>,
  viewModelManager: RadioGroupViewModelManager<T>,
  dispatcher: RadioGroupDispatcher<T>,
  ] {
  return createCore<RadioGroupVMs<T>>()(
    state,
    config,
    createActionHandlers<T>(),
  );
}
