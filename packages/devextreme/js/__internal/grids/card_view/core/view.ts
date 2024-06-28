import { Subscribable, toSubscribable } from '@ts/core/reactive';
import { InfernoNode, render } from "inferno";

export abstract class View {
  public abstract getVDOM(): InfernoNode | Subscribable<InfernoNode>; 

  public render(root: HTMLElement): void {
    toSubscribable(this.getVDOM()).subscribe((node: InfernoNode) => {
      render(node, root);
    });
  }
}