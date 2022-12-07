import {
  Comparer,
  createObservableEmitter,
  Disposable,
  DISPOSE,
  memoize, Observable,
  shadowComparer,
  SubscribeFunc,
  UnknownRecord,
} from './utils';

export type Selector<TState extends UnknownRecord, TValue> = (state: TState) => TValue;

export type ViewModelValue<T> = Disposable<Observable<T>>;

export type SelectorMap<
  TStateProps extends UnknownRecord,
  TViewModelProps extends UnknownRecord,
> = {
  [K in keyof TViewModelProps]?: Selector<TStateProps, TViewModelProps[K]>
};

export type ViewModel<TProps extends UnknownRecord> = {
  [K in keyof TProps]?: ViewModelValue<TProps[K]>
};

export function createSelector<
  TStateProps extends UnknownRecord,
  TParam extends UnknownRecord,
  TValue,
>(
  buildViewProp: (params: TParam) => TValue,
  paramsGetter: (state: TStateProps | undefined) => TParam,
  paramsComparer: Comparer<[TParam]> = shadowComparer,
): Selector<TStateProps, TValue> {
  const cached = memoize(buildViewProp, paramsComparer);

  return (state: TStateProps | undefined) => cached(paramsGetter(state));
}

export function createViewModelValue<TStateProps extends UnknownRecord, TValue>(
  initialStateProps: TStateProps,
  subscribeToUpdates: SubscribeFunc<TStateProps>,
  selector: Selector<TStateProps, TValue>,
): ViewModelValue<TValue> {
  const { emit, subscribe, getValue } = createObservableEmitter(selector(initialStateProps));
  const unsubscribe = subscribeToUpdates((value) => emit(selector(value)));

  return {
    subscribe,
    getValue,
    [DISPOSE]: unsubscribe,
  };
}
