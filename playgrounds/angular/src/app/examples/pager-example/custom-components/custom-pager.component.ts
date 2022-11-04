import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxPagerViewComponent} from '@devexpress/angular';

@Component({
  selector: 'custom-pager',
  template: `
    <dx-pager-page-size-view
      class="custom-pager__item"
      [viewModel]="viewModel.pageSizeViewModel"
      [actions]="{ selectPageSize: actions.selectPageSize }">
    </dx-pager-page-size-view>
    <dx-pager-page-number-view
      class="custom-pager__item"
      [viewModel]="viewModel.pageNumberViewModel"
      [actions]="{ selectPage: actions.selectPage }">
    </dx-pager-page-number-view>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .custom-pager__item {
      margin: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPagerComponent extends DxPagerViewComponent {

}
