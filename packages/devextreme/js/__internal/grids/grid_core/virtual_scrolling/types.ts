import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ViewDataChange } from '@ts/grids/grid_core/views/types';
import type {
  ItemSizes,
  VirtualDataLoaderDataOptions,
  VirtualItemsCount,
} from '@ts/grids/grid_core/virtual_data_loader/types';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

import type { VirtualScrollController } from './virtual_scrolling_core';

export interface ChangedLoadParams {
  pageIndex: number;
  loadPageCount: number;
}

export interface LoadPageParams extends ChangedLoadParams {
  skipForCurrentPage: number;
}

export interface LoadViewportOptions {
  checkLoadedParamsOnly?: boolean;
  checkLoading?: boolean;
  viewportIsNotFilled?: boolean;
}

export interface VirtualScrollingResizingControllerExtension {
  hasResizeTimeout: () => boolean;
}

export type VirtualScrollingResizingController = ResizingController
& VirtualScrollingResizingControllerExtension;

export type ContentOffsetType = 'begin' | 'end';

export interface ViewportParams {
  skip: number;
  take: number;
}

export interface VirtualScrollDataOptions extends VirtualDataLoaderDataOptions {
  changingDuration: () => number;
  loadedOffset?: () => number;
  loadedItemCount?: () => number | undefined;
  renderedItemsRange?: () => ViewportParams | undefined;
}

export type RowsScrollDataOptions = Required<VirtualScrollDataOptions>;

export type ExternalScrollable = Scrollable | dxElementWrapper;

export interface ExternalScrollers {
  scrollTo: (position: number) => void;
  dispose: () => void;
}

export interface VirtualScrollingDataSourceAdapterExtension {
  _virtualScrollController: VirtualScrollController;
  _renderTime: number;
  _isLoading: boolean;
  loadPageCount: {
    (): number;
    (count: number): void;
  };
  beginPageIndex: () => number;
  virtualItemsCount: () => VirtualItemsCount | undefined;
  getContentOffset: (type?: ContentOffsetType) => number;
  setContentItemSizes: (sizes: number[]) => void;
  setViewportPosition: (position: number) => DeferredObj<unknown>;
  getViewportItemIndex: () => number;
  setViewportItemIndex: (viewportItemIndex: number) => DeferredObj<unknown> | undefined;
  getItemIndexByPosition: () => number;
  viewportSize: (size?: number) => number;
  viewportItemSize: (size?: number) => number;
  getItemSize: () => number;
  getItemSizes: () => ItemSizes;
  loadIfNeed: () => void;
}

export type VirtualScrollingDataSourceAdapter = DataSourceAdapter
& VirtualScrollingDataSourceAdapterExtension;

export type VirtualScrollingDataChange = ViewDataChange & { removeCount?: number };

export interface VirtualScrollingDataControllerExtension {
  virtualItemsCount: () => VirtualItemsCount | undefined;
  // TODO public controller
  _rowsScrollController?: VirtualScrollController | null;
  viewportSize: (size?: number) => number | undefined;
  viewportHeight: (height: number, scrollTop?: number) => void;
  viewportItemSize: (size?: number) => number | undefined;
  setViewportPosition: (position: number) => void;
  setContentItemSizes: (sizes: number[]) => void;
  getItemSize: () => number | undefined;
  getItemSizes: () => ItemSizes | undefined;
  getContentOffset: (type?: ContentOffsetType) => number | undefined;
  updateViewport: () => void;
  loadIfNeed: () => void;
}

export interface VirtualScrollingRowsViewExtension {
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  _updateContentPosition(isRender?: boolean): void;
}

export type VirtualScrollingRowsView = RowsView & VirtualScrollingRowsViewExtension;
