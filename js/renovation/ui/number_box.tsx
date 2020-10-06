import {
  Ref, Component, ComponentBindings, JSXComponent, OneWay, Event, TwoWay, Method, React,
} from 'devextreme-generator/component_declaration/common';
/* eslint-disable-next-line import/named */
import LegacyNumberBox from '../../ui/number_box';
import { WidgetProps } from './common/widget';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { EventCallback } from './common/event_callback.d';

export const viewFunction = ({
  rootElementRef,
  props,
  restAttributes,
}: NumberBox): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef as any}
    componentType={LegacyNumberBox}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

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

  @TwoWay() value: number | null = 0;

  @Event() valueChange?: EventCallback<number>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class NumberBox extends JSXComponent(NumberBoxProps) {
  @Ref()
  rootElementRef!: HTMLDivElement;

  @Method()
  getHtmlElement(): HTMLDivElement {
    return this.rootElementRef;
  }
}
