import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dx-radio-group-example',
  template: `
    <dx-radio-group
      *ngIf="value$ | async as value"
      [value]="value"
      (valueChange)="setValue($event)"
    >
      <dx-radio-button value="0" label="Option 0"></dx-radio-button>
      <dx-radio-button value="1" label="Option 1"></dx-radio-button>
      <dx-radio-button value="2" label="Option 2"></dx-radio-button>
    </dx-radio-group>

    <div>
      <span>Selected value: </span>
      <span>{{value$ | async}}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupExampleComponent {
  private valueSubject = new BehaviorSubject<string | undefined>('1');

  value$ = this.valueSubject.asObservable();

  setValue(value: string | undefined): void {
    this.valueSubject.next(value);
  }
}
