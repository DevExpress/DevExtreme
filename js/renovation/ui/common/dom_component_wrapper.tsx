import {
  Component,
  ComponentBindings,
  ForwardRef,
  OneWay,
  JSXComponent,
  Ref,
  Method,
  Effect,
  Consumer,
  RefObject,
  Mutable,
} from '@devextreme-generator/declarations';
import { isFunction } from '../../../core/utils/type';
import type DomComponent from '../../../core/dom_component';
import { ComponentClass } from '../../../core/dom_component'; // eslint-disable-line import/named
import { ConfigContextValue, ConfigContext } from '../../common/config_context';
import { renderTemplate } from '../../utils/render_template';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import { EventCallback } from './event_callback';

export const viewFunction = ({
  widgetRef,
  props: { componentProps: { className } },
  restAttributes,
}: DomComponentWrapper): JSX.Element => (
  <div
    ref={widgetRef}
    className={className}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class DomComponentWrapperProps {
  @ForwardRef() rootElementRef?: RefObject<HTMLDivElement>;

  @OneWay() componentType!: ComponentClass<Record<string, any>>;

  @OneWay() componentProps!: {
    className?: string;
    itemTemplate?: ((data) => JSX.Element) | string;
    valueChange?: EventCallback<any>;
  };
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DomComponentWrapper extends JSXComponent<DomComponentWrapperProps, 'componentType' | 'componentProps'>() {
  @Ref()
  widgetRef!: RefObject<HTMLDivElement>;

  @Mutable()
  instance!: DomComponent | null;

  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  @Method()
  getInstance(): DomComponent | null {
    return this.instance;
  }

  @Effect({ run: 'once' })
  setupWidget(): DisposeEffectReturn {
    // eslint-disable-next-line new-cap
    const componentInstance = new this.props.componentType(
      this.widgetRef.current!, this.properties,
    );
    this.instance = componentInstance;

    return (): void => {
      componentInstance.dispose();
      this.instance = null;
    };
  }

  @Effect({ run: 'once' }) setRootElementRef(): void {
    const { rootElementRef } = this.props;
    if (rootElementRef) {
      rootElementRef.current = this.widgetRef.current;
    }
  }

  @Effect()
  updateWidget(): void {
    this.getInstance()?.option(this.properties);
  }

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

    if (isFunction(valueChange)) {
      properties.onValueChanged = ({ value }): void => {
        valueChange(value);
      };
    }
    if (itemTemplate) {
      properties.itemTemplate = (item, index, container): void => {
        renderTemplate(itemTemplate as string, { item, index, container }, container);
      };
    }
    return properties;
  }
}
