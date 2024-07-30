import type DOMComponent from '@js/core/dom_component';
import type { InfernoNode } from 'inferno';
import { Component, createRef } from 'inferno';

export function createWidgetWrapper<
  TProperties, TComponent extends DOMComponent<TProperties>,
>(
  component: new (element: Element, options: TProperties) => TComponent,
) {
  return class Wrapper extends Component<TProperties> {
    ref = createRef<HTMLDivElement>();

    component!: TComponent;

    render(): InfernoNode {
      return <div ref={this.ref}></div>;
    }

    componentDidMount(): void {
      // eslint-disable-next-line no-new, new-cap, @typescript-eslint/no-non-null-assertion
      this.component = new component(this.ref.current!, this.props);
    }

    componentDidUpdate(): void {
      this.component.option(this.props);
    }

    componentWillUnmount(): void {
      this.component.dispose();
    }
  };
}
