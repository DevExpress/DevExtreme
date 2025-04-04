import type { Action, Template } from '@ts/grids/new/grid_core/types';
import type { ComponentType } from 'inferno';

export type OwnProperty<T, TPropName extends string> =
  TPropName extends keyof Required<T>
    ? Required<T>[TPropName]
    : unknown;

export type PropertyTypeBase<T, TProp extends string> =
  TProp extends `${infer TOwnProp}.${infer TNestedProps}`
    ? PropertyTypeBase<OwnProperty<T, TOwnProp>, TNestedProps>
    : OwnProperty<T, TProp>;

export type PropertyType<TProps, TProp extends string> =
  unknown extends PropertyTypeBase<TProps, TProp>
    ? unknown
    : PropertyTypeBase<TProps, TProp> | undefined;

export type PropertyWithDefaults<TProps, TDefaults, TProp extends string> =
  unknown extends PropertyType<TDefaults, TProp>
    ? PropertyType<TProps, TProp>
    : NonNullable<PropertyType<TProps, TProp>> | PropertyTypeBase<TDefaults, TProp>;

export type TemplateProperty<TProps, TProp extends string> =
  NonNullable<PropertyType<TProps, TProp>> extends Template<infer TTemplateProps>
    ? ComponentType<TTemplateProps> | undefined
    : unknown;

export type ActionProperty<TProps, TProp extends string> =
  NonNullable<PropertyType<TProps, TProp>> extends Action<infer TActionArgs>
    ? (args: TActionArgs) => void
    : unknown;
