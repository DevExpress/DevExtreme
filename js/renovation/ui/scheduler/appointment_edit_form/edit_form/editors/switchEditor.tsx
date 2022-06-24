import {
  Component,
  ComponentBindings,
  Effect,
  InternalState,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { Switch } from '../../../../editors/switch';

// istanbul ignore next: should be tested in React infrastructure
export const viewFunction = ({
  value,
  onToggle,
}: SwitchEditor): JSX.Element => (
  <Switch
    value={value}
    valueChange={onToggle}
  />
);

@ComponentBindings()
export class SwitchEditorProps {
  @OneWay() value!: boolean;

  @OneWay() valueChange!: (value: boolean) => void;
}

@Component({ view: viewFunction })
export class SwitchEditor extends JSXComponent<
SwitchEditorProps, 'value' | 'valueChange'>() {
  @InternalState()
  value: boolean | undefined;

  @Effect({ run: 'once' }) // WA props are no accessible on state init
  initDate(): void {
    if (!this.value) {
      this.value = this.props.value;
    }
  }

  onToggle(value: boolean): void {
    this.value = value;

    this.props.valueChange(value);
  }
}
