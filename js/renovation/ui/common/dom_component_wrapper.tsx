import {
  Effect, Component, ComponentBindings, JSXComponent, OneWay, Consumer, ForwardRef, Ref,
} from 'devextreme-generator/component_declaration/common';
import DomComponent from '../../../core/dom_component';
import { ConfigContextValue, ConfigContext } from './config_context';
import { EventCallback } from './event_callback.d';

export const viewFunction = ({
  widgetRef,
  props: { componentProps: { className } },
  restAttributes,
}: DomComponentWrapper): JSX.Element => (
  <div
    ref={widgetRef as any}
    className={className}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

interface WidgetInstanceType { option: (properties: Record<string, unknown>) => void }

@ComponentBindings()
export class DomComponentWrapperProps {
  @ForwardRef() rootElementRef?: HTMLDivElement;

  @OneWay() componentType!: typeof DomComponent & {
    getInstance: (widgetRef: HTMLDivElement) => WidgetInstanceType;
  };

  @OneWay() componentProps!: {
    className?: string;
    valueChange?: EventCallback<any>;
  };
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DomComponentWrapper extends JSXComponent<DomComponentWrapperProps, 'componentType' | 'componentProps'>() {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  updateWidget(): void {
    const widget = this.props.componentType.getInstance(this.widgetRef);
    widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    // eslint-disable-next-line new-cap
    const widget = new this.props.componentType(this.widgetRef, this.properties);

    return (): void => widget.dispose();
  }

  @Effect({ run: 'once' }) setRootElementRef(): void {
    const { rootElementRef } = this.props;
    if (rootElementRef) {
      this.props.rootElementRef = this.widgetRef;
    }
  }

  @Consumer(ConfigContext)
  config!: ConfigContextValue;

  get properties(): Record<string, unknown> {
    const { valueChange, ...restProps } = this.props.componentProps;
    const properties = ({
      rtlEnabled: this.config?.rtlEnabled,
      ...restProps,
    }) as Record<string, unknown>;
    if (valueChange) {
      properties.onValueChanged = ({ value }): void => valueChange(value);
    }
    return properties;
  }
}
