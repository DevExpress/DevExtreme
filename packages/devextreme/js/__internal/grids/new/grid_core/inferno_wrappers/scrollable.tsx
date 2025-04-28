/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Properties as ScrollableProperties } from '@js/ui/scroll_view/ui.scrollable';
import dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { createPortal, type InfernoNode } from 'inferno';

import { InfernoWrapper } from './widget_wrapper';

export interface Props extends ScrollableProperties {
  scrollTop?: number;
}

export class Scrollable extends InfernoWrapper<Props, dxScrollable> {
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

  private updateScrollTop(): void {
    this.component?.scrollTo(this.props.scrollTop);
  }

  public componentDidMount(): void {
    if (this.props.useNative === undefined) {
      // @ts-expect-error
      delete this.props.useNative;
    }
    super.componentDidMount();
    // @ts-expect-error
    this.contentRef.current = this.component.$content().get(0);
    this.setState({});
    this.updateScrollTop();
  }

  public componentDidUpdate(prevProps: Props): void {
    super.componentDidUpdate(prevProps);
    this.updateScrollTop();
  }

  public clientHeight(): number {
    return this.component!.clientHeight();
  }
}
