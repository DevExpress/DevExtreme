import {EventEmitter} from '@angular/core';
import {DeepPartial} from 'ts-essentials';
import {AngularTemplate} from './templates';

type OutputProperty<P extends string> = `${P}Change`;

type WithOutputCallback<T> = { [P in keyof T & string as OutputProperty<P>]: (value: T[P]) => void };
type WithOutputEventEmitter<T> = { [P in keyof T & string as OutputProperty<P>]: EventEmitter<T[P]> };
type WithTemplate<T> = { [P in keyof T]?: AngularTemplate<unknown> };

type AngularCallbacks<TModel> = WithOutputCallback<TModel>;
type AngularContracts<TModel, TConfig, TTemplate> =
  DeepPartial<TModel>
  & WithOutputEventEmitter<TModel>
  & DeepPartial<TConfig>
  & WithTemplate<TTemplate>;

export type {
  AngularCallbacks,
  AngularContracts,
}
