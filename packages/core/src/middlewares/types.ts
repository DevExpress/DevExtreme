import { UnknownRecord } from '../utils';

export interface StatePropertyConfig<T> {
  controlledMode: boolean;
  changeCallback(value: T): void;
}

export type StateConfigMap<TState extends UnknownRecord> = {
  [P in keyof TState]?: StatePropertyConfig<TState[P]>
};
