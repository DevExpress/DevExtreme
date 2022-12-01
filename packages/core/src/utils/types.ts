// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<PropertyKey, any>;
export type UnknownRecord = Record<PropertyKey, unknown>;
export type Comparer<T> = (prev: T, next: T) => boolean;
export type ActionFunc = () => void;
