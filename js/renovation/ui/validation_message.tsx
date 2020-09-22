import {
  Ref, Effect, Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './common/widget';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable import/named */
import LegacyValidationMessage, { Options } from '../../ui/validation_message';
/* eslint-enable import/named */

export const viewFunction = ({ widgetRef }: ValidationMessage) => (<div ref={widgetRef as any} />);

@ComponentBindings()
export class ValidationMessageProps extends WidgetProps {
  @OneWay() mode?: string = 'auto';

  @OneWay() validationErrors?: object[] | null = undefined;

  @OneWay() positionRequest?: string = undefined;

  @OneWay() boundary?: string | Element | JQuery = undefined;

  @OneWay() container?: string | Element | JQuery = undefined;

  @OneWay() target?: string | Element | JQuery = undefined;

  @OneWay() offset?: object = { h: 0, v: 0 };
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ValidationMessage extends JSXComponent(ValidationMessageProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  updateWidget(): void {
    const widget = LegacyValidationMessage.getInstance(this.widgetRef);
        widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    const widget = new LegacyValidationMessage(this.widgetRef, this.properties);

    return (): void => widget.dispose();
  }

  get properties(): Options {
    return this.props as Options;
  }
}
