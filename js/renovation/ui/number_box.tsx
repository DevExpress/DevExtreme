import {
  Component, ComponentBindings, JSXComponent, OneWay, Event, TwoWay, React,
} from '@devextreme-generator/declarations';
/* eslint-disable-next-line import/named */
import LegacyNumberBox from '../../ui/number_box';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { EventCallback } from './common/event_callback.d';
import { BaseWidgetProps } from './common/base_props';

const DEFAULT_VALUE = 0;

export const viewFunction = ({
  props,
  restAttributes,
}: NumberBox): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyNumberBox}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class NumberBoxProps extends BaseWidgetProps {
  // props was copied from js\ui\number_box.d.ts

  // buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
  // format?: format;
  @OneWay() invalidValueMessage?: string;

  @OneWay() max?: number;

  @OneWay() min?: number;

  @OneWay() mode?: 'number' | 'text' | 'tel';

  // Needed only for jQuery. Should be auto-generated
  // onValueChanged?: ((e: { component?: T, element?: DxElement, model?: any,
  // value?: any, previousValue?: any, event?: event }) => any);
  @OneWay() showSpinButtons?: boolean;

  @OneWay() step?: number;

  @OneWay() useLargeSpinButtons?: boolean;

  @TwoWay() value: number | null = DEFAULT_VALUE;

  @Event() valueChange?: EventCallback<number>;

  @OneWay() focusStateEnabled?: boolean = true;

  @OneWay() hoverStateEnabled?: boolean = true;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class NumberBox extends JSXComponent(NumberBoxProps) {}
