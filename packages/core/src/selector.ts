import {
  Comparer, memoize, shallowComparer, UnknownRecord,
} from './utils';

export type Selector<TState extends UnknownRecord, TValue> = (state: TState) => TValue;

export function createSelector<
  TStateProps extends UnknownRecord,
  TParam extends UnknownRecord,
  TValue,
  >(
  buildViewProp: (params: TParam) => TValue,
  paramsGetter: (state: TStateProps | undefined) => TParam,
  paramsComparer: Comparer<[TParam]> = shallowComparer,
): Selector<TStateProps, TValue> {
  const cached = memoize(buildViewProp, paramsComparer);

  return (state: TStateProps | undefined) => cached(paramsGetter(state));
}

export function defaultSelector<TState extends UnknownRecord>(state: TState) {
  return state;
}
