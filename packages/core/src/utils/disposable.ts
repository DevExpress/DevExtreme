export const DISPOSE = Symbol('dispose');

export type DisposeFunc = () => void;

export type Disposable<T> = T & {
  [DISPOSE]: DisposeFunc;
};
