import { State } from './state';
import {
  Disposable, DISPOSE, getKeys, ObjectType,
} from './utils';
import {
  createViewModel, SelectorMap, ViewModelMap,
} from './view-model';

export interface ViewModelManager<TState extends ObjectType, TViewModels extends ObjectType> {
  add: (selectorMap: SelectorMap<TState, TViewModels>) => void;
  remove: (...keys: (keyof TViewModels)[]) => void;
  get: () => Readonly<ViewModelMap<TViewModels>>;
}

export function createViewModelManager<TState extends ObjectType, TViewModels extends ObjectType>(
  state: State<TState>,
)
  : Disposable<ViewModelManager<TState, TViewModels>> {
  const viewModelMap: ViewModelMap<TViewModels> = {};

  const add = (selectorMap: SelectorMap<TState, TViewModels>) => {
    getKeys(selectorMap).forEach((selectorKey) => {
      if (viewModelMap[selectorKey]) {
        throw Error(`View model with ${selectorKey.toString()} already exist.`);
      }

      const selector = selectorMap[selectorKey];
      if (selector) {
        viewModelMap[selectorKey] = createViewModel(
          state.getCurrent(),
          state.subscribeForRender,
          selector,
        );
      }
    });
  };

  const remove = (
    ...keys: (keyof TViewModels)[]
  ): void => {
    keys.forEach((key) => {
      viewModelMap[key]?.[DISPOSE]();
      delete viewModelMap[key];
    });
  };

  const get = () => viewModelMap as Readonly<ViewModelMap<TViewModels>>;

  const dispose = () => {
    Object.values(viewModelMap)
      .filter((viewModel) => !!viewModel)
      .forEach((viewModel) => {
        viewModel[DISPOSE]();
      });
  };

  return {
    add,
    remove,
    get,
    [DISPOSE]: dispose,
  };
}
