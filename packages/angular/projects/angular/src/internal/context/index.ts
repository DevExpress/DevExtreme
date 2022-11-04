import {InjectionToken} from '@angular/core';
import {AngularCallbacks} from '../types/index';

type ContextCallbacks<TModel> = Required<AngularCallbacks<TModel>>;
type ComponentContext<TStore, TModel> = [
  store: TStore,
  callbacks: ContextCallbacks<TModel>
];

type ComponentContextContainer<TStore, TModel> = {
  context?: ComponentContext<TStore, TModel>;
}

const createInjectionToken = (token: string) => new InjectionToken(token);

export type {
  ContextCallbacks,
  ComponentContext,
  ComponentContextContainer,
};

export {createInjectionToken};
