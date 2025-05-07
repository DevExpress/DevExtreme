type KeyOf<T> = T extends never ? never : keyof T;

type KeysOf<T1, T2, T3, T4, T5, T6, T7, T8> =
  KeyOf<T1> | KeyOf<T2> | KeyOf<T3> | KeyOf<T4> | KeyOf<T5> | KeyOf<T6> | KeyOf<T7> | KeyOf<T8>;

type Seal<T, K extends keyof any> = T & {
  [P in Exclude<K, keyof T>]?: never;
};

// Exact props check, see https://github.com/Microsoft/TypeScript/issues/12936
export type Xor<T1, T2 = never, T3 = never, T4 = never, T5 = never, T6 = never, T7 = never, T8 = never, T9 = never> =
  | Seal<T1, KeysOf<T2, T3, T4, T5, T6, T7, T8, T9>>
  | Seal<T2, KeysOf<T1, T3, T4, T5, T6, T7, T8, T9>>
  | Seal<T3, KeysOf<T1, T2, T4, T5, T6, T7, T8, T9>>
  | Seal<T4, KeysOf<T1, T2, T3, T5, T6, T7, T8, T9>>
  | Seal<T5, KeysOf<T1, T2, T3, T4, T6, T7, T8, T9>>
  | Seal<T6, KeysOf<T1, T2, T3, T4, T5, T7, T8, T9>>
  | Seal<T7, KeysOf<T1, T2, T3, T4, T5, T6, T8, T9>>
  | Seal<T8, KeysOf<T1, T2, T3, T4, T5, T6, T7, T9>>
  | Seal<T9, KeysOf<T1, T2, T3, T4, T5, T6, T7, T8>>;

export type Scalar = undefined | null | string | String | number | Number | bigint | BigInteger | boolean | Boolean | Date | Function | Symbol | Array<unknown>;
export type DeepPartial<T> = T | (T extends Scalar ? T : {
  [P in keyof T]?: DeepPartial<T[P]>;
});

type ItemType<T> = T extends (infer TItem)[] ? TItem : T;
type Property<T, TPropName extends string> = T extends Partial<Record<TPropName, infer TValue>> ? TValue : never;
type OwnPropertyType<T, TPropName extends string> = Property<ItemType<T>, TPropName>;

export type PropertyType<T, TProp extends string> =
  TProp extends `${infer TOwnProp}.${infer TNestedProps}`
    ? PropertyType<OwnPropertyType<T, TOwnProp>, TNestedProps>
    : OwnPropertyType<T, TProp>;

export type OmitInternal<T> = Omit<T, `${'_' | '$'}${any}`>;

/**
 * IncrementalCounter[1]=2, IncrementalCounter[2]=3, IncrementalCounter[3]=4, ...
 */
type IncrementalCounter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

/**
 * Returns the number of union elements or unknown if it is too large.
 */
type UnionLength<T extends string> = UnionLengthInner<T, 1>;
type UnionLengthInner<T extends string, C extends number> = C extends undefined ? unknown : {
  [K in T]: Exclude<T, K> extends never ? C : UnionLengthInner<Exclude<T, K>, IncrementalCounter[C]>
}[T];

type PermutedUnionLength = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Returns {@link https://en.wikipedia.org/wiki/Permutation permutations} from a string tuple.
 * If union contains more than 7 elements, returns string.
 */
export type Permutations<T extends string> = UnionLength<T> extends PermutedUnionLength ? {
  [K in T]: Exclude<T, K> extends never ? K : `${Permutations<Exclude<T, K>>} ${K}`
}[T] : string;

/**
 * Returns all possible {@link https://en.wikipedia.org/wiki/Permutation#k-permutations_of_n k-permutations} (k = [1...n])
 * If union contains more than 7 elements, returns string.
 */
export type AllPermutations<T extends string> = UnionLength<T> extends PermutedUnionLength ? {
  [K in T]: Permutations<T> | AllPermutations<Exclude<T, K>>
}[T] : string;

///#DEBUG

export type EventProps<T> = Extract<keyof T, `on${any}`>;

export type CheckedEvents<
  TProps,
  TEvents extends {
    [K in Exclude<EventProps<TProps>, TExcludedEvents>]: (e: any) => void
  } & {
    [K in Exclude<keyof TEvents, keyof TProps>]: never
  } & {
    [K in TExcludedEvents]?: never
  },
  TExcludedEvents extends keyof TProps = never,
> = TEvents;

///#ENDDEBUG
