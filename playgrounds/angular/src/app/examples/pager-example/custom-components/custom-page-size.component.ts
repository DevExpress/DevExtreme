import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxPagerPageSizeViewContracts} from '@devexpress/angular';

@Component({
  selector: 'custom-page-size',
  template: `
    <dx-pager-page-size-item-view
      *ngFor="let item of viewModel.items"
      [viewModel]="item"
      [actions]="actions">
    </dx-pager-page-size-item-view>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column-reverse;
      box-shadow: rgba(149, 157, 165, .2) 0 8px 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPageSizeComponent extends DxPagerPageSizeViewContracts {

}
