import type { DataAccessorGetter, DataAccessorSetter } from './types';

export abstract class DataAccessor<
  T,
  KnownFields extends Record<string, unknown>,
> {
  /** @deprecated instead of `getter` property use `get` function. getter will be private */
  public getter: Record<string, DataAccessorGetter<T>> = {};

  /** @deprecated instead of `setter` property use `set` function. setter will be private */
  public setter: Record<string, DataAccessorSetter<T>> = {};

  protected updateExpressions<Fields extends Record<string, string>>(fields: Fields): void {
    Object.entries(fields).forEach(([key, value]) => this.updateExpression(key, value));
  }

  public abstract updateExpression(field: string, expr: string | undefined): void;

  public get<K extends keyof KnownFields>(field: K, obj: T): KnownFields[K];
  public get<K extends string>(field: K, obj: T): unknown | undefined;
  public get(field: string, obj: T): unknown | undefined {
    if (this.getter[field]) {
      return this.getter[field](obj);
    }

    return undefined;
  }

  public set<K extends keyof KnownFields>(field: K, obj: T, value: KnownFields[K]): this {
    if (this.setter[field as string]) {
      this.setter[field as string](obj, value);
    }

    return this;
  }
}
