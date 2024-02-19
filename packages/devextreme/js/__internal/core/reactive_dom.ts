/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
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

export interface ComponentNode<TComponent extends Component<any> = Component<any>> {
  type: 'component';

  component: new (props: ComponentOptions<TComponent>) => TComponent;

  props: ComponentOptions<TComponent>;
}

export type VNode = TagNode | TextNode | ArrayNode | ComponentNode;

function renderComponentNode(node: ComponentNode): Node {
  // eslint-disable-next-line new-cap
  const component = new node.component(node.props);
  return component.render();
}

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

function assertNever(a: never): never {
  throw new Error(a);
}

function _render(node: VNode): Node {
  if (node.type === 'tag') {
    return renderTagNode(node);
  }
  if (node.type === 'text') {
    return renderTextNode(node);
  }

  if (node.type === 'array') {
    return renderArrayNode(node);
  }

  if (node.type === 'component') {
    return renderComponentNode(node);
  }

  return assertNever(node);
}

function render(node: MaybeSubscribable<VNode>): Subscribable<Node> {
  return computed(
    (node): Node => _render(node),
    [toSubscribable(node)],
  );
}

export function bindToDom(root: Element, node: MaybeSubscribable<VNode>): void {
  render(node).subscribe((node) => {
    // @ts-ignore
    root.replaceChildren(node);
  });
}

export type ComponentOptions<TComponent>
  = TComponent extends Component<infer TProps>
    ? TProps
    : never;

export type ComponentConstructor<TComponent> = new (p: ComponentOptions<TComponent>) => TComponent;

export abstract class Component<TProperties> {
  protected props: { [P in keyof TProperties]: Subscribable<TProperties[P]> };

  constructor(props: { [P in keyof TProperties]: MaybeSubscribable<TProperties[P]> }) {
    this.props = {} as { [P in keyof TProperties]: Subscribable<TProperties[P]> };
    Object.entries(props ?? {}).forEach(([name, value]) => {
      this.props[name] = toSubscribable(value);
    });
  }
  abstract getMarkup(): VNode;

  bindToDom(root: Element): void {
    bindToDom(root, this.getMarkup());
  }

  render(): Node {
    return _render(this.getMarkup());
  }
}
