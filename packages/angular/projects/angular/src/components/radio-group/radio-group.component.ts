import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges, Output,
} from '@angular/core';
import {
  createRadioGroupStore,
  RADIO_GROUP_ACTIONS,
  ReadonlyProps,
  TemplateProps,
  ValueProps,
} from '@devextreme/components';
import { Inputs } from '../../internal';
import { RadioGroupBaseComponent, RadioGroupService } from '../radio-common';

export type RadioGroupInputs<T> =
  Inputs<ValueProps<T>, ReadonlyProps, TemplateProps>;

@Component({
  selector: 'dx-radio-group',
  template: `
    <div class="dxr-radio-group">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./radio-group.component.scss'],
  providers: [RadioGroupService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent<T>
  extends RadioGroupBaseComponent<T>
  implements OnChanges, RadioGroupInputs<T> {
  // TODO Vinogradov: Think about splitting core initialization into two parts.
  // First one with config for creating instance, second one for setting the initial state.
  private store = createRadioGroupStore<T>({
    value: undefined,
    readonly: {
      shortcutKey: 's',
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      disabled: false,
      tabIndex: 0,
      attributes: {},
    },
  }, {
    value: {
      controlledMode: false,
      changeCallback: (value) => { this.valueChange.emit(value); },
    },
  });

  @Input() value: T | undefined;

  @Output() focusChange = new EventEmitter<boolean>();

  constructor(private radioGroupService: RadioGroupService<T>) {
    super();
    this.radioGroupService.context = this.store;
  }

  ngOnChanges(): void {
    this.store.addUpdate(RADIO_GROUP_ACTIONS.updateValue(this.value));
    this.store.commitPropsUpdates();
  }
}
