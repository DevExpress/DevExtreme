import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type {
  VirtualDataLoaderDataOptions,
  VirtualItemsCount,
} from '@ts/grids/grid_core/virtual_data_loader/types';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

import type { VirtualScrollController } from './m_virtual_scrolling_core';

export interface ChangedLoadParams {
  pageIndex: number;
  loadPageCount: number;
}

export interface VirtualScrollingResizingControllerExtension {
  hasResizeTimeout: () => boolean;
}

export interface ViewportParams {
  skip: number;
  take: number;
}

export interface VirtualScrollDataOptions extends VirtualDataLoaderDataOptions {
  changingDuration: () => number;
  loadedOffset?: () => number;
  loadedItemCount?: () => number;
  renderedItemsRange?: () => ViewportParams | undefined;
}

export type ExternalScrollable = Scrollable | dxElementWrapper;

export interface ScrollEventsStrategy {
  on: (scrollable: ExternalScrollable, eventName: string, handler: () => void) => void;
  off: (scrollable: ExternalScrollable, eventName: string, handler: () => void) => void;
}

export interface ExternalScrollers {
  scrollTo: (position: number) => void;
  dispose: () => void;
}

export interface VirtualScrollingDataSourceAdapterExtension {
  _virtualScrollController: VirtualScrollController;
  _renderTime: number;
  _isLoading?: boolean;
  loadPageCount: {
    (): number;
    (count: number): void;
  };
  beginPageIndex: (...args: [] | [number]) => number;
  virtualItemsCount: () => VirtualItemsCount | undefined;
  getContentOffset: (type?: 'begin' | 'end') => number;
  getVirtualContentSize: () => number;
  setContentItemSizes: (sizes: number[]) => void;
  setViewportPosition: (position: number) => DeferredObj<unknown>;
  getViewportItemIndex: () => number;
  setViewportItemIndex: (viewportItemIndex: number) => DeferredObj<unknown> | undefined;
  getItemIndexByPosition: () => number;
  viewportSize: (size?: number) => number;
  viewportItemSize: (size?: number) => number;
  getItemSize: () => number;
  getItemSizes: () => Record<number, number>;
  loadIfNeed: () => void;
}

export type VirtualScrollingDataSourceAdapter = DataSourceAdapter
& VirtualScrollingDataSourceAdapterExtension;

export interface VirtualScrollingRowsViewExtension {
  _updateContentPosition: (isRender?: boolean) => void;
}

export type VirtualScrollingRowsView = RowsView & VirtualScrollingRowsViewExtension;
