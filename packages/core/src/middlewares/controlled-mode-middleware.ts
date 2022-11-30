import { ObjectType } from '../utils';
import { StateConfigMap } from './types';
import { getChangedKeys } from './get-changed-keys';

type ModelChangesTuple<TState extends ObjectType> = [newModel: TState, hasChanges: boolean];

export function controlledModeMiddleware<TState extends ObjectType>(
  prev: TState,
  next: TState,
  config: StateConfigMap<TState> = {},
): ModelChangesTuple<TState> {
  const result = { ...next };
  const changedKeys = getChangedKeys(prev, next);
  const controlledModeKeys = changedKeys
    .filter((key) => config[key]?.controlledMode);

  controlledModeKeys.forEach((controlledKey) => {
    result[controlledKey] = prev[controlledKey];
  });

  const hasChanges = changedKeys.length - controlledModeKeys.length > 0;
  return [result, hasChanges];
}
