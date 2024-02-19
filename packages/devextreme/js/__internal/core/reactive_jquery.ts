/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-namespace */
import type DOMComponent from '@js/core/dom_component';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type { MaybeSubscribable } from './reactive';
import type {
  Component,
  ComponentConstructor,
  ComponentNode, ComponentOptions,
  IfNode,
  MapMaybeSubscribable,
  TagNode, TextNode, VNode, WidgetConstructor, WidgetNode, WidgetOptions,
} from './reactive_dom';
import { _renderComponentNode, _renderWidgetNode } from './reactive_dom';

export type BondElement<TComponent extends Component<any>> = Element & { _component: TComponent };
// eslint-disable-next-line max-len
export type BondRenderer<TComponent extends Component<any>> = dxElementWrapper & { _component: TComponent };

class TagHelper implements TagNode {
  type = 'tag' as const;

  constructor(
    public tag: string,
    public attrs: Record<string, unknown> | undefined,
    public child: VNode | undefined,
  ) {}

  append(...nodes: VNode[]): TagHelper {
    if (nodes.length === 0) {
      return this;
    }

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let newChild!: VNode;

    if (!this.child) {
      if (nodes.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        newChild = nodes[0];
      } else {
        newChild = {
          type: 'array',
          children: nodes,
        };
      }
    } else if (this.child.type !== 'array') {
      newChild = {
        type: 'array',
        children: [
          this.child,
          ...nodes,
        ],
      };
    } else {
      newChild = {
        type: 'array',
        children: [
          ...this.child.children,
          ...nodes,
        ],
      };
    }

    return new TagHelper(this.tag, this.attrs, newChild);
  }

  addClass(className: string): TagHelper {
    return new TagHelper(
      this.tag,
      {
        ...this.attrs,
        className: `${this.attrs?.className ?? ''} ${className}`,
      },
      this.child,
    );
  }

  attr(name: string, value: MaybeSubscribable<unknown>): TagHelper {
    return new TagHelper(
      this.tag,
      {
        ...this.attrs,
        [name]: value,
      },
      this.child,
    );
  }

  text(text: MaybeSubscribable<string>): TagHelper {
    return new TagHelper(
      this.tag,
      this.attrs,
      {
        type: 'text',
        text,
      },
    );
  }
}

class ComponentHelper<TComponent extends Component<any>> implements ComponentNode<TComponent> {
  type = 'component' as const;

  constructor(
    public component: ComponentConstructor<TComponent>,
    public props: MapMaybeSubscribable<ComponentOptions<TComponent>>,
  ) {}

  toRenderer(): BondRenderer<TComponent> {
    const [el, comp] = _renderComponentNode(this);
    const $el = $(el as Element) as BondRenderer<TComponent>;
    $el._component = comp as TComponent;
    return $el;
  }
}

class WidgetHelper<TWidget extends DOMComponent> implements WidgetNode<TWidget> {
  type = 'widget' as const;

  constructor(
    public widget: WidgetConstructor<TWidget>,
    public props: MapMaybeSubscribable<WidgetOptions<TWidget>>,
  ) {}

  toWidgetInstance(): TWidget {
    const [, widget] = _renderWidgetNode(this);
    return widget as TWidget;
  }
}

class IfHelper implements IfNode {
  type = 'if' as const;

  constructor(
    public condition: MaybeSubscribable<boolean>,
    public trueChild: MaybeSubscribable<VNode>,

    public falseChild: MaybeSubscribable<VNode> | undefined,
  ) {}

  elsee(falseChild: MaybeSubscribable<VNode>): IfHelper {
    return new IfHelper(
      this.condition,
      this.trueChild,
      falseChild,
    );
  }
}

export function $$(tag: string): TagHelper {
  return $$.tag(tag);
}

export namespace $$ {
  export function text(value: TextNode['text']): TextNode {
    return {
      type: 'text',
      text: value,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  export function iff(condition: MaybeSubscribable<boolean>) {
    return {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      then: (trueChild: MaybeSubscribable<VNode>) => new IfHelper(condition, trueChild, undefined),
    };
  }

  export function tag(tagName: string): TagHelper {
    return new TagHelper(tagName, undefined, undefined);
  }

  export function component<TComponent extends Component<any>>(
    comp: ComponentConstructor<TComponent>,
    props: MapMaybeSubscribable<ComponentOptions<TComponent>>,
  ): ComponentHelper<TComponent> {
    return new ComponentHelper(
      comp,
      props,
    );
  }

  export function widget<TWidget extends DOMComponent<any>>(
    w: WidgetConstructor<TWidget>,
    props: MapMaybeSubscribable<WidgetOptions<TWidget>>,
  ): WidgetHelper<TWidget> {
    return new WidgetHelper(
      w,
      props,
    );
  }
}
