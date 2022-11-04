import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SlideToggleState } from '@devexpress/core/src/components/slideToggle';
import { DxViewModelContracts } from '../../../internal/index';

@Component({
  template: '',
})
export abstract class DxSlideToggleIndicatorViewContracts
  extends DxViewModelContracts<SlideToggleState> {
}

@Component({
  selector: 'dx-slide-toggle-indicator-view',
  template: `
    <div class="dx-slide-toggle-indicator"
         [class.-left]="viewModel.config.textPosition === 'right'"
         [class.-right]="viewModel.config.textPosition === 'left'">
      <div class="dx-slide-toggle-line"
           [class.-off]="!viewModel.model.value"
           [class.-on]="viewModel.model.value">
        <div class="dx-slide-toggle-thumb"
             [class.-off]="!viewModel.model.value"
             [class.-on]="viewModel.model.value">
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dx-slide-toggle-indicator-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxSlideToggleIndicatorViewComponent extends DxSlideToggleIndicatorViewContracts {
}

