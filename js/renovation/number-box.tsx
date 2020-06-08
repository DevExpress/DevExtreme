import {
  Ref, Effect, Component, ComponentBindings, JSXComponent, OneWay, Event, TwoWay,
} from 'devextreme-generator/component_declaration/common';
import DxNumberBox from '../ui/number_box';
import { WidgetProps } from './widget';

export const viewFunction = ({ widgetRef }: NumberBox) => (<div ref={widgetRef as any} />);

@ComponentBindings()
export class NumberBoxProps extends WidgetProps {
  // props was copied from js\ui\number_box.d.ts

  // buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
  // format?: format;
  @OneWay() invalidValueMessage?: string;

  @OneWay() max?: number;

  @OneWay() min?: number;

  @OneWay() mode?: 'number' | 'text' | 'tel';

  // Needed only for jQuery. Should be auto-generated
  // onValueChanged?: ((e: { component?: T, element?: dxElement, model?: any,
  // value?: any, previousValue?: any, event?: event }) => any);
  @OneWay() showSpinButtons?: boolean;

  @OneWay() step?: number;

  @OneWay() useLargeSpinButtons?: boolean;

  @TwoWay() value?: number;

  @Event() valueChange?: ((value: number) => void) = () => {};
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class NumberBox extends JSXComponent(NumberBoxProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  setupWidget() {
    const { valueChange } = this.props;

    new DxNumberBox(this.widgetRef, { // eslint-disable-line no-new
      ...this.props as any,
      onValueChanged: (e) => {
        valueChange!(e.value);
      },
    });
  }
}
