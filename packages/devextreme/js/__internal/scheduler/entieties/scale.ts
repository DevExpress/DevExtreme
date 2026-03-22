import type { dxElementWrapper } from '@js/core/renderer';

import type { CellsInfo, Rect } from '../appointments/resizing/types';
import { isDateAndTimeView } from '../r1/utils/index';
import type { ViewDataProviderType } from '../types';

export interface DOMElementsMetaData {
  dateTableCellsMeta: Rect[][];
  allDayPanelCellsMeta: Rect[];
}

export interface CellDateInfo {
  startDate: Date;
  endDate: Date;
  index: number;
}

export interface GroupBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface CellCoordinates {
  left: number;
  top: number;
}

export interface GroupCoordinates {
  groupIndex: number;
}

interface Workspace {
  positionHelper: { getResizableStep: () => number };
  getDOMElementsMetaData: () => DOMElementsMetaData;
  viewDataProvider: ViewDataProviderType;
  isVerticalGroupedWorkSpace: () => boolean;
  type: string;
  getCellWidth: () => number;
  getCellHeight: () => number;
  option: (name: string) => unknown;
  _getGroupCount: () => number;
  needRecalculateResizableArea: () => boolean;
  getGroupBounds: (coordinates: GroupCoordinates) => GroupBounds;
  getAgendaVerticalStepHeight: () => number;
  supportAllDayRow: () => boolean;
  isGroupedByDate: () => boolean;
  getDroppableCell: () => dxElementWrapper;
  getCellByCoordinates: (coordinates: CellCoordinates, isAllDay: boolean) => dxElementWrapper;
  removeDroppableCellClass: () => void;
}

export interface ScaleGeometry {
  getCellWidth: () => number;
  getCellHeight: () => number;
  getResizableStep: () => number;
  getCellGeometry: (
    rowIndex: number,
    columnIndex: number,
    isAllDay: boolean,
  ) => CellsInfo | undefined;
  getDOMElementsMetaData: () => DOMElementsMetaData | undefined;
}

export interface ScaleData {
  readonly viewDataProvider: ViewDataProviderType | undefined;
  getCellDateInfo: (
    rowIndex: number,
    columnIndex: number,
    isAllDay: boolean,
    rtlEnabled: boolean,
  ) => CellDateInfo | undefined;
  cellDuration: number;
  startDayHour: number;
  endDayHour: number;
  groupCount: number;
  agendaVerticalStepHeight: number;
  supportAllDayRow: boolean;
  isGroupedByDate: boolean;
  isVerticalGroupedWorkSpace: () => boolean;
  isDateAndTimeView: () => boolean;
}

export interface ScaleDragDrop {
  getDroppableCell: () => dxElementWrapper | undefined;
  getCellByCoordinates: (
    coordinates: CellCoordinates, isAllDay: boolean,
  ) => dxElementWrapper | undefined;
  removeDroppableCellClass: () => void;
}

export interface ScaleInteraction {
  needRecalculateResizableArea: () => boolean;
  getGroupBounds: (coordinates: GroupCoordinates) => GroupBounds | undefined;
}

export type Scale = ScaleGeometry & ScaleData & ScaleDragDrop & ScaleInteraction;

export class WorkspaceScale implements Scale {
  private readonly getWorkspace: () => Workspace | undefined;

  constructor(getWorkspace: () => Workspace | undefined) {
    this.getWorkspace = getWorkspace;
  }

  get viewDataProvider(): ViewDataProviderType | undefined {
    return this.getWorkspace()?.viewDataProvider;
  }

  getResizableStep(): number {
    const workspace = this.getWorkspace();
    return workspace ? workspace.positionHelper.getResizableStep() : 0;
  }

  getDOMElementsMetaData(): DOMElementsMetaData | undefined {
    return this.getWorkspace()?.getDOMElementsMetaData();
  }

  getCellDateInfo(
    rowIndex: number,
    columnIndex: number,
    isAllDay: boolean,
    rtlEnabled: boolean,
  ): CellDateInfo | undefined {
    const workspace = this.getWorkspace();
    if (!workspace) return undefined;
    const { viewDataProvider } = workspace;
    const cellData = viewDataProvider.getCellData(rowIndex, columnIndex, isAllDay, rtlEnabled);
    return {
      startDate: cellData.startDate,
      endDate: cellData.endDate,
      index: cellData.index,
    };
  }

  getCellGeometry(
    rowIndex: number,
    columnIndex: number,
    isAllDay: boolean,
  ): CellsInfo | undefined {
    const workspace = this.getWorkspace();
    if (!workspace) return undefined;
    const meta = workspace.getDOMElementsMetaData();
    const isVertical = workspace.isVerticalGroupedWorkSpace();
    const metaTable = isAllDay && !isVertical
      ? [meta.allDayPanelCellsMeta]
      : meta.dateTableCellsMeta;
    const row = metaTable[rowIndex];
    if (!row?.[columnIndex]) return undefined;
    return {
      cellWidth: row[columnIndex].width,
      cellHeight: row[columnIndex].height,
      cellCountInRow: row.length,
    };
  }

  getCellWidth(): number {
    return this.getWorkspace()?.getCellWidth() ?? 0;
  }

  getCellHeight(): number {
    return this.getWorkspace()?.getCellHeight() ?? 0;
  }

  get cellDuration(): number {
    return (this.getWorkspace()?.option('cellDuration') as number) ?? 30;
  }

  get startDayHour(): number {
    return (this.getWorkspace()?.option('startDayHour') as number) ?? 0;
  }

  get endDayHour(): number {
    return (this.getWorkspace()?.option('endDayHour') as number) ?? 24;
  }

  get groupCount(): number {
    return this.getWorkspace()?._getGroupCount() ?? 0;
  }

  needRecalculateResizableArea(): boolean {
    return this.getWorkspace()?.needRecalculateResizableArea() ?? false;
  }

  getGroupBounds(coordinates: GroupCoordinates): GroupBounds | undefined {
    return this.getWorkspace()?.getGroupBounds(coordinates);
  }

  get agendaVerticalStepHeight(): number {
    return this.getWorkspace()?.getAgendaVerticalStepHeight() ?? 0;
  }

  get supportAllDayRow(): boolean {
    return this.getWorkspace()?.supportAllDayRow() ?? false;
  }

  get isGroupedByDate(): boolean {
    return this.getWorkspace()?.isGroupedByDate() ?? false;
  }

  getDroppableCell(): dxElementWrapper | undefined {
    return this.getWorkspace()?.getDroppableCell();
  }

  getCellByCoordinates(
    coordinates: CellCoordinates,
    isAllDay: boolean,
  ): dxElementWrapper | undefined {
    return this.getWorkspace()?.getCellByCoordinates(coordinates, isAllDay);
  }

  removeDroppableCellClass(): void {
    this.getWorkspace()?.removeDroppableCellClass();
  }

  isVerticalGroupedWorkSpace(): boolean {
    return this.getWorkspace()?.isVerticalGroupedWorkSpace() ?? false;
  }

  isDateAndTimeView(): boolean {
    const workspace = this.getWorkspace();
    if (!workspace) return false;
    return isDateAndTimeView(workspace.type as Parameters<typeof isDateAndTimeView>[0]);
  }
}
