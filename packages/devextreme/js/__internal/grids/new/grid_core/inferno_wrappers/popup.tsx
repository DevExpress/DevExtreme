import type { Properties as PopupProperties } from '@js/ui/popup';
import dxPopup from '@js/ui/popup';
import { createPortal, type InfernoNode } from 'inferno';

import { InfernoWrapper } from './widget_wrapper';

export class Popup extends InfernoWrapper<PopupProperties, dxPopup> {
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

  protected getComponentFabric(): typeof dxPopup {
    return dxPopup;
  }

  public componentDidMount(): void {
    super.componentDidMount();
    // @ts-expect-error
    this.contentRef.current = this.component.$content().get(0);
    this.setState({});
  }
}
