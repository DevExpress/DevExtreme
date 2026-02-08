/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import type { ErrorRowProperties } from '@ts/grids/new/grid_core/content_view/error_row';
import { ErrorRow } from '@ts/grids/new/grid_core/content_view/error_row';
import type { NoDataTextProperties } from '@ts/grids/new/grid_core/content_view/no_data_text';
import { NoDataText } from '@ts/grids/new/grid_core/content_view/no_data_text';
import type { Props as ScrollableProps } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { LoadPanel, type LoadPanelProperties } from './load_panel';

export const CLASSES = {
  contentView: 'dx-gridcore-contentview',
};

export interface ContentViewProps {
  errorRowProps: ErrorRowProperties;
  loadPanelProps: LoadPanelProperties & { visible: boolean };
  noDataTextProps: NoDataTextProperties & { visible: boolean };

  scrollableProps: ScrollableProps & {
    useKeyboard: boolean;
  };

  onViewportHeightChange?: (value: number) => void;

  scrollTop?: number;

  onScroll?: (scrollTop: number) => void;

  onWidthChange?: (value: number) => void;

  scrollableRef?: RefObject<dxScrollable>;

  showContextMenu?: (e: MouseEvent) => void;

  onRendered?: () => void;
}

export class ContentView extends Component<ContentViewProps> {
  private readonly scrollableRef = createRef<Scrollable>();

  private readonly containerRef = createRef<HTMLDivElement>();

  private resizeObserverTimeout: number | null = null;

  public render(): JSX.Element {
    return (
      <div
        className={CLASSES.contentView}
        ref={this.containerRef}
        oncontextmenu={this.props.showContextMenu}
      >
        <LoadPanel {...this.props.loadPanelProps} />

        {
          this.props.noDataTextProps.visible
            ? <NoDataText {...this.props.noDataTextProps} />
            : (
            <Scrollable
              ref={this.scrollableRef}
              componentRef={this.props.scrollableRef}
              {...this.props.scrollableProps}
            >
              {this.props.children!}
            </Scrollable>
            )
        }

        <ErrorRow {...this.props.errorRowProps} />
      </div>
    );
  }

  private updateSizesInfo(): void {
    if (this.scrollableRef.current) {
      const clientHeight = this.scrollableRef.current.clientHeight();
      this.props?.onViewportHeightChange?.(clientHeight);
    }
  }

  public componentDidMount(): void {
    this.updateSizesInfo();
    resizeObserverSingleton.observe(
      this.containerRef.current!,
      (entry: ResizeObserverEntry) => {
        // NOTE: Hotfix for demos test resize windows issue
        this.resizeObserverTimeout = setTimeout(
          () => {
            this.resizeObserverTimeout = null;
            this.props.onWidthChange?.(entry.contentRect.width);
          },
          0,
        ) as unknown as number;
      },
    );
    this.props.onRendered?.();
  }

  public componentDidUpdate(): void {
    this.updateSizesInfo();
    this.props.onRendered?.();
  }

  public componentWillUnmount(): void {
    resizeObserverSingleton.unobserve(
      this.containerRef.current!,
    );

    if (this.resizeObserverTimeout !== null) {
      clearTimeout(this.resizeObserverTimeout);
    }
  }
}
