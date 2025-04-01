/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import type { ErrorRowProperties } from '@ts/grids/new/grid_core/content_view/error_row';
import { ErrorRow } from '@ts/grids/new/grid_core/content_view/error_row';
import type { NoDataTextProperties } from '@ts/grids/new/grid_core/content_view/no_data_text';
import { NoDataText } from '@ts/grids/new/grid_core/content_view/no_data_text';
import { LoadPanel, type LoadPanelProperties } from '@ts/grids/new/grid_core/inferno_wrappers/load_panel';
import type { Props as ScrollableProps } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { VirtualRow } from './virtual_scrolling/virtual_row';

export const CLASSES = {
  contentView: 'dx-gridcore-contentview',
};

export interface ContentViewProps {
  errorRowProps: ErrorRowProperties;
  loadPanelProps: LoadPanelProperties & { visible: boolean };
  noDataTextProps: NoDataTextProperties & { visible: boolean };

  scrollableProps: ScrollableProps;

  virtualScrollingProps?: {
    heightUp?: number;
    heightDown?: number;
  };

  onViewportHeightChange?: (value: number) => void;

  scrollTop?: number;

  onScroll?: (scrollTop: number) => void;

  onWidthChange?: (value: number) => void;

  scrollableRef?: RefObject<dxScrollable>;
}

export class ContentView extends Component<ContentViewProps> {
  private readonly scrollableRef = createRef<Scrollable>();

  private readonly containerRef = createRef<HTMLDivElement>();

  public render(): JSX.Element {
    return (
      <div className={CLASSES.contentView} ref={this.containerRef}>
        <LoadPanel {...this.props.loadPanelProps} />
        <Scrollable
          ref={this.scrollableRef}
          componentRef={this.props.scrollableRef}
          {...this.props.scrollableProps}
        >
          {this.props.noDataTextProps.visible && <NoDataText {...this.props.noDataTextProps} />}
          {
            this.props.virtualScrollingProps?.heightUp
              ? <VirtualRow height={this.props.virtualScrollingProps?.heightUp}/>
              : undefined
          }
          { this.props.children }
          {
            this.props.virtualScrollingProps?.heightDown
              ? <VirtualRow height={this.props.virtualScrollingProps?.heightDown}/>
              : undefined
          }
        </Scrollable>
        <ErrorRow {...this.props.errorRowProps} />
      </div>
    );
  }

  private updateSizesInfo(): void {
    const clientHeight = this.scrollableRef.current!.clientHeight();
    this.props?.onViewportHeightChange?.(clientHeight);
  }

  public componentDidMount(): void {
    this.updateSizesInfo();
    resizeObserverSingleton.observe(
      this.containerRef.current!,
      (entry: ResizeObserverEntry) => {
        this.props.onWidthChange?.(entry.contentRect.width);
      },
    );
  }

  public componentDidUpdate(): void {
    this.updateSizesInfo();
  }

  public componentWillUnmount(): void {
    resizeObserverSingleton.unobserve(
      this.containerRef.current!,
    );
  }
}
