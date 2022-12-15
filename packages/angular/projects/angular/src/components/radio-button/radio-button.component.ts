import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
} from '@angular/core';
import { RadioGroupValue } from '@devextreme/components';
import { RadioGroupService } from '../radio-group/radio-group.service';

import { createRadioButtonStrategy } from './radio-button.strategies';

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
      <span>{{ (checked$ | async) ? '◉' : '◎' }}</span>
      <span>{{ this.label }}</span>
    </label>
  `,
  styles: [`
    :host { display: block; }
    .radio-input { display: none }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent<T extends RadioGroupValue>
implements OnDestroy {
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

  @Output() onChange = new EventEmitter<Event>();

  @Output() onClick = new EventEmitter<MouseEvent>();

  checked$ = this.strategy.checked$;

  constructor(@Optional() private radioGroupService: RadioGroupService) {
  }

  ngOnDestroy(): void {
    this.strategy.onDestroy();
  }

  handleChange(event: Event): void {
    this.strategy.handleChange();
    this.onChange.emit(event);
  }
}
