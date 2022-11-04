import { ReactCallbacks } from '../types/index';

type ContextCallbacks<TModel> = Required<ReactCallbacks<TModel>>;
type ComponentContext<TStore, TModel> = [
  store: TStore,
  callbacks: ContextCallbacks<TModel>
];

export type {
    ContextCallbacks,
    ComponentContext
};
