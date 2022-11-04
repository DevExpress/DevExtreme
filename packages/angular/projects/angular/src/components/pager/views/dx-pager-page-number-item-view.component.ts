import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxViewContracts} from '../../../internal/index';
import {ItemAngularVM} from '../types/index';

interface DxPagerPageNumberItemActions {
  selectPage: (pageNumber: number) => void;
}

@Component({template: ''})
export abstract class DxPagerPageNumberItemViewContracts
  extends DxViewContracts<ItemAngularVM<DxPagerPageNumberItemViewComponent>, DxPagerPageNumberItemActions> {
}

@Component({
  selector: 'dx-pager-page-number-item-view',
  template: `
    <div class="dx-pager-pages__item"
         [class.-selected]="viewModel.selected"
         [class.-selectable]="viewModel.selectable"
         (click)="actions.selectPage(viewModel.value)">
      {{ viewModel.label }}
    </div>
  `,
  styleUrls: ['./dx-pager-page-number-item-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxPagerPageNumberItemViewComponent extends DxPagerPageNumberItemViewContracts {
}

