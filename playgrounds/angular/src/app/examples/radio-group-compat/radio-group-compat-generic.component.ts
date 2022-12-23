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
  selector: 'dx-radio-group-compat-generic',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroupCompat fully generic example
      </div>
      <div class="example__control">
        <dx-radio-group-compat
          *ngIf="value$ | async as value"
          [items]="rgValues"
          [value]="value"
          [displayExpr]="'data.label'"
          (valueChange)="setValue($event)">
        </dx-radio-group-compat>
      </div>
      <div class="example__info">
        <span>Selected value: </span>
        <span>{{value$ | async | json}}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupCompatGenericComponent {
  private valueSubject = new BehaviorSubject<MyRadioGroupValue | undefined>(RG_VALUES[1]);

  rgValues = RG_VALUES;

  value$ = this.valueSubject.asObservable();

  setValue(value?: MyRadioGroupValue): void {
    this.valueSubject.next(value);
  }
}
