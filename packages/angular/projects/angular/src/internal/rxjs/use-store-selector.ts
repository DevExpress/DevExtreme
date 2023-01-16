import { Selector, StoreState, UnknownRecord } from '@devextreme/core';
import { finalize, Observable, startWith } from 'rxjs';

export function useStoreSelector<
  TState extends UnknownRecord,
  TValue,
  >(
  store: StoreState<TState>,
  selector: Selector<TState, TValue>,
): Observable<TValue> {
  let unsubscribe: () => void;
  return new Observable<TValue>((observer) => {
    unsubscribe = store.subscribe((state) => {
      observer.next(selector(state));
    });
  }).pipe(
    startWith(selector(store.getState())),
    finalize(() => { unsubscribe(); }),
  );
}
