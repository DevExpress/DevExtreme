import {
  ChangeDetectionStrategy, Component, Input,
} from '@angular/core';
import { ViewComponent } from '../../../internal';

@Component({
  selector: 'dx-radio-button-label-view',
  template: '<span>{{ label }}</span>',
  styles: [':host { display: inline-block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelViewComponent extends ViewComponent {
  @Input() label?: string;
}
