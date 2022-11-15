import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DxPagerPageNumberItemViewContracts } from '@devexpress/angular';

@Component({
    selector: 'custom-page-number-item',
    template: `
    <div class="custom-pager-item"
         [class.--selected]="viewModel.selected"
         (click)=actions.selectPage(viewModel.value)>
      {{ viewModel.label }}
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
export class CustomPageNumberItemComponent extends DxPagerPageNumberItemViewContracts {
}
