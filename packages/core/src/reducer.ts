import { UnknownRecord } from './utils';

export type Handlers<TState extends UnknownRecord> =
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<PropertyKey, (state: TState, value: any) => Partial<TState>>;

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
