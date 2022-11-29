import { StateConfigMap } from './middlewares';
import { Handlers } from './reducer';
import { createState } from './state';
import { createStateManager, Dispatcher, StateManager } from './state-manager';
import {
  Disposable, ObjectType, PipeFunc,
} from './utils';
import { createViewModelManager, ViewModelManager } from './view-model-manager';

export type CreateCoreResult<
  TState extends ObjectType,
  THandlers extends Handlers<TState>,
  TViewModels extends Record<PropertyKey, ObjectType>,
  > = [
    stateManager: StateManager<TState>,
    viewModelManager: Disposable<ViewModelManager<TState, TViewModels>>,
    dispatcher: Dispatcher<TState, THandlers>,
  ];

export function createCore<TViewModels extends ObjectType>() {
  return <
    TState extends ObjectType,
    THandlers extends Handlers<TState>,
    >(
    initialState: TState,
    stateConfig: StateConfigMap<TState>,
    actionHandlers: THandlers,
    validation: PipeFunc<TState>[] = [],
  ): CreateCoreResult<TState, THandlers, TViewModels> => {
    const state = createState(initialState);
    const [stateManager, dispatcher] = createStateManager(
      state,
      stateConfig,
      actionHandlers,
      validation,
    );
    const viewModelManager = createViewModelManager<TState, TViewModels>(state);

    return [
      stateManager,
      viewModelManager,
      dispatcher,
    ];
  };
}
