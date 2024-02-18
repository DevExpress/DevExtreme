/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable spellcheck/spell-checker */
import type { MaybeSubscribable, Subscribable } from './reactive';
import { computed, isSubscribable, toSubscribable } from './reactive';

export interface TagNode {
  type: 'tag';

  tag: string;
  attrs?: Record<string, unknown | Subscribable<unknown>>;

  child?: VNode | Subscribable<VNode>;
}

export interface TextNode {
  type: 'text';

  text: MaybeSubscribable<string | number | undefined>;
}

export interface ArrayNode {
  type: 'array';

  children: MaybeSubscribable<VNode>[];
}

export type VNode = TagNode | TextNode | ArrayNode;

function renderTagNode(node: TagNode): Node {
  const el = document.createElement(node.tag);

  Object.entries(node.attrs ?? {}).forEach(([name, value]) => {
    if (isSubscribable(value)) {
      value.subscribe((value) => {
        el[name] = value;
      });
    } else {
      el[name] = value;
    }
  });

  if (node.child) {
    render(node.child).subscribe((node) => {
      // @ts-ignore
      el.replaceChildren(node);
    });
  }

  return el;
}

function renderTextNode(node: TextNode): Node {
  const el = document.createTextNode('');
  toSubscribable(node.text).subscribe((text) => {
    el.textContent = `${text}`;
  });

  return el;
}

function renderArrayNode(node: ArrayNode): Node {
  // this implementation can cause a bug if rendering tree with Observable with no default value
  // and which wasn't updated once yet.
  // Also array inside array isn't supported

  const fragment = new DocumentFragment();
  const nodes: (Node | undefined)[] = node.children.map(() => undefined);

  node.children.forEach((node, i) => {
    render(node).subscribe((node) => {
      if (nodes[i]) {
        (nodes[i] as Element).replaceWith(nodes[i]!);
      }
      nodes[i] = node;
    });
    fragment.append(nodes[i]!);
  });

  return fragment;
}

function render(node: MaybeSubscribable<VNode>): Subscribable<Node> {
  return computed((node): Node => {
    if (node.type === 'tag') {
      return renderTagNode(node);
    }
    if (node.type === 'text') {
      return renderTextNode(node);
    }

    if (node.type === 'array') {
      return renderArrayNode(node);
    }

    throw new Error('unknown vnode');
  }, [toSubscribable(node)]);
}

export function bindToDom(root: Element, node: MaybeSubscribable<VNode>): void {
  render(node).subscribe((node) => {
    // @ts-ignore
    root.replaceChildren(node);
  });
}

export abstract class Component {
  abstract getMarkup(): VNode;

  render(root: Element): void {
    bindToDom(root, this.getMarkup());
  }
}
