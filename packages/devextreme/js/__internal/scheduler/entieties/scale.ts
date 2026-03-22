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

interface Workspace {
  positionHelper: {
    getResizableStep: () => number;
  };
  getDOMElementsMetaData: () => DOMElementsMetaData;
  viewDataProvider: ViewDataProviderType;
  isVerticalGroupedWorkSpace: () => boolean;
  type: string;
}

export interface Scale {
  readonly viewDataProvider: ViewDataProviderType | undefined;
  getResizableStep: () => number;
  getDOMElementsMetaData: () => DOMElementsMetaData | undefined;
  getCellDateInfo: (
    rowIndex: number,
    columnIndex: number,
    isAllDay: boolean,
    rtlEnabled: boolean,
  ) => CellDateInfo | undefined;
  getCellGeometry: (
    rowIndex: number,
    columnIndex: number,
    isAllDay: boolean,
  ) => CellsInfo | undefined;
  isVerticalGroupedWorkSpace: () => boolean;
  isDateAndTimeView: () => boolean;
}

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
    const cellData = workspace.viewDataProvider.getCellData(
      rowIndex,
      columnIndex,
      isAllDay,
      rtlEnabled,
    );
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

  isVerticalGroupedWorkSpace(): boolean {
    return this.getWorkspace()?.isVerticalGroupedWorkSpace() ?? false;
  }

  isDateAndTimeView(): boolean {
    const workspace = this.getWorkspace();
    if (!workspace) return false;
    return isDateAndTimeView(workspace.type as Parameters<typeof isDateAndTimeView>[0]);
  }
}
