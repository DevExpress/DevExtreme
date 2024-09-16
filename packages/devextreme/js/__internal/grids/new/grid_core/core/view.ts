/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
import type { Subscribable } from '@ts/core/reactive';
import { toSubscribable } from '@ts/core/reactive';
import type { Subscription } from '@ts/core/reactive/subscription';
import type { InfernoNode } from 'inferno';
import { Component, render } from 'inferno';

export abstract class View {
  private canUpdate = true;

  private inferno: undefined | ReturnType<typeof asInferno>;

  public readonly abstract vdom: InfernoNode | Subscribable<InfernoNode>;

  public render(root: Element): Subscription {
    return toSubscribable(this.vdom).subscribe((node: InfernoNode) => {
      render(node, root);
    });
  }

  public setCanUpdate(v: boolean): void {
    this.canUpdate = v;
  }

  public asInferno(): ReturnType<typeof asInferno> {
    // eslint-disable-next-line no-return-assign
    return this.inferno ??= asInferno(this);
  }
}

function asInferno(view: View) {
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

    public render(): InfernoNode | undefined {
      return this.state?.vdom;
    }
  };
}
