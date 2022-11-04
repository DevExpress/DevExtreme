import { DeepReadonly } from 'ts-essentials';
import { createCache, shadowComparer } from '../utils/index';
import { Comparer, Selector } from './types';

function createSelector<TState, TParams, TResult>(
    getParams: (state: DeepReadonly<TState>) => DeepReadonly<TParams>,
    create: (params: DeepReadonly<TParams>) => DeepReadonly<TResult>,
    paramsComparer: Comparer<DeepReadonly<TParams>> = shadowComparer
): Selector<TState, TResult> {
    const cacheCreate = createCache(create, paramsComparer);

    let selectorResult: DeepReadonly<TResult>;

    return (state: DeepReadonly<TState>) => {
        const params = getParams(state);
        const newSelectorResult = cacheCreate(params);

        if (newSelectorResult !== selectorResult) {
            selectorResult = newSelectorResult;
        }

        return selectorResult;
    };
}

export { createSelector };
