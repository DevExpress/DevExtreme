import { getChangedKeys, UnknownRecord } from '../utils';
import { StateConfigMap } from './types';

export function controlledModeMiddleware<TState extends UnknownRecord>(
  prev: TState,
  next: TState,
  config: StateConfigMap<TState> = {},
): TState {
  const result = { ...next };
  const changedKeys = getChangedKeys(prev, next);
  const controlledModeKeys = changedKeys
    .filter((key) => config[key]?.controlledMode);

  controlledModeKeys.forEach((controlledKey) => {
    result[controlledKey] = prev[controlledKey];
  });

  return result;
}
