import type { PropertyType } from '@js/core';

// TODO: move types to index.d.ts file

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

// eslint-disable-next-line spellcheck/spell-checker
type DecrementalCounter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

type IsObject<T> =
0 extends (1 & T)
  ? false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  : T extends any[]
    ? false
    : string extends keyof T
      ? false
      : T extends object
        ? true
        : false;

type DotNestedKeys<T, RLIMIT extends number = 10> =
(
  IsObject<T> extends true ?
    (
      RLIMIT extends 1 ? keyof T :
        {
          // eslint-disable-next-line spellcheck/spell-checker
          [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K], DecrementalCounter[RLIMIT]>>}` | K
        }[Exclude<keyof T, symbol>]
    ) :
    ''
) extends infer D ? Extract<D, string> : never;

export type ComponentPropertyType<
T, TProp extends string,
> = PropertyType<T, TProp> extends never ? never : PropertyType<T, TProp> | undefined;
interface OptionChangedArgs<TProperties, TKey extends string = string> {
  name: TKey extends `${infer TName}.${string}` ? TName : TKey;
  fullName: TKey;
  previousValue: ComponentPropertyType<TProperties, TKey>;
  value: ComponentPropertyType<TProperties, TKey>;
  handled: boolean;
}

type OptionNames<TProperties> = DotNestedKeys<Required<TProperties>>;

export type OptionChanged<TProperties> = {
  [P in OptionNames<TProperties>]: OptionChangedArgs<TProperties, P>;
}[OptionNames<TProperties>];
