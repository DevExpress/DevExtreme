import type { Subscription } from '@js/__internal/core/reactive/subscription';
import type { Subscribable } from '@ts/core/reactive';
import { state, toSubscribable } from '@ts/core/reactive';
import type { InfernoNode } from 'inferno';
import { Component, render } from 'inferno';

export abstract class View {
  private canUpdate = true;

  public readonly abstract vdom: InfernoNode | Subscribable<InfernoNode>;

  public lockedVdom = state<InfernoNode>(undefined as any);

  public render(root: Element): void {
    toSubscribable(this.vdom).subscribe((node: InfernoNode) => {
      render(node, root);
    });
  }

  public setCanUpdate(v: boolean): void {
    this.canUpdate = v;
  }
}

export function asInferno(view: View) {
  interface State {
    vdom: InfernoNode;
  }

  return class InfernoView extends Component<{}, State> {
    private readonly subscription: Subscription;

    constructor() {
      super();
      this.subscription = toSubscribable(view.vdom).subscribe((vdom) => {
        this.state ??= {
          vdom,
        };
        if (this.state.vdom !== vdom) {
          this.setState({ vdom });
        }
      });
    }

    render(): InfernoNode | undefined {
      return this.state?.vdom;
    }
  };
}
