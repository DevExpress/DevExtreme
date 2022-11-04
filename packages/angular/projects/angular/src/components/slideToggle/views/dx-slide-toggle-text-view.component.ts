import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SlideToggleState} from '@devexpress/core/src/components/slideToggle';
import {DxViewModelContracts} from '../../../internal/index';

@Component({
  template: '',
})
export abstract class DxSlideToggleTextViewContracts
  extends DxViewModelContracts<SlideToggleState> {
}

@Component({
  selector: 'dx-slide-toggle-text-view',
  template: `<div>{{ viewModel.config.text }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxSlideToggleTextViewComponent extends DxSlideToggleTextViewContracts {
}
