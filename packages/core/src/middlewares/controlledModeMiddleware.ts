import { ObjectType } from '../utils';
import { ModelConfigMap } from './types';
import { getChangedKeys } from './getChangedKeys';

type ModelChangesTuple<TModel extends ObjectType> = [newModel: TModel, hasChanges: boolean];

export function controlledModeMiddleware<TModel extends ObjectType>(
  prev: TModel,
  next: TModel,
  config: ModelConfigMap<TModel> = {},
): ModelChangesTuple<TModel> {
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
