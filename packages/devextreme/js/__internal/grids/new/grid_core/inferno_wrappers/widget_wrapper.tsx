import type DOMComponent from '@js/core/dom_component';
import type { InfernoNode, RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

interface WithRef<TComponent> {
  componentRef?: RefObject<TComponent>;
}

export abstract class InfernoWrapper<
  TProperties,
  TComponent extends DOMComponent<TProperties>,
> extends Component<TProperties & WithRef<TComponent>> {
  protected readonly ref = createRef<HTMLDivElement>();

  protected component?: TComponent;

  protected abstract getComponentFabric(): new (
    element: Element, options: TProperties
  ) => TComponent;

  public render(): InfernoNode {
    return <div ref={this.ref}></div>;
  }

  private updateComponentRef(): void {
    if (this.props.componentRef) {
      // @ts-expect-error
      this.props.componentRef.current = this.component;
    }
  }

  public componentDidMount(): void {
    // eslint-disable-next-line no-new, @typescript-eslint/no-non-null-assertion
    this.component = new (this.getComponentFabric())(this.ref.current!, this.props);
    this.updateComponentRef();
  }

  public componentDidUpdate(): void {
    this.component?.option(this.props);
    this.updateComponentRef();
  }

  public componentWillUnmount(): void {
    this.component?.dispose();
  }
}
