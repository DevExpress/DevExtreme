import { DeepReadonly } from 'ts-essentials';

type Listener<T> = (value: DeepReadonly<T>) => void;

interface Observable<T> {
    subscribe: (listener: Listener<T>) => () => void;
}

interface InternalObservable<T> extends Observable<T> {
    emit: (value: DeepReadonly<T>) => void;
}

function createObservable<T>(): InternalObservable<T> {
    let listeners: Listener<T>[] = [];

    const emit = (value: DeepReadonly<T>): void => {
        listeners.forEach((listener) => listener(value));
    };

    const subscribe = (newListener: Listener<T>): () => void => {
        listeners = [...listeners, newListener];

        return () => listeners = listeners.filter((listener) => listener !== newListener);
    };

    return {
        emit,
        subscribe
    };
}

export type { Observable, InternalObservable };
export { createObservable };
