import {
  callbacksMiddleware,
  controlledModeMiddleware,
  StateConfigMap,
} from './middlewares';
import {
  createObservableEmitter,
  getChangedKeys,
  pipe,
  PipeFunc,
  SubscribeFunc,
  UnknownRecord,
} from './utils';

export enum UpdateType {
  fromProps = 'fromProps',
  action = 'action',
}

export type UpdateStateAction<TState extends UnknownRecord> = (state: TState) => Partial<TState>;

export interface Store<TState extends UnknownRecord> {
  getState(): TState;
  subscribe: SubscribeFunc<TState>;
  addUpdate(updateAction: UpdateStateAction<TState>): void;
  commitUpdates(updateType?: UpdateType): void;
  rollbackUpdates(): void;
}

export function createStore<TState extends UnknownRecord>(
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

  const commitUpdateFromProps = () => {
    currentState = nextState;
    baseCommitUpdate(validator(currentState));
  };

  const commitUpdateFromAction = () => {
    baseCommitUpdate(validator(nextState));
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

  const commitUpdates = (updateType = UpdateType.action): void => {
    switch (updateType) {
      case UpdateType.fromProps:
        commitUpdateFromProps();
        break;
      default:
        commitUpdateFromAction();
        break;
    }
  };

  const rollbackUpdates = () => {
    nextState = currentState;
  };

  return {
    getState,
    subscribe,
    addUpdate,
    commitUpdates,
    rollbackUpdates,
  };
}
