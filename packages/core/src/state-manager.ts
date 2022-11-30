import { callbacksMiddleware, controlledModeMiddleware, StateConfigMap } from './middlewares';
import { createReducer, Handlers } from './reducer';
import { State } from './state';
import { ObjectType, pipe, PipeFunc } from './utils';

export interface StateManager<TState extends ObjectType> {
  addUpdate(updateFunc: (state: TState) => Partial<TState>): void;
  commitUpdates(): void;
  rollbackUpdates(): void;
}

export interface Dispatcher<TState extends ObjectType,
  THandlers extends Handlers<TState>,
  > {
  dispatch: <TAction extends keyof THandlers>(
    action: TAction,
    value: Parameters<THandlers[TAction]>[1],
  ) => void;
}

export type StateStoreTuple<TState extends ObjectType,
  THandlers extends Handlers<TState>,
  > = [
  stateManager: StateManager<TState>,
  dispatcher: Dispatcher<TState, THandlers>,
  ];

export function createStateManager<TState extends ObjectType,
  THandlers extends Handlers<TState>,
  >(
  state: State<TState>,
  stateConfig: StateConfigMap<TState>,
  actionHandlers: THandlers,
  validation: PipeFunc<TState>[] = [],
): StateStoreTuple<TState, THandlers> {
  const reducer = createReducer<TState>()(actionHandlers);
  const validator = pipe(...validation);

  const changeState = (
    currentState: TState,
    validatedState: TState,
  ): boolean => {
    const [newState, hasChanges] = controlledModeMiddleware(
      currentState,
      validatedState,
      stateConfig,
    );

    if (hasChanges) {
      state.addUpdate(() => newState);
      state.commitUpdates();
    }

    return hasChanges;
  };

  const callCallbacks = (
    currentState: TState,
    validatedState: TState,
  ): void => {
    const pendingCallbacks = callbacksMiddleware(
      currentState,
      validatedState,
      stateConfig,
    );

    pendingCallbacks.forEach((callback) => callback());
  };

  const commitUpdates = () => {
    state.commitUpdates();

    const currentState = state.getCurrent();
    const validatedState = validator(currentState);

    changeState(currentState, validatedState);
    state.triggerRender(state.getCurrent());

    callCallbacks(currentState, validatedState);
  };

  const dispatch = <TAction extends keyof THandlers>(
    action: TAction,
    value: Parameters<THandlers[TAction]>[1],
  ) => {
    const currentState = state.getCurrent();
    const newState = {
      ...currentState,
      ...reducer(currentState, action, value),
    };
    const validatedState = validator(newState);

    const hasChanges = changeState(currentState, validatedState);

    if (hasChanges) {
      state.triggerRender(state.getCurrent());
    }

    callCallbacks(currentState, validatedState);
  };

  return [{
    addUpdate: state.addUpdate,
    commitUpdates,
    rollbackUpdates: state.rollbackUpdates,
  }, {
    dispatch,
  }];
}
