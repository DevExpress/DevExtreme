/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-namespace */
import type { MaybeSubscribable } from './reactive';
import type { TagNode, TextNode, VNode } from './reactive_dom';

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

export function $$(tag: string): TagHelper {
  return new TagHelper(tag, undefined, undefined);
}

export namespace $$ {
  export function text(value: TextNode['text']): TextNode {
    return {
      type: 'text',
      text: value,
    };
  }
}
