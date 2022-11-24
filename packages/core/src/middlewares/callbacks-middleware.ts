import { ActionFunc, ObjectType } from '../utils';
import { StateConfigMap } from './types';
import { getChangedKeys } from './get-changed-keys';

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
