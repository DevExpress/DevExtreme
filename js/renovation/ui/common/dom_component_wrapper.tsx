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
import type DomComponent from '../../../core/dom_component';
import { ComponentClass } from '../../../core/dom_component'; // eslint-disable-line import/named
import { ConfigContextValue, ConfigContext } from '../../common/config_context';
import { EventCallback } from './event_callback';
import { renderTemplate } from '../../utils/render_template';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import { getUpdatedOptions } from '../grids/data_grid/utils/get_updated_options';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() componentType!: ComponentClass<Record<string, any>>;

  @OneWay() twoWayProps?: string[];

  @OneWay() componentProps!: {
    className?: string;
    itemTemplate?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueChange?: EventCallback<any>;
  };
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DomComponentWrapper extends JSXComponent<DomComponentWrapperProps, 'componentType' | 'componentProps'>() {
  @Mutable() prevProps!: DomComponentWrapperProps;

  @Mutable() twoWayPropUpdating = false;

  @Mutable() isRendered = false;

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

  // @Effect()
  // updateWidget(): void {
  //   const { items, ...restProps } = this.properties;

  //   // if (items !== this.getInstance()?.option('items')) {
  //   //   this.getInstance()?.option('items', items);
  //   // }

  //   this.getInstance()?.option(this.properties);
  // }

  @Effect() updateOptions(): void {
    const instance = this.getInstance();

    if (instance && this.prevProps?.componentProps) {
      const updatedOptions = getUpdatedOptions(
        this.prevProps.componentProps,
        this.props.componentProps,
      );
      instance.beginUpdate();
      updatedOptions.forEach(({ path, value, previousValue }) => {
        if (!this.twoWayPropUpdating) {
          // eslint-disable-next-line no-underscore-dangle
          instance._options.silent(path, previousValue);
          instance.option(path, value);
        }
      });
      this.prevProps = this.props;
      instance.endUpdate();
    } else {
      this.prevProps = this.props;
    }
  }

  @Effect({ run: 'once' }) updateIsRendered(): void {
    this.isRendered = true;
  }

  get properties(): Record<string, unknown> {
    const {
      itemTemplate,
      valueChange,
      ...restProps
    } = this.props.componentProps;

    const properties = ({
      rtlEnabled: !!this.config?.rtlEnabled, // widget expects boolean
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
    if (this.props.twoWayProps) {
      properties.onOptionChanged = ({ name, value }): void => {
        const changeEvent = properties[`${name}Change`] as (unknown) => void;

        try {
          if (!this.isRendered || !changeEvent) return;
          this.twoWayPropUpdating = true;

          const isTwoWayProp = this.props.twoWayProps?.some((prop) => prop === name);

          if (isTwoWayProp) {
            // TODO: get rid columns property for comparing of arrays, it uses for two empty arrays
            const changes = getUpdatedOptions({ columns: properties[name] }, { columns: value });

            if (changes.length !== 0) { changeEvent(value); }
          }
        } finally {
          this.twoWayPropUpdating = false;
        }
      };
    }
    return properties;
  }
}
