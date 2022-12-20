import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dx-radio-group-compat-example',
  template: `
    <dx-radio-group-compat-simple></dx-radio-group-compat-simple>
    <dx-radio-group-compat-expr></dx-radio-group-compat-expr>
    <dx-radio-group-compat-template></dx-radio-group-compat-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupCompatExampleComponent {
}
