import {
  createObservableEmitter,
  UnknownRecord,
  SubscribeFunc,
} from './utils';

export interface State<TState extends UnknownRecord> {
  getCurrent(): TState;
  addUpdate(statePart: Partial<TState>): void;
  commitUpdates(): void;
  rollbackUpdates(): void;
  triggerRender(state: TState): void;
  subscribeForRender: SubscribeFunc<TState>;
}

export function createState<TState extends UnknownRecord>(
  initialState: TState,
): State<TState> {
  let current = initialState;
  let next = initialState;

  const { emit, subscribe } = createObservableEmitter<TState>(
    initialState,
  );

  const getCurrent = () => current;

  const addUpdate = (
    statePart: Partial<TState>,
  ): void => {
    next = {
      ...next,
      ...statePart,
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
