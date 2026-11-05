import type { dxElementWrapper } from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { RowKey } from '@ts/grids/grid_core/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { VirtualScrollingDataControllerExtension } from '@ts/grids/grid_core/virtual_scrolling';

export interface FocusDataControllerExtension {
  _updatePageIndexes: () => void;
  afterChanged: Callback<[DataChange]>;
  getLastChange: () => DataChange | undefined;
  isPagingByRendering: () => boolean | undefined;
  _getLastItemIndex: () => number;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  getPageIndexByKey(key: RowKey): DeferredObj<number>;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  getGlobalRowIndexByKey(key: RowKey): DeferredObj<number>;
}

export type FocusDataController = DataController
& Partial<VirtualScrollingDataControllerExtension>
& FocusDataControllerExtension;

export interface FocusDataSourceControllerExtension {
  consumeDataPushed: () => boolean;
}

export type FocusDataSourceController = DataSourceController & FocusDataSourceControllerExtension;

export interface FocusRowsViewExtension {
  scrollToRowElement: (key: RowKey) => DeferredObj<unknown>;
  scrollToElementVertically: ($row: dxElementWrapper) => DeferredObj<unknown>;
  scrollTopPosition: (scrollTop: number) => DeferredObj<unknown>;
}

export type FocusRowsView = RowsView & FocusRowsViewExtension;

export type ValueGetter = (data: RawItemData) => unknown;

export interface SortFilterValueOptions {
  isRemoteFiltering: boolean;
  dateSerializationFormat: string | undefined;
  getSelector: (selector: string) => ValueGetter | undefined;
}

export interface SortFilterValue {
  getter: ValueGetter;
  rawValue: unknown;
  safeValue: unknown;
}
