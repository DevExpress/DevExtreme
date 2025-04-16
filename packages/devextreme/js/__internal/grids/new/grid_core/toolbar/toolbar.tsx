/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { off, on } from '@js/common/core/events';
import { Component, createRef } from 'inferno';

import { Toolbar } from '../inferno_wrappers/toolbar';
import type { ToolbarProps } from './types';

export class ToolbarView extends Component<ToolbarProps> {
  private readonly containerRef = createRef<HTMLDivElement>();

  public render(): JSX.Element {
    const { visible, items, disabled } = this.props;

    if (!visible) {
      return <></>;
    }

    return (
      <Toolbar
        elementRef={this.containerRef}
        visible={visible}
        items={items}
        disabled={disabled}
      />
    );
  }

  public componentDidMount(): void {
    on(this.containerRef.current!, 'dxcontextmenu', this.handleContextMenu);
  }

  public componentWillUnmount(): void {
    off(this.containerRef.current!, 'dxcontextmenu', this.handleContextMenu);
  }

  private readonly handleContextMenu = (e: MouseEvent): void => {
    this.props.showContextMenu!(e);
  };
}
