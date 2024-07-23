/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  hasTemplate, InfernoComponent, InfernoEffect, renderTemplate,
} from '@devextreme/runtime/inferno';
import type { ComponentClass } from '@js/core/dom_component';
import type { EventCallback } from '@js/renovation/ui/common/event_callback';
import { getUpdatedOptions } from '@js/renovation/ui/common/utils/get_updated_options';
import type { DisposeEffectReturn } from '@js/renovation/utils/effect_return';
import type { VNode } from 'inferno';
import { createRef, createVNode, normalizeProps } from 'inferno';

import type DomComponent from '../../../core/dom_component';
import { extend } from '../../../core/utils/extend';
import { ConfigContext } from '../../../renovation/common/config_context';

interface ComponentProps {
  className?: string;
  itemTemplate?: string | (() => string | HTMLElement);
  valueChange?: EventCallback<any>;
}

export interface DomComponentWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentType: ComponentClass<any>;
  templateNames: string[];
  componentProps: ComponentProps;
}

export class DomComponentWrapper extends InfernoComponent<DomComponentWrapperProps> {
  public state: any = {};

  public refs: any = null;

  private readonly widgetRef = createRef();

  private instance: DomComponent | null = null;

  private prevProps: ComponentProps | null = null;

  get config(): any {
    const { id } = (ConfigContext as any);
    if (this.context[id]) {
      return this.context[id];
    }
    return (ConfigContext as any).defaultValue;
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.widgetRef = createRef();
    this.getInstance = this.getInstance.bind(this);
    this.setupWidget = this.setupWidget.bind(this);
    this.updateWidget = this.updateWidget.bind(this);
  }

  render(): VNode {
    const vNode = createVNode(1, 'div', this.props.componentProps.className, null, 1, extend({}, this.props), null, this.widgetRef);
    return normalizeProps(vNode) as VNode;
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
          this.config,
          this.props.templateNames,
        ],
      )];
  }

  updateEffects(): void {
    this._effects[1]?.update([this.props.componentProps, this.config, this.props.templateNames]);
  }

  setupWidget(): DisposeEffectReturn {
    const current = this.widgetRef.current as HTMLDivElement;
    // eslint-disable-next-line new-cap
    const componentInstance = new this.props.componentType(current, this.properties);
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
    const updatedOptions = getUpdatedOptions(this.prevProps ?? {}, this.properties);
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
    this.prevProps = this.properties;
  }

  get properties(): any {
    const normalizedProps = normalizeProps(this.props.componentProps);
    const {
      valueChange,
    } = normalizedProps;
    const properties = extend({
      rtlEnabled: this.config?.rtlEnabled,
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
