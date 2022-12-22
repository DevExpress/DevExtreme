import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dx-radio-group-customization-templates',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroup customization via templates example
      </div>
      <div class="example__control">
        <dx-radio-group [value]="'1'">
          <dx-radio-button
            *ngFor="let btn of radioButtons"
            [value]="btn.value"
            [label]="btn.label"
            [radioTemplate]="radioTemplate"
            [labelTemplate]="labelTemplate"
          >
          </dx-radio-button>
        </dx-radio-group>
      </div>
    </div>

    <!-- templates -->
    <ng-template #radioTemplate let-data>
      {{ data.checked ? '❤️' : '🌚' }}
    </ng-template>

    <ng-template #labelTemplate let-data>
      <b>{{ data.label }}</b>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupCustomizationTemplatesComponent {
  radioButtons = [{
    value: '0',
    label: 'Option 0',
  },
  {
    value: '1',
    label: 'Option 1',
  }, {
    value: '2',
    label: 'Option 2',
  }];
}
