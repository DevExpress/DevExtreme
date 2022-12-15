import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomLabelViewComponent } from './custom-components/custom-label-view.component';
import { CustomRadioViewComponent } from './custom-components/custom-radio-view.component';

@Component({
  selector: 'dx-radio-group-customization-components',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroup customization via components example
      </div>
      <div class="example__control">
        <dx-radio-group [value]="'1'">
          <dx-radio-button
            *ngFor="let btn of radioButtons"
            [value]="btn.value"
            [label]="btn.label"
            [radioTemplate]="btn.radioTemplate"
            [labelTemplate]="btn.labelTemplate"
          >
          </dx-radio-button>
        </dx-radio-group>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupCustomizationComponentsComponent {
  radioButtons = [{
    value: '0',
    label: 'Option 0',
    radioTemplate: CustomRadioViewComponent,
    labelTemplate: CustomLabelViewComponent,
  },
  {
    value: '1',
    label: 'Option 1',
    radioTemplate: CustomRadioViewComponent,
    labelTemplate: CustomLabelViewComponent,
  }, {
    value: '2',
    label: 'Option 2',
    radioTemplate: CustomRadioViewComponent,
    labelTemplate: CustomLabelViewComponent,
  }];
}
