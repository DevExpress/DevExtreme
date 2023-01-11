import {
  defaultSelector,
  Selector,
  Store,
  UnknownRecord,
} from '@devextreme/core';
import { useEffect, useState } from 'react';

export function useStoreSelector<TState extends UnknownRecord, TValue>(
  store: Store<TState>,
  selector: Selector<TState, TValue>,
): TValue {
  const [state, setState] = useState(selector(store.getState()));

  useEffect(() => store.subscribe((stateValue) => {
    setState(selector(stateValue));
  }), []);

  return state;
}

export function useStoreState<TState extends UnknownRecord>(
  store: Store<TState>,
): TState {
  return useStoreSelector(store, defaultSelector);
}
