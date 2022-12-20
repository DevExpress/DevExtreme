import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dx-radio-group-compat-simple',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroup simple example
      </div>
      <div class="example__control">
        <dx-radio-group-compat
          *ngIf="value$ | async as value"
          [items]="objectItems"
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
export class RadioGroupCompatSimpleExampleComponent {
  objectItems = [
    'Mark',
    'Mary',
    'Lion',
  ];

  private valueSubject = new BehaviorSubject<string | undefined>(this.objectItems[1]);

  value$ = this.valueSubject.asObservable();

  setValue(value?: string): void {
    this.valueSubject.next(value);
  }
}
