import type DOMComponent from '@js/core/dom_component';
import type { InfernoNode } from 'inferno';
import { Component, createRef } from 'inferno';

export abstract class InfernoWrapper<
  TProperties,
  TComponent extends DOMComponent<TProperties>,
> extends Component<TProperties> {
  private readonly ref = createRef<HTMLDivElement>();

  private component?: TComponent;

  protected abstract getComponentFabric(): new (
    element: Element, options: TProperties
  ) => TComponent;

  public render(): InfernoNode {
    return <div ref={this.ref}></div>;
  }

  public componentDidMount(): void {
    // eslint-disable-next-line no-new, @typescript-eslint/no-non-null-assertion
    this.component = new (this.getComponentFabric())(this.ref.current!, this.props);
  }

  public componentDidUpdate(): void {
    this.component?.option(this.props);
  }

  public componentWillUnmount(): void {
    this.component?.dispose();
  }
}
