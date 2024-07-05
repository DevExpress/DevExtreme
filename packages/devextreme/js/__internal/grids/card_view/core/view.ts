import { Subscribable, toSubscribable } from '@ts/core/reactive';
import { InfernoNode, render } from "inferno";

export abstract class View {
  protected abstract vdom: InfernoNode | Subscribable<InfernoNode>; 

  public render(root: Element): void {
    toSubscribable(this.vdom).subscribe((node: InfernoNode) => {
      render(node, root);
    });
  }
}