/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-namespace */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type { MaybeSubscribable } from './reactive';
import type {
  Component,
  ComponentConstructor,
  ComponentNode, ComponentOptions,
  TagNode, TextNode, VNode,
} from './reactive_dom';
import { _renderComponentNode } from './reactive_dom';

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
    public props: ComponentOptions<TComponent>,
  ) {}

  toRenderer(): BondRenderer<TComponent> {
    const [el, comp] = _renderComponentNode(this);
    const $el = $(el as Element) as BondRenderer<TComponent>;
    $el._component = comp as TComponent;
    return $el;
  }
}

export function $$(tag: string): TagHelper;
export function $$<TComponent extends Component<any>>(
  component: ComponentConstructor<TComponent>,
  props: ComponentOptions<TComponent>
): ComponentHelper<TComponent>;
export function $$<TComponent extends Component<any>>(
  tag: string | ComponentConstructor<TComponent>,
  props?: ComponentOptions<TComponent>,
): TagHelper | ComponentHelper<TComponent> {
  if (typeof tag === 'string') {
    return new TagHelper(tag, undefined, undefined);
  }

  return new ComponentHelper(
    tag,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    props!,
  );
}

export namespace $$ {
  export function text(value: TextNode['text']): TextNode {
    return {
      type: 'text',
      text: value,
    };
  }
}
