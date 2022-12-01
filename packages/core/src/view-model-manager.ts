import { State } from './state';
import {
  Disposable, DISPOSE, getKeys, UnknownRecord,
} from './utils';
import {
  createViewModelValue, SelectorMap, ViewModel,
} from './view-model';

export interface ViewModelManager<TState extends UnknownRecord, TViewModels extends UnknownRecord> {
  add(selectorMap: SelectorMap<TState, TViewModels>): void;
  remove(...keys: (keyof TViewModels)[]): void;
  get(): Readonly<ViewModel<TViewModels>>;
}

export function createViewModelManager<
  TStateProps extends UnknownRecord,
  TViewModelProps extends UnknownRecord,
>(
  state: State<TStateProps>,
)
  : Disposable<ViewModelManager<TStateProps, TViewModelProps>> {
  const viewModel: ViewModel<TViewModelProps> = {};

  const add = (selectorMap: SelectorMap<TStateProps, TViewModelProps>) => {
    getKeys(selectorMap).forEach((selectorKey) => {
      if (viewModel[selectorKey]) {
        throw Error(`View model with ${selectorKey.toString()} already exist.`);
      }

      const selector = selectorMap[selectorKey];
      if (selector) {
        viewModel[selectorKey] = createViewModelValue(
          state.getCurrent(),
          state.subscribeForRender,
          selector,
        );
      }
    });
  };

  const remove = (
    ...keys: (keyof TViewModelProps)[]
  ): void => {
    keys.forEach((key) => {
      viewModel[key]?.[DISPOSE]();
      delete viewModel[key];
    });
  };

  const get = () => viewModel as Readonly<ViewModel<TViewModelProps>>;

  const dispose = () => {
    Object.values(viewModel)
      .filter((v) => !!v)
      .forEach((disposable) => {
        disposable[DISPOSE]();
      });
  };

  return {
    add,
    remove,
    get,
    [DISPOSE]: dispose,
  };
}
