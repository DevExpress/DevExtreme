/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LoadPanel, type LoadPanelProperties } from '@ts/grids/new/grid_core/inferno_wrappers/load_panel';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { InfernoNode } from 'inferno';
import { Component, createRef } from 'inferno';

import type { ContentProps } from './content/content';
import { Content } from './content/content';
import type { ErrorRowProperties } from './error_row';
import { ErrorRow } from './error_row';
import type { NoDataTextProperties } from './no_data_text';
import { NoDataText } from './no_data_text';
import { VirtualRow } from './virtual_scrolling/virtual_row';

export const CLASSES = {
  content: 'dx-gridcore-content',
};

export interface ContentViewProps {
  errorRowProps: ErrorRowProperties;
  loadPanelProps: LoadPanelProperties & { visible: boolean };
  noDataTextProps: NoDataTextProperties & { visible: boolean };

  contentProps: ContentProps;

  virtualScrollingProps?: {
    heightUp?: number;
    heightDown?: number;
  };

  onViewportHeightChange?: (value: number) => void;

  scrollTop?: number;

  onScroll?: (scrollTop: number) => void;
}

export class ContentView extends Component<ContentViewProps> {
  private readonly scrollableRef = createRef<Scrollable>();

  render(props: ContentViewProps): InfernoNode {
    return (
        <>
          <ErrorRow {...props.errorRowProps} />
          <LoadPanel {...props.loadPanelProps} />

          <Scrollable
            ref={this.scrollableRef}
            onScroll={(e): void => this.props.onScroll?.(e.scrollOffset.top)}
            scrollTop={this.props.scrollTop}
          >
            {props.noDataTextProps.visible && <NoDataText {...props.noDataTextProps} />}
            <div className={CLASSES.content} tabIndex={0}>
              {
                props.virtualScrollingProps?.heightUp
                  ? <VirtualRow height={props.virtualScrollingProps?.heightUp}/>
                  : undefined
              }
              <Content {...props.contentProps} />
              {
                props.virtualScrollingProps?.heightDown
                  ? <VirtualRow height={props.virtualScrollingProps?.heightDown}/>
                  : undefined
              }
            </div>
          </Scrollable>
        </>
    );
  }

  private updateSizesInfo(): void {
    const clientHeight = this.scrollableRef.current!.clientHeight();
    this.props?.onViewportHeightChange?.(clientHeight);
  }

  componentDidMount(): void {
    this.updateSizesInfo();
  }

  componentDidUpdate(): void {
    this.updateSizesInfo();
  }
}
