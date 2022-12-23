import { ChangeDetectionStrategy, Component } from '@angular/core';

interface MyRadioGroupValue {
  id: number,
  data: {
    label: string,
    value: string,
  }
}

const RG_VALUES: MyRadioGroupValue[] = [{
  id: 0,
  data: { label: 'Option 0', value: '🍑' },
}, {
  id: 1,
  data: { label: 'Option 1', value: '🍏' },
}, {
  id: 2,
  data: { label: 'Option 2', value: '🍌' },
}];

@Component({
  selector: 'dx-radio-button-example',
  template: `
    <div class="example">
      <div class="example__title">
        RadioButton standalone example
      </div>
      <div class="example__control">
        <dx-radio-button
          *ngFor="let value of rgValues"
          [checked]="value.id === 1"
          [value]="value"
          [label]="value.data.label"
        ></dx-radio-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonExampleComponent {
  rgValues = RG_VALUES;
}
