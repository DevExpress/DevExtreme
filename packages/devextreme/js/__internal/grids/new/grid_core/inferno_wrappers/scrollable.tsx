import type { Properties as ScrollableProperties } from '@js/ui/scroll_view/ui.scrollable';
import dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { createPortal, type InfernoNode } from 'inferno';

import { InfernoWrapper } from './widget_wrapper';

export class Scrollable extends InfernoWrapper<ScrollableProperties, dxScrollable> {
  private readonly contentRef: { current?: HTMLDivElement } = {};

  public render(): InfernoNode {
    return (
      <>
        {super.render()}
        {this.contentRef.current && createPortal(
          this.props.children,
          this.contentRef.current,
        )}
      </>
    );
  }

  protected getComponentFabric(): typeof dxScrollable {
    return dxScrollable;
  }

  public componentDidMount(): void {
    super.componentDidMount();
    // @ts-expect-error
    this.contentRef.current = this.component.$content().get(0);
    this.setState({});
  }
}
