/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  hasTemplate, InfernoComponent, InfernoEffect, renderTemplate,
} from '@devextreme/runtime/inferno';
import type { ComponentClass } from '@js/core/dom_component';
import { getUpdatedOptions } from '@js/renovation/ui/common/utils/get_updated_options';
import type { DisposeEffectReturn } from '@js/renovation/utils/effect_return';
import type { RefObject } from 'inferno';
import { createRef } from 'inferno';

import type DomComponent from '../../../core/dom_component';
import { extend } from '../../../core/utils/extend';
import { ConfigContext } from './config_context';
import type { EventCallback } from './event_callback';

interface ComponentProps {
  className?: string;
  itemTemplate?: string | (() => string | HTMLElement);
  valueChange?: EventCallback<any>;
}

export interface DomComponentWrapperProps {
  componentType: ComponentClass<any>;
  templateNames: string[];
  componentProps: ComponentProps;
}

const normalizeProps = (props: ComponentProps): ComponentProps => Object
  .keys(props).reduce((accumulator, key) => {
    if (props[key] !== undefined) {
      accumulator[key] = props[key];
    }

    return accumulator;
  }, {});

export class DomComponentWrapper extends InfernoComponent<DomComponentWrapperProps> {
  public state: any = {};

  public refs: any = null;

  private readonly widgetRef: RefObject<HTMLDivElement> = createRef();

  private instance: DomComponent | null = null;

  private prevProps: ComponentProps | null = null;

  constructor(props) {
    super(props);
    this.getInstance = this.getInstance.bind(this);
    this.setupWidget = this.setupWidget.bind(this);
    this.updateWidget = this.updateWidget.bind(this);
  }

  getConfig(): any {
    const { id } = ConfigContext;
    if (this.context[id]) {
      return this.context[id];
    }
    return ConfigContext.defaultValue;
  }

  render(): JSX.Element {
    return (
      <div
        ref={this.widgetRef}
        className={this.props.componentProps.className}
        {...this.props}
      />
    );
  }

  componentWillUpdate(nextProps: DomComponentWrapperProps, nextState, context): void {
    super.componentWillUpdate(nextProps, nextState, context);
  }

  createEffects(): InfernoEffect[] {
    return [
      new InfernoEffect(this.setupWidget, []),
      new InfernoEffect(
        this.updateWidget,
        [
          this.props.componentProps,
          this.getConfig(),
          this.props.templateNames,
        ],
      )];
  }

  updateEffects(): void {
    const dependency = [this.props.componentProps, this.getConfig(), this.props.templateNames];
    this._effects[1]?.update(dependency);
  }

  setupWidget(): DisposeEffectReturn {
    const current = this.widgetRef.current as HTMLDivElement;
    // eslint-disable-next-line new-cap
    const componentInstance = new this.props.componentType(current, this.getProperties());
    this.instance = componentInstance;
    return () => {
      componentInstance.dispose();
      this.instance = null;
    };
  }

  updateWidget(): void {
    if (!this.instance) {
      return;
    }
    const updatedOptions = getUpdatedOptions(this.prevProps ?? {}, this.getProperties());
    if (updatedOptions.length) {
      this.instance.beginUpdate();
      updatedOptions.forEach((_ref2) => {
        const {
          path,
          value,
        } = _ref2;
        this.instance?.option(path, value);
      });
      this.instance.endUpdate();
    }
    this.prevProps = this.getProperties();
  }

  getProperties(): any {
    const normalizedProps = normalizeProps(this.props.componentProps);
    const {
      valueChange,
    } = normalizedProps;
    const properties = extend({
      rtlEnabled: this.getConfig()?.rtlEnabled,
      isRenovated: true,
    }, normalizedProps);
    if (valueChange) {
      properties.onValueChanged = (_ref3): any => {
        const {
          value,
        } = _ref3;
        return valueChange(value);
      };
    }
    const templates = this.props.templateNames as any;
    templates.forEach((name) => {
      if (hasTemplate(name, properties, this)) {
        properties[name] = (item, index, container): any => {
          renderTemplate((this.props.componentProps as any)[name], {
            item,
            index,
            container,
          }, this);
        };
      }
    });
    return properties;
  }

  getInstance(): any {
    return this.instance;
  }
}
