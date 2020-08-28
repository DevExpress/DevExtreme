import {
  Ref, Effect, Component, ComponentBindings, JSXComponent, OneWay, Event, TwoWay, Method,
} from 'devextreme-generator/component_declaration/common';
/* eslint-disable-next-line import/named */
import LegacyNumberBox, { Options } from '../../ui/number_box';
import { WidgetProps } from './common/widget';

export const viewFunction = ({ widgetRef, props: { className }, restAttributes }: NumberBox) => (
  <div
    ref={widgetRef as any}
    className={className}
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

  @Event() valueChange?: ((value: number) => void) = () => {};
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class NumberBox extends JSXComponent(NumberBoxProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Method()
  getHtmlElement(): HTMLDivElement {
    return this.widgetRef;
  }

  @Effect()
  updateWidget(): void {
    const widget = LegacyNumberBox.getInstance(this.widgetRef);
    widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    const widget = new LegacyNumberBox(this.widgetRef, this.properties);

    return (): void => widget.dispose();
  }

  get properties(): Options {
    const { valueChange, ...restProps } = this.props;
    return ({ ...restProps, onValueChanged: ({ value }) => valueChange!(value) }) as Options;
  }
}
