import { ActionFunc, getChangedKeys, UnknownRecord } from '../utils';
import { StateConfigMap } from './types';

export function callbacksMiddleware<TState extends UnknownRecord>(
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
