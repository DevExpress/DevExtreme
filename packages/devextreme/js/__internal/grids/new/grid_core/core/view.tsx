/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-classes-per-file */

import type { ReadonlySignal } from '@ts/core/reactive/index';
import { effect } from '@ts/core/reactive/index';
import { infernoRenderer } from '@ts/core/m_inferno_renderer';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/base_component';
import { hasWindow } from '@ts/core/utils/m_window';
import { type ComponentType } from 'inferno';

export abstract class View<T extends {}> {
  private inferno: undefined | ComponentType;

  private props?: T;

  private firstRender = true;

  protected root?: HTMLDivElement;

  protected abstract component: ComponentType<T>;

  protected abstract getProps(): ReadonlySignal<T>;

  public render(root: HTMLDivElement): () => void {
    this.root = root;
    const ViewComponent = this.component;
    const props = this.getProps();
    return effect(() => {
      this.props = props.value;
      const content = (
        <ViewComponent {...props.value}/>
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

    return class InfernoView extends BaseInfernoComponent<{}, State> {
      private readonly unsubscribe: () => void;

      constructor() {
        super();
        const props = view.getProps();
        this.unsubscribe = effect(() => {
          view.props = props.value;

          this.state ??= {
            props: props.value,
          };

          if (this.state.props !== props.value && hasWindow()) {
            this.setState({ props: props.value });
          }
        });
      }

      public componentWillUnmount(): void {
        this.unsubscribe();
      }

      public render(): JSX.Element | undefined {
        const ViewComponent = view.component;
        return <ViewComponent {...this.state!.props}/>;
      }
    };
  }
}
