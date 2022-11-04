import { DeepReadonly } from 'ts-essentials';
import { Selector } from '@devexpress/core/internal';
import { useEffect, useState } from 'react';

interface HookStoreInterface<TState> {
    getState: () => DeepReadonly<TState>;
    subscribe: (func: (state: DeepReadonly<TState>) => void) => () => void;
}

function useSelector<TState, TResult>(
    store: HookStoreInterface<TState>,
    selector: Selector<TState, TResult>
): DeepReadonly<TResult> {
    const [state, setState] = useState(selector(store.getState()));
    useEffect(() => {
        const unsubscribe = store.subscribe((state: DeepReadonly<TState>) => {
            setState(selector(state));
        });

        return () => unsubscribe();
    }, []);

    return state;
}

export { useSelector };
