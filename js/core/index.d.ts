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
export type DeepPartial<T> = T extends Scalar ? T : {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type ItemType<T> = T extends (infer TItem)[] ? TItem : T;
type Property<T, TPropName extends string> = T extends Partial<Record<TPropName, infer TValue>> ? TValue : never;
type OwnPropertyType<T, TPropName extends string> = Property<ItemType<T>, TPropName>;

export type PropertyType<T, TProp extends string> =
  TProp extends `${infer TOwnProp}.${infer TNestedProps}`
    ? PropertyType<OwnPropertyType<T, TOwnProp>, TNestedProps>
    : OwnPropertyType<T, TProp>;

export type OmitInternal<T> = Omit<T, `${'_' | '$'}${any}`>;

export type ExcludeFromTuple<T extends unknown[], E> = T extends [infer Head, ... infer Tail] ? Head extends E ? ExcludeFromTuple<Tail, E> : [Head, ... ExcludeFromTuple<Tail, E>] : [];

/**
 * Generates all possible {@link https://en.wikipedia.org/wiki/Permutation#k-permutations_of_n k-permutations} (k = [1...n])
 */
export type AllPermutations<T extends string[]> = T extends [infer Last] ? Last : Permutations<T> | {
  [K in T[number]]: AllPermutations<ExcludeFromTuple<T, K>>
}[T[number]];

/**
 * Generates {@link https://en.wikipedia.org/wiki/Permutation permutations} from a string tuple
 */
export type Permutations<T extends string[]> = T extends [] ? any : T extends [infer Last] ? Last : {
  [K in T[number]]: `${K} ${Permutations<ExcludeFromTuple<T, K>>}`
}[T[number]];
