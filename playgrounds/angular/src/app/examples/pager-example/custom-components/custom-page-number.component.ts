import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxPagerPageNumberViewComponent} from '@devexpress/angular';

@Component({
  selector: 'custom-page-number',
  template: `
    <dx-pager-page-number-item-view
      class="custom-pager-numbers__content"
      *ngFor="let item of viewModel.items"
      [viewModel]="item"
      [actions]="actions">
    </dx-pager-page-number-item-view>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
    }

    .custom-pager-numbers__content {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      box-shadow: rgba(149, 157, 165, .2) 0 8px 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPageNumberComponent extends DxPagerPageNumberViewComponent {
}
