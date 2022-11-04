import {DeepReadonly} from 'ts-essentials';

interface AngularViewModelData<TViewModel> {
  viewModel: DeepReadonly<TViewModel>;
}

interface AngularViewActionsData<TActions> {
  actions: DeepReadonly<TActions>;
}

interface AngularViewData<TViewModel, TActions>
  extends AngularViewModelData<TViewModel>,
    AngularViewActionsData<TActions> {
}

export type {
  AngularViewModelData,
  AngularViewActionsData,
  AngularViewData,
}
