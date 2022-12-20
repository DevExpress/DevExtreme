import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ViewComponent } from '@devextreme/angular';

@Component({
  selector: 'dx-custom-radio',
  template: `
    {{ checked ? '✅' : '❌' }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomRadioViewComponent extends ViewComponent {
  @Input() checked = false;
}
