import { ObjectType } from '../utils';

export interface ModelPropertyConfig<T> {
  controlledMode: boolean;
  changeCallback: (value: T) => void;
}

export type ModelConfigMap<TModel extends ObjectType> = {
  [P in keyof TModel]?: ModelPropertyConfig<TModel[P]>
};
