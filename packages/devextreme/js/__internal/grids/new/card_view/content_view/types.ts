import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';

export interface SelectCardOptions {
  control?: boolean;
  shift?: boolean;
  needToUpdateCheckboxes?: boolean;
}

export interface CardHoldEvent {
  event?: MouseEvent;
  row: DataRow;
}
