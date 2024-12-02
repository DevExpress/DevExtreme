/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
import type { Subscribable, Subscription } from '@ts/core/reactive/index';
import { toSubscribable } from '@ts/core/reactive/index';
import { Component, type ComponentType, render } from 'inferno';

export abstract class View<T extends {}> {
  private inferno: undefined | ComponentType;

  protected abstract component: ComponentType<T>;

  protected abstract getProps(): Subscribable<T>;

  public render(root: Element): Subscription {
    const ViewComponent = this.component;
    return toSubscribable(this.getProps()).subscribe((props: T) => {
      // @ts-expect-error
      render(<ViewComponent {...props}/>, root);
    });
  }

  public asInferno(): ComponentType {
    // @ts-expect-error fixed in inferno v8
    // eslint-disable-next-line no-return-assign
    return this.inferno ??= this._asInferno();
  }

  private _asInferno() {
    const view = this;

    interface State {
      props: T;
    }

    return class InfernoView extends Component<{}, State> {
      private readonly subscription: Subscription;

      constructor() {
        super();
        this.subscription = toSubscribable(view.getProps()).subscribe((props) => {
          this.state ??= {
            props,
          };

          if (this.state.props !== props) {
            this.setState({ props });
          }
        });
      }

      public render(): JSX.Element | undefined {
        const ViewComponent = view.component;
        // @ts-expect-error
        return <ViewComponent {...this.state!.props}/>;
      }
    };
  }
}
