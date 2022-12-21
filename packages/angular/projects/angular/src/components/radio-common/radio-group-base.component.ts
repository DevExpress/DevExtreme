import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { RadioGroupValue } from '@devextreme/components';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class RadioGroupBaseComponent<T extends RadioGroupValue> {
  @Output() valueChange = new EventEmitter<T | undefined>();
}
