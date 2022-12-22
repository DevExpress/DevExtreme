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
import {
  filter,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
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
        [template]="radioTemplateValue"
        [data]="templateData">
      </dx-dynamic-template>
      <dx-dynamic-template
        *ngIf="labelTemplateValue"
        [template]="labelTemplateValue"
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
export class RadioButtonComponent<T>
implements OnInit, OnDestroy {
  private strategy = createRadioButtonStrategy(
    this.radioGroupService?.context$,
    () => this.value,
  );

  // eslint-disable-next-line no-plusplus
  private uniqueId = `dx-radio-button-${++nextUniqueId}`;

  private destroy$ = new Subject<void>();

  @Input() id = this.uniqueId;

  @Input() value!: T;

  @Input() name?: string;

  @Input() set checked(value: boolean) {
    this.strategy.setChecked(value);
  }

  @Input() label?: string;

  // TODO: Add this template to core prop types.
  @Input() set labelTemplate(value: AngularTemplate<LabelViewComponent> | undefined) {
    this.labelTemplateValue = value || LabelViewComponent;
  }

  // TODO: Add this template to core prop types.
  @Input() set radioTemplate(value: AngularTemplate<RadioViewComponent> | undefined) {
    this.radioTemplateValue = value || RadioViewComponent;
  }

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onChange = new EventEmitter<Event>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClick = new EventEmitter<MouseEvent>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSelected = new EventEmitter<T>();

  checked$ = this.strategy.checked$;

  radioTemplateData$ = this.strategy.checked$
    .pipe(map((checked) => ({ checked })));

  labelTemplateValue: AngularTemplate<LabelViewComponent> = LabelViewComponent;

  radioTemplateValue: AngularTemplate<RadioViewComponent> = RadioViewComponent;

  constructor(@Optional() private radioGroupService: RadioGroupService) {
  }

  ngOnInit(): void {
    this.strategy.onInit();
    this.strategy.checked$.pipe(
      filter((checked) => checked),
      takeUntil(this.destroy$),
    ).subscribe(() => { this.onSelected.emit(this.value); });
  }

  ngOnDestroy(): void {
    this.strategy.onDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleChange(event: Event): void {
    this.strategy.handleChange();
    this.onChange.emit(event);
  }
}
