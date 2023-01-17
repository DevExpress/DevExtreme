import { callbacksMiddleware, controlledModeMiddleware, StateConfigMap } from './middlewares';
import { createReducer, Handlers } from './reducer';
import {
  createObservableEmitter, getChangedKeys,
  pipe, PipeFunc, SubscribeFunc, UnknownRecord,
} from './utils';

export interface StoreState<TState extends UnknownRecord> {
  getState(): TState;
  subscribe: SubscribeFunc<TState>;
}

export interface Store<
  TState extends UnknownRecord,
  THandlers extends Handlers<TState>,
  > extends StoreState<TState> {
  addUpdate(statePart: Partial<TState>): void;
  commitUpdates(): void;
  rollbackUpdates(): void;
  dispatch: <TAction extends keyof THandlers>(
    action: TAction,
    value: Parameters<THandlers[TAction]>[1],
  ) => void;
}

export function createStore<
  TState extends UnknownRecord,
  THandlers extends Handlers<TState>,
  >(
  initialState: TState,
  stateConfig: StateConfigMap<TState>,
  actionHandlers: THandlers,
  validation: PipeFunc<TState>[] = [],
): Store<TState, THandlers> {
  let currentState = initialState;
  let nextState = initialState;

  const { emit, subscribe } = createObservableEmitter<TState>(
    initialState,
  );
  const reducer = createReducer<TState>()(actionHandlers);
  const validator = pipe(...validation);

  const baseCommitUpdate = (validatedState: TState) => {
    const pendingCallbacks = callbacksMiddleware(
      currentState,
      validatedState,
      stateConfig,
    );
    const newState = controlledModeMiddleware(
      currentState,
      validatedState,
      stateConfig,
    );

    const hasChanges = getChangedKeys(currentState, newState);
    if (hasChanges) {
      currentState = newState;
      emit(newState);
    }

    pendingCallbacks.forEach((callback) => callback());
  };

  const getState = () => currentState;

  const addUpdate = (
    statePart: Partial<TState>,
  ): void => {
    nextState = {
      ...nextState,
      ...statePart,
    };
  };

  const commitUpdates = () => {
    currentState = nextState;
    baseCommitUpdate(validator(currentState));
  };

  const rollbackUpdates = () => {
    nextState = currentState;
  };

  const dispatch = <TAction extends keyof THandlers>(
    action: TAction,
    value: Parameters<THandlers[TAction]>[1],
  ) => {
    nextState = {
      ...currentState,
      ...reducer(currentState, action, value),
    };

    baseCommitUpdate(nextState);
  };

  return {
    getState,
    subscribe,
    addUpdate,
    commitUpdates,
    rollbackUpdates,
    dispatch,
  };
}
