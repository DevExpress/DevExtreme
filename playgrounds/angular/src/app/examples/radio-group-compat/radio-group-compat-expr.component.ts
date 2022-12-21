import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dx-radio-group-compat-expr',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroup simple example
      </div>
      <div class="example__control">
        <dx-radio-group-compat
          *ngIf="value$ | async as value"
          [items]="objectItems"
          [valueExpr]="'value'"
          [displayExpr]="'label'"
          [value]="value"
          (valueChange)="setValue($event)">
        </dx-radio-group-compat>
      </div>
      <div class="example__info">
        <span>Selected value: </span>
        <span>{{value$ | async}}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupCompatExprExampleComponent {
  objectItems = [
    { value: 1, label: '🍏' },
    { value: 2, label: '🍑' },
    { value: 3, label: '🍌' },
  ];

  private valueSubject = new BehaviorSubject<number | undefined>(this.objectItems[1].value);

  value$ = this.valueSubject.asObservable();

  setValue(value?: number): void {
    this.valueSubject.next(value);
  }
}
