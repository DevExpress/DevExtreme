import {
  Comparer,
  createObservableEmitter,
  Disposable,
  DISPOSE,
  memoize, ObjectType,
  Observable,
  shadowComparer,
  SubscribeFunc,
} from './utils';

export type Selector<TState extends ObjectType, TViewProps> = (state: TState) => TViewProps;

export type ViewModel<TViewProps> = Disposable<Observable<TViewProps>>;

export type SelectorMap<TState extends ObjectType, TViewModels extends ObjectType> = {
  [K in keyof TViewModels]?: Selector<TState, TViewModels[K]>
};

export type ViewModelMap<TViewModels extends ObjectType> = {
  [K in keyof TViewModels]?: ViewModel<TViewModels[K]>
};

export function createSelector<TState extends ObjectType, TParam extends ObjectType, TViewProp>(
  buildViewProp: (params: TParam) => TViewProp,
  paramsGetter: (state: TState | undefined) => TParam,
  paramsComparer: Comparer<[TParam]> = shadowComparer,
): Selector<TState, TViewProp> {
  const cached = memoize(buildViewProp, paramsComparer);

  return (state: TState | undefined) => cached(paramsGetter(state));
}

export function createViewModel<TState extends ObjectType, TViewProps>(
  initialState: TState,
  subscribeToUpdates: SubscribeFunc<TState>,
  selector: Selector<TState, TViewProps>,
): ViewModel<TViewProps> {
  const { emit, subscribe, getValue } = createObservableEmitter(selector(initialState));
  const unsubscribe = subscribeToUpdates((value) => emit(selector(value)));

  return {
    subscribe,
    getValue,
    [DISPOSE]: unsubscribe,
  };
}
