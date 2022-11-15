import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DxPagerPageSizeItemViewComponent } from '@devexpress/angular';

@Component({
    selector: 'custom-page-size-item',
    template: `
    <div class="custom-pager-item"
         [class.--selected]="viewModel.selected"
         (click)="actions.selectPageSize(viewModel.value)">
      {{ viewModel.value }}
    </div>
  `,
    styles: [`
    .custom-pager-item {
      padding: 10px;
      background-color: #fff;
      cursor: pointer;
    }

    .custom-pager-item:first-of-type {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .custom-pager-item:last-of-type {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .custom-pager-item.--selected {
      color: #fafafa;
      background-color: #f05b41;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPageSizeItemComponent extends DxPagerPageSizeItemViewComponent {
}
