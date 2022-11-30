import {
  createObservableEmitter,
  ObjectType,
  SubscribeFunc,
} from './utils';

export interface State<TState extends ObjectType> {
  getCurrent(): TState;
  addUpdate(updateFunc: (state: TState) => Partial<TState>): void;
  commitUpdates(): void;
  rollbackUpdates(): void;
  triggerRender(state: TState): void;
  subscribeForRender: SubscribeFunc<TState>;
}

export function createState<TState extends ObjectType>(
  initialState: TState,
): State<TState> {
  let current = initialState;
  let next = initialState;

  const { emit, subscribe } = createObservableEmitter<TState>(
    initialState,
  );

  const getCurrent = () => current;

  const addUpdate = (
    updateFunc: (state: TState) => Partial<TState>,
  ): void => {
    next = {
      ...next,
      ...updateFunc(next),
    };
  };

  const commitUpdates = () => {
    current = next;
  };

  const rollbackUpdates = () => {
    next = current;
  };

  return {
    getCurrent,
    addUpdate,
    commitUpdates,
    rollbackUpdates,
    triggerRender: emit,
    subscribeForRender: subscribe,
  };
}
