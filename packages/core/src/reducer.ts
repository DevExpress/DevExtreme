import { AnyRecord, UnknownRecord } from './utils';

type Handler<TState, TValue> = (state: TState, value: TValue) => Partial<TState>;

export type Handlers<
  TState extends UnknownRecord,
  TActions extends UnknownRecord = AnyRecord,
> = {
  [K in keyof TActions]: Handler<TState, TActions[K]>
};

export type Reducer<
  TState extends UnknownRecord,
  THandlers extends Handlers<TState>,
> = <TAction extends keyof THandlers>(
  state: TState,
  action: TAction,
  value: Parameters<THandlers[TAction]>[1]
) => Partial<TState>;

export function createReducer<TState extends UnknownRecord>() {
  return <THandlers extends Handlers<TState>>(
    handlers: THandlers,
  ): Reducer<TState, THandlers> => {
    const invalidActions = Reflect.ownKeys(handlers).filter((k) => handlers[k] === undefined);
    if (invalidActions.length > 0) {
      throw new Error(`Handlers for actions are not defined: ${invalidActions.join(', ')}`);
    }

    return (state, action, value) => {
      if (!handlers[action]) {
        throw new Error(`Unknown action: '${String(action)}'`);
      }

      return handlers[action](state, value);
    };
  };
}
