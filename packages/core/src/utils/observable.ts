export type Listener<T> = (value: T) => void;

export interface Emitter<T> {
  emit: (value: T) => void;
}

export type SubscribeFunc<T> = (listener: Listener<T>) => () => void;

export interface Observable<T> {
  subscribe: SubscribeFunc<T>;
  getValue(): T;
}

export function createObservableEmitter<T>(initialValue: T): Emitter<T> & Observable<T> {
  const listeners = new Set<Listener<T>>();
  let lastValue: T = initialValue;

  const emit = (value: T): void => {
    lastValue = value;
    listeners.forEach((listener) => listener(value));
  };

  const subscribe = (newListener: Listener<T>): () => void => {
    listeners.add(newListener);

    return () => { listeners.delete(newListener); };
  };

  const getValue = () => lastValue;

  return {
    emit,
    subscribe,
    getValue,
  };
}
