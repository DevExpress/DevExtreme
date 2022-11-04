import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxPagerPageNumberItemViewContracts} from '@devexpress/angular';

@Component({
  selector: 'custom-page-number-divider',
  template: `
    <div class="divider__line">
    </div>
  `,
  styles: [`
    :host {
      width: 1px;
      padding: 10px;
      background-color: #fff;
      cursor: default;
    }

    .divider__line {
      width: 100%;
      height: 100%;
      background-color: #d4d4d4;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPageNumberDividerComponent extends DxPagerPageNumberItemViewContracts {
}
