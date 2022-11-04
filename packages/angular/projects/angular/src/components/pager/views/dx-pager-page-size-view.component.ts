import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxViewContracts} from '../../../internal/index';
import {PageSizeAngularVM} from '../types/index';

interface DxPagerPageSizeActions {
  selectPageSize: (pageSize: number) => void;
}

@Component({
  template: '',
})
export abstract class DxPagerPageSizeViewContracts
  extends DxViewContracts<PageSizeAngularVM, DxPagerPageSizeActions> {
}

@Component({
  selector: 'dx-pager-page-size-view',
  template: `
    <div class="dx-pager-page-size">
<!--      <dx-dynamic-template *ngFor="let item of viewModel.items"-->
<!--                           [template]="item.template"-->
<!--                           [data]="{-->
<!--                           viewModel: item,-->
<!--                           actions: { selectPageSize: actions.selectPageSize }-->
<!--                           }">-->
<!--      </dx-dynamic-template>-->
    </div>
  `,
  styleUrls: ['./dx-pager-page-size-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxPagerPageSizeViewComponent extends DxPagerPageSizeViewContracts {
}
