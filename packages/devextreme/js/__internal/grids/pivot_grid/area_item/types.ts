import type { dxElementWrapper } from '@js/core/renderer';
import type { CellPreparedEvent, Properties as PivotGridProperties } from '@js/ui/pivot_grid';
import type { ScrollOffset } from '@ts/core/utils/scroll';
import type { DefaultActionArgs } from '@ts/core/widget/component';
import type DOMComponent from '@ts/core/widget/dom_component';

import type { PivotGridCell } from '../types';

export type AreaName = 'column' | 'row' | 'data' | 'fields';

export type AreaItemOption<TName extends string> = TName extends keyof PivotGridProperties
  ? PivotGridProperties[TName]
  : unknown;

export interface AreaItemComponent {
  option: <TName extends string>(optionName: TName) => AreaItemOption<TName>;
  $element: () => dxElementWrapper;
  _createComponent: typeof DOMComponent.prototype._createComponent;
  _dataController?: {
    getColumnIndexOffset: () => number;
    getRowIndexOffset: () => number;
  };
  _eventsStrategy: {
    hasEvent: (eventName: string) => boolean;
  };
  _defaultActionArgs: () => DefaultActionArgs<unknown>;
  _trigger: (eventName: string, eventArg: unknown) => void;
}

export interface AreaItemStyleOptions {
  cellElement: undefined;
  cell: PivotGridCell;
  cellsCount: number;
  cellIndex: number;
  rowElement: undefined;
  rowIndex: number;
  rowsCount: number;
  rtlEnabled: boolean | undefined;
  classArray: string[];
  cssArray: string[];
}

export interface AreaItemCellAriaIndexOptions {
  areaName: AreaName;
  rowIndex: number;
  columnIndex: number;
  columnIndexMap: Map<string, number> | null;
  columnIndexOffset: number;
  rowIndexOffset: number;
}

export type AreaItemCellPreparedArgs = Pick<
  CellPreparedEvent,
  'area' | 'rowIndex' | 'columnIndex' | 'cellElement' | 'cell'
>;

export interface AreaItemVirtualContentParams {
  top?: number;
  left?: number;
  width: number;
  height: number;
}

export interface AreaItemTableCss {
  top?: number;
  left?: number;
  right?: number;
}

export interface AreaItemScrollEvent {
  scrollOffset: ScrollOffset;
}
