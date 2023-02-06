import {
  ChangeDetectionStrategy, Component, Input,
} from '@angular/core';
import { ViewComponent } from '../../../internal';

@Component({
  selector: 'dx-radio-button-radio-view',
  template: `
    <span class="dxr-radio-button__radio">
        {{ checked ? '◉' : '◎' }}
    </span>
  `,
  styleUrls: ['./radio-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioViewComponent extends ViewComponent {
  @Input() checked = false;
}
