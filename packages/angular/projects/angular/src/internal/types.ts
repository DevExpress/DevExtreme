import { EventEmitter, TemplateRef, Type } from '@angular/core';

// --- inputs ---

type OutputProperty<P extends string> = `${P}Change`;

type WithEventEmitter<T> =
  { [P in keyof T & string as OutputProperty<P>]: EventEmitter<T[P]> };
type WithTemplate<T> =
  { [P in keyof T]?: AngularTemplate<T[P]> };

export type Inputs<TModel, TConfig, TTemplate> =
  Partial<TModel>
  & WithEventEmitter<TModel>
  & Partial<TConfig>
  & WithTemplate<TTemplate>;

// --- common ---

// angular has bad typed templates, so we need any here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AngularTemplate<TComponent> = TemplateRef<any> | Type<TComponent>;
