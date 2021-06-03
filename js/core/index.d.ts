
type KeyOf<T> = T extends never ? never : keyof T;

type KeysOf<T1, T2, T3, T4, T5, T6, T7, T8> = 
  KeyOf<T1> | KeyOf<T2> | KeyOf<T3> | KeyOf<T4> | KeyOf<T5> | KeyOf<T6> | KeyOf<T7> | KeyOf<T8>;

type Seal<T, K extends keyof any> = T & {
  [P in Exclude<K, keyof T>]?: never;
};

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
