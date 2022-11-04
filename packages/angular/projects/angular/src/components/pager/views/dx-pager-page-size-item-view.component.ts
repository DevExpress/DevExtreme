import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxViewContracts} from '../../../internal/index';
import {ItemAngularVM} from '../types/index';

interface DxPagerPageSizeItemActions {
  selectPageSize: (pageSize: number) => void;
}

@Component({
  template: '',
})
export abstract class DxPagerPageSizeItemViewContracts
  extends DxViewContracts<ItemAngularVM<DxPagerPageSizeItemViewComponent>, DxPagerPageSizeItemActions> {
}

@Component({
  selector: 'dx-pager-page-size-item-view',
  template: `
    <div class="dx-pager-page-size__item"
         [class.-selected]="viewModel.selected"
         (click)="actions.selectPageSize(viewModel.value)">
      {{ viewModel.label }}
    </div>
  `,
  styleUrls: ['./dx-pager-page-size-item-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxPagerPageSizeItemViewComponent extends DxPagerPageSizeItemViewContracts {
}
