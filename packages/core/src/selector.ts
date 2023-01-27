import {
  Comparer, memoize, shallowComparer, UnknownRecord,
} from './utils';

export type Selector<TState extends UnknownRecord, TValue> = (state: TState) => TValue;

export function createSelector<
  TState extends UnknownRecord,
  TParam extends UnknownRecord,
  TValue,
  >(
  paramsGetter: (state: TState) => TParam,
  buildViewProp: (params: TParam) => TValue,
  paramsComparer: Comparer<[TParam]> = shallowComparer,
): Selector<TState, TValue> {
  const cached = memoize(buildViewProp, paramsComparer);

  return (state: TState) => cached(paramsGetter(state));
}
