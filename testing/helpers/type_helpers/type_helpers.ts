/* eslint-disable @typescript-eslint/no-type-alias */
export type RecursivePropertyType<T, TProps extends string[]> =
  TProps extends [infer TProp]
    ? (
      T extends (infer T2)[]
        ? RecursivePropertyType<T2, TProps>
        : (
          TProp extends string
            ? (
              T extends Partial<Record<TProp, infer TValue>>
                ? TValue
                : never
            )
            : never
        )
    )
    : (
      TProps extends [infer TProp, ... infer Rest]
        ? (
          TProp extends string
            ? Rest extends string[]
              ? RecursivePropertyType<RecursivePropertyType<T, [TProp]>, Rest>
              : never
            : never
        )
        : never
    );

export type Equals<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;
