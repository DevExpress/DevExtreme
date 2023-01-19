import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  createRadioGroupStore,
  RADIO_GROUP_ACTIONS,
  ReadonlyProps,
  TemplateProps,
  ValueProps,
} from '@devextreme/components';
import { doIfContextExist, Inputs } from '../../internal';
import { RadioGroupBaseComponent, RadioGroupService } from '../radio-common';

export type RadioGroupInputs<T> =
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
export class RadioGroupComponent<T>
  extends RadioGroupBaseComponent<T>
  implements OnInit, RadioGroupInputs<T> {
  private inputValue?: T;

  @Input() set value(value: T | undefined) {
    this.setValue(value);
  }

  constructor(private radioGroupService: RadioGroupService<T>) {
    super();
  }

  ngOnInit(): void {
    this.radioGroupService.setContext(
      createRadioGroupStore({
        value: this.inputValue,
      }, {
        value: {
          controlledMode: false,
          changeCallback: (value) => { this.valueChange.emit(value); },
        },
      }),
    );
  }

  private setValue(value?: T): void {
    this.inputValue = value;

    this.radioGroupService.context$.pipe(doIfContextExist())
      .subscribe((store) => {
        store.addUpdate(RADIO_GROUP_ACTIONS.updateValue(value));
        store.commitPropsUpdates();
      });
  }
}
