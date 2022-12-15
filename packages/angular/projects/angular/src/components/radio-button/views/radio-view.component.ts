import {
  ChangeDetectionStrategy, Component, Input,
} from '@angular/core';
import { ViewComponent } from '../../../internal';

@Component({
  selector: 'dx-radio-button-radio-view',
  template: `
    {{ checked ? '◉' : '◎' }}
  `,
  styles: [':host { display: inline-block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioViewComponent extends ViewComponent {
  @Input() checked = false;
}
