import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { ComponentClass } from '@js/core/dom_component';
import type { EventCallback } from '@js/renovation/ui/common/event_callback';
import { getUpdatedOptions } from '@js/renovation/ui/common/utils/get_updated_options';
import type { DisposeEffectReturn } from '@js/renovation/utils/effect_return';
import type { VNode } from 'inferno';
import { createRef, createVNode, normalizeProps } from 'inferno';

import type DomComponent from '../../../core/dom_component';
import { extend } from '../../../core/utils/extend';

interface ComponentProps {
  className?: string;
  itemTemplate?: string | (() => string | HTMLElement);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueChange?: EventCallback<any>;
}

export interface DomComponentWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentType: ComponentClass<any>;
  templateNames: string[];
  componentProps: ComponentProps;
}

export class DomComponentWrapper extends BaseInfernoComponent<DomComponentWrapperProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public state: any = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public refs: any = null;

  private readonly widgetRef = createRef();

  private instance: DomComponent | null = null;

  private prevProps: ComponentProps | null = null;

  render(): VNode {
    const vNode = createVNode(1, 'div', this.props.componentProps.className, null, 1, extend({}, this.props), null, this.widgetRef);
    return normalizeProps(vNode) as VNode;
  }

  setupWidget(): DisposeEffectReturn {
    const current = this.widgetRef.current as HTMLDivElement;
    // eslint-disable-next-line new-cap
    const componentInstance = new this.props.componentType(current, this.props.componentProps);
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
    const updatedOptions = getUpdatedOptions(this.prevProps ?? {}, this.props.componentProps);
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
    this.prevProps = this.props.componentProps;
  }
}
