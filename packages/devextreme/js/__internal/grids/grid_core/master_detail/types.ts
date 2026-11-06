import type { dxElementWrapper } from '@js/core/renderer';
import type {
  DataChange, GeneratedItem, ItemProcessingOptions, ProcessedItem,
} from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { RowKey } from '@ts/grids/grid_core/types';
import type { RowRenderOptions, ViewRow } from '@ts/grids/grid_core/views/types';

export interface MasterDetailExpandedItem {
  key: RowKey;
  visible: boolean;
}

export interface MasterDetailDataControllerExtension {
  isRowExpandedHack: (...args: unknown[]) => boolean | undefined;
  _processItemsHack: (...args: [RawItemData[], DataChange]) => ProcessedItem[];
  _processDataItemHack: (...args: [GeneratedItem, ItemProcessingOptions]) => ProcessedItem;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  getRowIndicesForExpand(key: RowKey): number[];
}

export interface MasterDetailRowsViewExtension {
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  renderMasterDetailCell(
    $row: dxElementWrapper,
    row: ViewRow,
    options: RowRenderOptions,
  ): dxElementWrapper;
}
