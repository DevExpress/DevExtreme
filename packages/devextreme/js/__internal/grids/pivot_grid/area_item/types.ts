import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as PivotGridProperties } from '@js/ui/pivot_grid';
import type { ScrollOffset } from '@ts/core/utils/scroll';
import type { DefaultActionArgs } from '@ts/core/widget/component';
import type DOMComponent from '@ts/core/widget/dom_component';

import type { HeaderItemType, PivotGridColumnInfo } from '../data_controller/types';

export type AreaName = 'column' | 'row' | 'data' | 'fields';

export interface AreaItemCell extends PivotGridColumnInfo {
  value?: unknown;
  rowType?: HeaderItemType;
  columnType?: HeaderItemType;
}

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

export interface AreaItemCellPosition {
  cellIndex: number;
  cellsCount: number;
  rowIndex: number;
  rowsCount: number;
  rtlEnabled: boolean | undefined;
}

export interface AreaItemStyleOptions extends AreaItemCellPosition {
  cellElement: undefined;
  cell: AreaItemCell;
  rowElement: undefined;
  classArray: string[];
  cssArray: string[];
}

export interface AreaItemCellContext extends AreaItemCellPosition {
  encodeHtml: boolean | undefined;
  isCellNavigationEnabled: boolean;
}

export interface AreaItemCellAriaIndexOptions {
  areaName: AreaName;
  rowIndex: number;
  columnIndex: number;
  columnIndexMap: Map<string, number> | null;
  columnIndexOffset: number;
  rowIndexOffset: number;
}

export interface AreaItemCellPreparedArgs {
  area: AreaName;
  rowIndex: number;
  columnIndex: number;
  cellElement: DxElement;
  cell: AreaItemCell;
}

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
