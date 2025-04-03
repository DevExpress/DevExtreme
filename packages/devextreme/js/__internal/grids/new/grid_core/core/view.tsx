/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-classes-per-file */
/* eslint-disable spellcheck/spell-checker */
import { infernoRenderer } from '@ts/core/m_inferno_renderer';
import type { Subscription, SubsGets } from '@ts/core/reactive/index';
import { toSubscribable } from '@ts/core/reactive/index';
import { Component, type ComponentType } from 'inferno';

export abstract class View<T extends {}> {
  private inferno: undefined | ComponentType;

  private props?: T;

  private readonly firstRender = true;

  protected root?: HTMLDivElement;

  protected abstract component: ComponentType<T>;

  protected abstract getProps(): SubsGets<T>;

  public render(root: HTMLDivElement): Subscription {
    this.root = root;
    const ViewComponent = this.component;
    return toSubscribable(this.getProps()).subscribe((props: T) => {
      this.props = props;
      const content = (
        <ViewComponent {...props}/>
      );

      infernoRenderer.renderIntoContainer(content, root, !this.firstRender);
      this.firstRender = false;
    });
  }

  public asInferno(): ComponentType {
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
        return <ViewComponent {...this.state!.props}/>;
      }
    };
  }
}
