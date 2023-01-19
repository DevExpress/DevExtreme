import { callbacksMiddleware, controlledModeMiddleware, StateConfigMap } from './middlewares';
import {
  createObservableEmitter, getChangedKeys,
  pipe, PipeFunc, SubscribeFunc, UnknownRecord,
} from './utils';

export type UpdateStateAction<TState extends UnknownRecord> = (state: TState) => Partial<TState>;

export interface Store<TState extends UnknownRecord> {
  getState(): TState;
  subscribe: SubscribeFunc<TState>;
  addUpdate(updateAction: UpdateStateAction<TState>): void;
  commitPropsUpdates(): void;
  commitUpdates(): void;
  rollbackUpdates(): void;
}

export function createStore<
  TState extends UnknownRecord,
  >(
  initialState: TState,
  stateConfig: StateConfigMap<TState>,
  validation: PipeFunc<TState>[] = [],
): Store<TState> {
  let currentState = initialState;
  let nextState = initialState;

  const { emit, subscribe } = createObservableEmitter<TState>(
    initialState,
  );
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
    updateAction: UpdateStateAction<TState>,
  ): void => {
    nextState = {
      ...nextState,
      ...updateAction(nextState),
    };
  };

  const commitPropsUpdates = () => {
    currentState = nextState;
    baseCommitUpdate(validator(currentState));
  };

  const commitUpdates = () => {
    baseCommitUpdate(validator(nextState));
  };

  const rollbackUpdates = () => {
    nextState = currentState;
  };

  return {
    getState,
    subscribe,
    addUpdate,
    commitPropsUpdates,
    commitUpdates,
    rollbackUpdates,
  };
}
