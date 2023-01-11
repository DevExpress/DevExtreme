import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  createRadioGroupStore,
  ReadonlyProps,
  TemplateProps,
  ValueProps,
} from '@devextreme/components';
import { UpdateType } from '@devextreme/core';
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

  constructor(private radioGroupService: RadioGroupService) {
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

    this.radioGroupService.context$.pipe(
      doIfContextExist(),
    ).subscribe((store) => {
      store.addUpdate(() => ({ value }));
      store.commitUpdates(UpdateType.fromProps);
    });
  }
}
