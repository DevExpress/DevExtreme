/* eslint-disable @typescript-eslint/no-type-alias */
export type PropertyType<T, TProp extends PropertyKey> =
  T extends (infer T2)[]
    ? PropertyType<T2, TProp>
    : T extends Partial<Record<TProp, infer TValue>>
      ? TValue
      : never;

export type DeepPropertyType<T, TProps extends PropertyKey[]> =
  TProps extends [infer TProp]
    ? PropertyType<T, TProp & PropertyKey>
    : (TProps extends [infer TProp, ... infer Rest]
      ? (Rest extends PropertyKey[]
        ? DeepPropertyType<PropertyType<T, TProp & PropertyKey>, Rest>
        : never
      )
      : never
    );

export type Equals<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;
