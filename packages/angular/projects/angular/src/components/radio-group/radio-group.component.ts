import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  createRadioGroupCore,
  RadioGroupValue,
  ReadonlyProps,
  TemplateProps,
  ValueProps,
} from '@devextreme/components';
import { filter, map } from 'rxjs';
import { doIfContextExist, Inputs } from '../../internal';
import { RadioGroupService } from '../radio-common';

export type RadioGroupInputs<T extends RadioGroupValue> =
  Inputs<ValueProps<T>, ReadonlyProps, TemplateProps>;

@Component({
  selector: 'dx-radio-group',
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  providers: [RadioGroupService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent<T extends RadioGroupValue>
implements OnInit, RadioGroupInputs<T> {
  private inputValue?: T;

  @Input() set value(value: T) {
    this.setValue(value);
  }

  @Output() valueChange = new EventEmitter<T | undefined>();

  constructor(private radioGroupService: RadioGroupService) {
  }

  ngOnInit(): void {
    this.radioGroupService.setContext(
      createRadioGroupCore({
        value: this.inputValue,
      }, {
        value: {
          controlledMode: false,
          changeCallback: (value) => { this.valueChange.emit(value); },
        },
      }),
    );
  }

  private setValue(value: T): void {
    this.inputValue = value;

    this.radioGroupService.context$.pipe(
      doIfContextExist(),
      map(({ stateManager }) => stateManager),
      filter((stateManager) => {
        const stateValue = stateManager.getState();
        return stateValue.value !== value;
      }),
    ).subscribe((stateManager) => {
      stateManager.addUpdate({ value });
      stateManager.commitUpdates();
    });
  }
}
