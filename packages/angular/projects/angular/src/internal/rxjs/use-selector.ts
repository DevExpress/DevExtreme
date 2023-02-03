import { Selector, Store, UnknownRecord } from '@devextreme/core';
import {
  combineLatest,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  OperatorFunction,
  pipe,
  startWith,
} from 'rxjs';
import { ObservableArray } from '../types';

function getStateObservable<
  TState extends UnknownRecord,
  >(
  store: Store<TState>,
): Observable<TState> {
  let unsubscribe: () => void;
  return new Observable<TState>((observer) => {
    unsubscribe = store.subscribe((state) => {
      observer.next(state);
    });
  }).pipe(
    startWith(store.getState()),
    finalize(() => { unsubscribe(); }),
  );
}

function applySelector<
  TState extends UnknownRecord,
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TSelectorDeps extends any[],
  >(
  createSelector: (...args: TSelectorDeps) => Selector<TState, TValue>,
): OperatorFunction<[TState, ...TSelectorDeps], TValue> {
  return pipe(
    map(([state, ...selectorArgs]: [TState, ...TSelectorDeps]) => {
      const selector = createSelector(...selectorArgs);
      return selector(state);
    }),
    distinctUntilChanged(),
  );
}

// TODO Vinogradov: Keep the eye on the selectorDeps param type.
// It may be not convenient to pass selector params as separate observables.
// It has workarounds, but need to get cases of usage to make a decision.
export function useSelector<
  TState extends UnknownRecord,
  TValue,
  TSelectorDeps extends unknown[],
  >(
  store: Store<TState>,
  createSelector: (...args: TSelectorDeps) => Selector<TState, TValue>,
  selectorDeps: ObservableArray<TSelectorDeps>,
): Observable<TValue> {
  return combineLatest<[TState, ...TSelectorDeps]>([
    getStateObservable(store),
    ...selectorDeps,
  ]).pipe(
    applySelector(createSelector),
  );
}
