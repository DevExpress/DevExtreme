import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dx-radio-group-compat-template',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroupCompat templates example
      </div>
      <div class="example__control">
        <dx-radio-group-compat
          *ngIf="value$ | async as value"
          [items]="objectItems"
          [valueExpr]="'value'"
          [displayExpr]="'label'"
          [value]="value"
          (valueChange)="setValue($event)">
          <span *dxTemplateCompat="let data of 'customTemplate'">
              <span class="text">Custom template:</span>
            {{ data.label }}
            </span>
        </dx-radio-group-compat>
      </div>
      <div class="example__info">
        <span>Selected value: </span>
        <span>{{value$ | async}}</span>
      </div>
    </div>
  `,
  styles: ['.text { font-weight: bold; color: #ff0000; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupCompatTemplateExampleComponent {
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
