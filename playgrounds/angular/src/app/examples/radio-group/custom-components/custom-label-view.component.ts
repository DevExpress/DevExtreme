import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ViewComponent } from '@devextreme/angular';

@Component({
  selector: 'dx-custom-radio',
  template: `
    <b>{{ label }}</b>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomLabelViewComponent extends ViewComponent {
  @Input() label?: string;
}
