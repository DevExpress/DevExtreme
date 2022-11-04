import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AngularViewData, DxViewContracts} from '../../../internal/index';
import {PageNumberAngularVM, PageSizeAngularVM} from '../types/index';

export interface DxPagerViewModel {
  pageSizeViewModel: PageSizeAngularVM;
  pageNumberViewModel: PageNumberAngularVM;
}

export interface DxPagerViewActions {
  selectPage: (pageNumber: number) => void;
  selectPageSize: (pageSize: number) => void;
}

export interface DxPagerViewContractsType extends AngularViewData<DxPagerViewModel, DxPagerViewActions> {}

@Component({ template: '' })
export abstract class DxPagerViewContracts extends DxViewContracts<DxPagerViewModel, DxPagerViewActions>{
}

@Component({
  selector: 'dx-pager-view',
  template: `
    <div class="dx-pager">
<!--      <dx-dynamic-template [template]="viewModel.pageSizeViewModel.template"-->
<!--                           [data]="{-->
<!--                             viewModel: viewModel.pageSizeViewModel,-->
<!--                             actions: { selectPageSize: actions.selectPageSize }-->
<!--                           }">-->
<!--      </dx-dynamic-template>-->
<!--      <dx-dynamic-template [template]="viewModel.pageNumberViewModel.template"-->
<!--                           [data]="{-->
<!--                             viewModel: viewModel.pageNumberViewModel,-->
<!--                             actions: { selectPage: actions.selectPage }-->
<!--                           }">-->
<!--      </dx-dynamic-template>-->
    </div>
  `,
  styleUrls: ['./dx-pager-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxPagerViewComponent extends DxPagerViewContracts {
}
