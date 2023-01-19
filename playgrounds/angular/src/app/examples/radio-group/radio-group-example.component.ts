import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dx-radio-group-example',
  template: `
    <dx-radio-group-playground></dx-radio-group-playground>
    <dx-radio-group-simple></dx-radio-group-simple>
    <dx-radio-group-generic></dx-radio-group-generic>
    <dx-radio-group-customization-components></dx-radio-group-customization-components>
    <dx-radio-group-customization-templates></dx-radio-group-customization-templates>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupExampleComponent {
}
