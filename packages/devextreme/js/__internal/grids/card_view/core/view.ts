import type { Subscribable } from '@ts/core/reactive';
import { toSubscribable } from '@ts/core/reactive';
import type { InfernoNode } from 'inferno';
import { render } from 'inferno';

export abstract class View {
  protected abstract vdom: InfernoNode | Subscribable<InfernoNode>;

  public render(root: Element): void {
    toSubscribable(this.vdom).subscribe((node: InfernoNode) => {
      render(node, root);
    });
  }
}
