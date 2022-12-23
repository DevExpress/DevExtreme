import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  selector: 'dx-radio-group-generic',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroup fully generic example
      </div>
      <div class="example__control">
        <dx-radio-group
          *ngIf="value$ | async as value"
          [value]="value"
          (valueChange)="setValue($event)"
        >
          <dx-radio-button
            *ngFor="let value of rgValues"
            [value]="value"
            [label]="value.data.label">
          </dx-radio-button>
        </dx-radio-group>
      </div>
      <div class="example__info">
        <span>Selected value: </span>
        <span>{{value$ | async | json}}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupGenericComponent {
  private valueSubject = new BehaviorSubject<MyRadioGroupValue | undefined>(RG_VALUES[0]);

  rgValues = RG_VALUES;

  value$ = this.valueSubject.asObservable();

  setValue(value?: MyRadioGroupValue): void {
    this.valueSubject.next(value);
  }
}
