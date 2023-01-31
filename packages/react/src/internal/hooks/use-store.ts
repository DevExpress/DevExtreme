import {
  Selector,
  Store,
  UnknownRecord,
} from '@devextreme/core';
import { useEffect, useMemo, useState } from 'react';

export function useStoreSelector<
  TState extends UnknownRecord,
  TValue,
  TSelectorDeps extends unknown[],
  >(
  store: Store<TState>,
  createSelector: (...params: TSelectorDeps) => Selector<TState, TValue>,
  selectorDeps: TSelectorDeps,
): TValue {
  const selector = useMemo(() => createSelector(...selectorDeps), selectorDeps);
  const [state, setState] = useState(selector(store.getState()));

  useEffect(() => store.subscribe((stateValue: TState) => {
    setState(selector(stateValue));
  }), [selector]);

  return state;
}
