import { MutableRefObject, useMemo, useRef } from 'react';

function decorateCallback<T>(
  callback?: Callback<T>,
): Callback<T> {
  return (value: T) => callback && callback(value);
}

export type Callback<T> = (value: T) => void;

export function useCallbackRef<T>(
  callback?: Callback<T>,
): MutableRefObject<Callback<T>> {
  const ref = useRef(decorateCallback(callback));
  useMemo(() => {
    ref.current = decorateCallback(callback);
  }, [callback]);

  return ref;
}
