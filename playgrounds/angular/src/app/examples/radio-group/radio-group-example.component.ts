import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dx-radio-group-example',
  template: `
    <dx-radio-group-simple></dx-radio-group-simple>
    <dx-radio-group-customization-components></dx-radio-group-customization-components>
    <dx-radio-group-customization-templates></dx-radio-group-customization-templates>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupExampleComponent {
}
