import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class RadioGroupBaseComponent<T> {
  @Output() valueChange = new EventEmitter<T | undefined>();
}
