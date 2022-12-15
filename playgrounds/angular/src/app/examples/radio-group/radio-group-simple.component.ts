import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dx-radio-group-simple',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroup simple example
      </div>
      <div class="example__control">
        <dx-radio-group
          *ngIf="value$ | async as value"
          [value]="value"
          (valueChange)="setValue($event)"
        >
          <dx-radio-button value="0" label="Option 0"></dx-radio-button>
          <dx-radio-button value="1" label="Option 1"></dx-radio-button>
          <dx-radio-button value="2" label="Option 2"></dx-radio-button>
        </dx-radio-group>
      </div>
      <div class="example__info">
        <span>Selected value: </span>
        <span>{{value$ | async}}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupSimpleComponent {
  private valueSubject = new BehaviorSubject<string | undefined>('1');

  value$ = this.valueSubject.asObservable();

  setValue(value: string | undefined): void {
    this.valueSubject.next(value);
  }
}
