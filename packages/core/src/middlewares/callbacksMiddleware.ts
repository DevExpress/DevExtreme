import { ActionFunc, ObjectType } from '../utils';
import { ModelConfigMap } from './types';
import { getChangedKeys } from './getChangedKeys';

export function callbacksMiddleware<TModel extends ObjectType>(
  prev: TModel,
  next: TModel,
  config: ModelConfigMap<TModel> = {},
): ActionFunc[] {
  return getChangedKeys(prev, next).reduce((result, key) => {
    const configItem = config[key];

    if (configItem) {
      result.push(() => { configItem.changeCallback(next[key]); });
    }

    return result;
  }, [] as ActionFunc[]);
}
