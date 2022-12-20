import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { RadioGroupValue } from '@devextreme/components';
import { map } from 'rxjs';
import { AngularTemplate } from '../../internal';
import { RadioGroupService } from '../radio-common';

import { createRadioButtonStrategy } from './radio-button.strategies';
import { LabelViewComponent } from './views/label-view.component';
import { RadioViewComponent } from './views/radio-view.component';

// Increasing integer for generating unique ids for radio components.
let nextUniqueId = 0;

@Component({
  selector: 'dx-radio-button[value]',
  template: `
    <label [for]="id">
      <input
        [id]="id"
        class="radio-input"
        type="radio"
        [name]="name"
        [value]="value"
        [attr.checked]="(checked$ | async) ? 'true' : null"
        (click)="onClick.emit($event)"
        (change)="handleChange($event)"
      />
      <dx-dynamic-template
        *ngIf="radioTemplateData$ | async as templateData"
        [template]="radioTemplate"
        [data]="templateData">
      </dx-dynamic-template>
      <dx-dynamic-template
        *ngIf="labelTemplate"
        [template]="labelTemplate"
        [data]="{ label: label }">
      </dx-dynamic-template>
    </label>
  `,
  styles: [`
    :host { display: block; }
    .radio-input { display: none }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent<T extends RadioGroupValue>
implements OnInit, OnDestroy {
  private strategy = createRadioButtonStrategy(
    this.radioGroupService?.context$,
    () => this.value,
  );

  // eslint-disable-next-line no-plusplus
  private uniqueId = `dx-radio-button-${++nextUniqueId}`;

  @Input() id = this.uniqueId;

  @Input() value!: T;

  @Input() name?: string;

  @Input() set checked(value: boolean) {
    this.strategy.setChecked(value);
  }

  @Input() label?: string;

  // TODO: Add this template to core prop types.
  @Input() labelTemplate: AngularTemplate<LabelViewComponent> = LabelViewComponent;

  // TODO: Add this template to core prop types.
  @Input() radioTemplate: AngularTemplate<RadioViewComponent> = RadioViewComponent;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange = new EventEmitter<Event>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClick = new EventEmitter<MouseEvent>();

  checked$ = this.strategy.checked$;

  radioTemplateData$ = this.strategy.checked$
    .pipe(map((checked) => ({ checked })));

  constructor(@Optional() private radioGroupService: RadioGroupService) {
  }

  ngOnInit(): void {
    this.strategy.onInit();
  }

  ngOnDestroy(): void {
    this.strategy.onDestroy();
  }

  handleChange(event: Event): void {
    this.strategy.handleChange();
    this.onChange.emit(event);
  }
}
