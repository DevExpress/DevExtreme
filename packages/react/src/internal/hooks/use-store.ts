import {
  Selector,
  StoreState,
  UnknownRecord,
} from '@devextreme/core';
import { useEffect, useState } from 'react';

export function useStoreSelector<
  TState extends UnknownRecord,
  TValue,
  >(
  store: StoreState<TState>,
  selector: Selector<TState, TValue>,
): TValue {
  const [state, setState] = useState(selector(store.getState()));

  useEffect(() => store.subscribe((stateValue: TState) => {
    setState(selector(stateValue));
  }), [selector]);

  return state;
}
