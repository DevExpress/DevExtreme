import { Component, Input } from '@angular/core';
import { type DeepReadonly } from 'ts-essentials';
import { AngularViewActionsData, AngularViewData, AngularViewModelData } from '../../types/index';
import { DxViewComponent } from './dx-view.component';


@Component({ template: '' })
export abstract class DxViewModelContracts<TViewModel>
  extends DxViewComponent
  implements AngularViewModelData<TViewModel> {
  @Input() viewModel!: DeepReadonly<TViewModel>;
}

@Component({ template: '' })
export abstract class DxViewActionsContracts<TViewActions>
  extends DxViewComponent
  implements AngularViewActionsData<TViewActions> {
  @Input() actions!: DeepReadonly<TViewActions>;
}

@Component({ template: '' })
export abstract class DxViewContracts<TViewModel, TViewActions>
  extends DxViewComponent
  implements AngularViewData<TViewModel, TViewActions> {
  @Input() viewModel!: DeepReadonly<TViewModel>;
  @Input() actions!: DeepReadonly<TViewActions>;
}
