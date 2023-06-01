import {
  Component,
  ComponentBindings,
  OneWay,
  JSXComponent,
  Ref,
  Method,
  Effect,
  Consumer,
  RefObject,
  Mutable,
} from '@devextreme-generator/declarations';
import { renderTemplate, hasTemplate } from '@devextreme/runtime/declarations';
import type DomComponent from '../../../core/dom_component';
import { ComponentClass } from '../../../core/dom_component'; // eslint-disable-line import/named
import { ConfigContextValue, ConfigContext } from '../../common/config_context';
import { EventCallback } from './event_callback';
import { DisposeEffectReturn } from '../../utils/effect_return';
import { getUpdatedOptions } from './utils/get_updated_options';

interface ComponentProps {
  className?: string;
  itemTemplate?: string | (() => string | HTMLElement);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueChange?: EventCallback<any>;
}

const normalizeProps = (props: ComponentProps): ComponentProps => Object
  .keys(props).reduce((accumulator, key) => {
    if (props[key] !== undefined) {
      accumulator[key] = props[key];
    }

    return accumulator;
  }, {});

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() componentType!: ComponentClass<Record<string, any>>;

  @OneWay() templateNames!: string[];

  @OneWay() componentProps!: ComponentProps;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DomComponentWrapper extends JSXComponent<DomComponentWrapperProps, 'componentType' | 'templateNames' | 'componentProps'>() {
  @Ref()
  widgetRef!: RefObject<HTMLDivElement>;

  @Mutable()
  instance!: DomComponent | null;

  @Mutable() prevProps!: Record<string, unknown>;

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

  @Effect()
  updateWidget(): void {
    const instance = this.getInstance();
    if (!instance) {
      return;
    }

    const updatedOptions = getUpdatedOptions(this.prevProps || {}, this.properties);
    if (updatedOptions.length) {
      instance.beginUpdate();
      updatedOptions.forEach(({ path, value }) => { instance.option(path, value); });
      instance.endUpdate();
    }

    this.prevProps = this.properties;
  }

  get properties(): Record<string, unknown> {
    const normalizedProps = normalizeProps(this.props.componentProps);

    const {
      valueChange,
      ...restProps
    } = normalizedProps;

    const properties = ({
      rtlEnabled: !!this.config?.rtlEnabled, // widget expects boolean
      isRenovated: true,
      ...restProps,
    }) as Record<string, unknown>;
    if (valueChange) {
      properties.onValueChanged = ({ value }): void => valueChange(value);
    }
    const templates = this.props.templateNames;
    templates.forEach((name) => {
      if (hasTemplate(name, properties, this)) {
        properties[name] = (item, index, container): void => {
          renderTemplate(this.props.componentProps[name], { item, index, container }, this);
        };
      }
    });
    return properties;
  }
}
