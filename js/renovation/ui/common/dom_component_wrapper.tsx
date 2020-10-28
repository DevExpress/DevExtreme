import {
  Component, ComponentBindings, ForwardRef, OneWay, JSXComponent, Ref, Method, Effect, Consumer,
} from 'devextreme-generator/component_declaration/common';
import type DomComponent from '../../../core/dom_component';
import { ConfigContextValue, ConfigContext } from './config_context';
import { EventCallback } from './event_callback.d';
import { renderTemplate } from '../../utils/render_template';

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
    itemTemplate?: string;
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

  @Ref()
  instance!: DomComponent | null;

  @Method()
  getInstance(): DomComponent | null {
    return this.instance;
  }

  @Effect()
  updateWidget(): void {
    this.getInstance()?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    // eslint-disable-next-line new-cap
    const componentInstance = new this.props.componentType(this.widgetRef, this.properties) as any;
    this.instance = componentInstance;

    return (): void => {
      componentInstance.dispose();
      this.instance = null;
    };
  }

  @Effect({ run: 'once' }) setRootElementRef(): void {
    const { rootElementRef } = this.props;
    if (rootElementRef) {
      this.props.rootElementRef = this.widgetRef;
    }
  }

  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  get properties(): Record<string, unknown> {
    const {
      itemTemplate,
      valueChange,
      ...restProps
    } = this.props.componentProps;

    const properties = ({
      rtlEnabled: this.config?.rtlEnabled || false, // widget expects boolean
      ...restProps,
    }) as Record<string, unknown>;
    if (valueChange) {
      properties.onValueChanged = ({ value }): void => valueChange(value);
    }
    if (itemTemplate) {
      properties.itemTemplate = (item, index, container): void => {
        renderTemplate(itemTemplate, { item, index, container }, container);
      };
    }
    return properties;
  }
}
