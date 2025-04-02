import type { Properties as PopupProperties } from '@js/ui/popup';
import dxPopup from '@js/ui/popup';
import type { InfernoNode, RefObject } from 'inferno';
import { createPortal } from 'inferno';

import { wrapRef } from './utils';
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

  private transformRef(props: PopupProperties): PopupProperties {
    // @ts-expect-error
    if (props?.position?.of?.current) {
      // eslint-disable-next-line no-param-reassign
      props = {
        ...props,
        position: {
          // @ts-expect-error
          ...props.position,
          // @ts-expect-error
          of: wrapRef(props.position.of),
        },
      };
    }
    return props;
  }

  protected createComponent(ref: RefObject<HTMLDivElement>, props: PopupProperties): dxPopup {
    return super.createComponent(
      ref,
      this.transformRef(props),
    );
  }

  protected updateComponentOptions(prevProps: PopupProperties, props: PopupProperties): void {
    super.updateComponentOptions(
      prevProps,
      this.transformRef(props),
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
