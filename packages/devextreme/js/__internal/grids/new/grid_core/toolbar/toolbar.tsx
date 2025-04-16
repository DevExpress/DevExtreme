/* eslint-disable
  @typescript-eslint/no-non-null-assertion,
  spellcheck/spell-checker
*/
import { off, on } from '@js/common/core/events';
import type { WithKbnProps } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import { withKeyDownHandler } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import { Component, createRef } from 'inferno';

import { Toolbar } from '../inferno_wrappers/toolbar';
import type { ToolbarProps } from './types';

export type ToolbarViewProps = ToolbarProps & WithKbnProps;

const ToolbarComponent = withKeyDownHandler(Toolbar);

export class ToolbarView extends Component<ToolbarViewProps> {
  private readonly containerRef = createRef<HTMLDivElement>();

  public componentDidMount(): void {
    on(this.containerRef.current!, 'dxcontextmenu', this.onContextMenu);
  }

  public componentWillUnmount(): void {
    off(this.containerRef.current!, 'dxcontextmenu', this.onContextMenu);
  }

  public render(): JSX.Element {
    const { visible, items, disabled } = this.props;

    if (!visible) {
      return <></>;
    }

    return (
      <ToolbarComponent
        elementRef={this.containerRef}
        visible={visible}
        items={items}
        disabled={disabled}
        keyDownConfig={{
          'F10+shift': (event) => {
            this.props.showContextMenu?.(event);
          },
        }}
      />
    );
  }

  private readonly onContextMenu = (event: MouseEvent): void => {
    this.props.showContextMenu?.(event);
  };
}
