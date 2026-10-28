import type { dxElementWrapper } from '@js/core/renderer';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ViewCellOptions } from '@ts/grids/grid_core/views/types';

export interface SearchDataControllerExtension {
  searchByText: (text: string | undefined) => void;
}

export type SearchDataController = DataController & SearchDataControllerExtension;

export interface SearchCellOptions extends ViewCellOptions {
  /** @architectureLeak editing: search skips the cells of the edit form */
  isOnForm?: boolean;
}

export type SearchHighlightParams = [
  cellElement: dxElementWrapper,
  isEquals: boolean,
  column: Column,
];
