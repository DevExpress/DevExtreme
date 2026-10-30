import type { dxElementWrapper } from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { GroupingDataControllerExtension } from '@ts/grids/data_grid/grouping/types';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { ViewDataChange } from '@ts/grids/grid_core/views/types';
import type { VirtualScrollingDataControllerExtension } from '@ts/grids/grid_core/virtual_scrolling';

export type NavigationDirection = 'next' | 'previous' | 'nextInRow' | 'previousInRow';

export type NavigationKeyCode = NavigationDirection | 'upArrow' | 'downArrow';

export type NavigationElementType = 'cell' | 'row';

export type DirectionCode = 'prevRow' | 'nextRow' | 'nextInRow' | 'previousInRow';

export interface ScrollOffset {
  left?: number;
  top?: number;
}

export interface HorizontalBounds {
  left: number;
  right: number;
}

export interface KeyDownEvent {
  originalEvent: DxEvent<KeyboardEvent>;
  keyName: string;
  shift: boolean;
}

export type StartEditingEvent = KeyboardKeyDownEvent | DxEvent<KeyboardEvent>;

/** @architectureLeak data_grid/grouping: Enter expands rows with changeRowExpand() */
export type KeyboardNavigationDataController = DataController
  & Partial<VirtualScrollingDataControllerExtension>
  & GroupingDataControllerExtension;

export type RenderCompletedChange = ViewDataChange & {
  virtualColumnsScrolling?: boolean;
  event?: DxEvent;
};

export interface FocusChangingArgs {
  cancel?: boolean;
  isHighlighted?: boolean;
  prevRowIndex?: number;
  newColumnIndex?: number;
  newRowIndex?: number;
  resetFocusedRow?: boolean;
  rowIndexChanged?: boolean;
  $newCellElement?: dxElementWrapper;
}

export type FocusChangingResult = FocusChangingArgs & { $newCellElement: dxElementWrapper };

export interface FocusedCellChangingArgs extends FocusChangingArgs {
  cellElement: dxElementWrapper;
  prevColumnIndex?: number;
  newColumnIndex: number;
  newRowIndex: number;
  rows: ProcessedItem[];
  columns: Column[];
  event?: Event;
  isHighlighted: boolean;
  cancel: boolean;
}

export interface FocusedRowChangingArgs extends FocusChangingArgs {
  rowElement: dxElementWrapper;
  newRowIndex: number;
  event?: Event;
  rows: ProcessedItem[];
  cancel: boolean;
}
