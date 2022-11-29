import { ActionFunc, ObjectType } from '../utils';
import { getChangedKeys } from './get-changed-keys';
import { StateConfigMap } from './types';

export function callbacksMiddleware<TState extends ObjectType>(
  prev: TState,
  next: TState,
  config: StateConfigMap<TState> = {},
): ActionFunc[] {
  return getChangedKeys(prev, next).reduce((result, key) => {
    const configItem = config[key];

    if (configItem) {
      result.push(() => { configItem.changeCallback(next[key]); });
    }

    return result;
  }, [] as ActionFunc[]);
}
