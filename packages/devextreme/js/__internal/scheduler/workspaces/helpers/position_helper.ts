/* eslint-disable max-classes-per-file */

import type { CountGenerationConfig, DOMMetaData } from '../../types';
import type ViewDataProvider from '../view_model/m_view_data_provider';

export interface PositionHelperOptions {
  viewDataProvider: ViewDataProvider;
  isVerticalGrouping: boolean;
  isGroupedByDate: boolean;
  rtlEnabled: boolean;
  groupCount: number;
  getDOMMetaDataCallback: () => DOMMetaData;
  isVirtualScrolling: boolean;
}

interface AllDayPanelOffsetOptions {
  groupIndex: number;
  supportAllDayRow: boolean;
  showAllDayPanel: boolean;
}

interface GroupTopOptions {
  groupIndex: number;
  showAllDayPanel: boolean;
  isGroupedAllDayPanel: boolean;
}

export interface VerticalMaxOptions
  extends AllDayPanelOffsetOptions, GroupTopOptions {
  isVirtualScrolling: boolean;
  isVerticalGrouping?: boolean;
}

export interface GroupWidthOptions extends CountGenerationConfig {
  isVirtualScrolling: boolean;
  rtlEnabled: boolean;
  DOMMetaData: DOMMetaData;
}

const getCellSize = (DOMMetaData: DOMMetaData): { width: number; height: number } => {
  const { dateTableCellsMeta } = DOMMetaData;
  const { length } = dateTableCellsMeta;

  if (!length) {
    return {
      width: 0,
      height: 0,
    };
  }

  const cellIndex = length > 1 ? 1 : 0;
  const cellSize = dateTableCellsMeta[cellIndex][0];

  return {
    width: cellSize.width,
    height: cellSize.height,
  };
};

const getMaxAllowedHorizontalPosition = (
  groupIndex: number,
  viewDataProvider: ViewDataProvider,
  rtlEnabled: boolean,
  DOMMetaData: DOMMetaData,
): number => {
  const { dateTableCellsMeta } = DOMMetaData;
  const firstRow = dateTableCellsMeta[0];

  if (!firstRow) return 0;

  const { columnIndex } = viewDataProvider.getLastGroupCellPosition(groupIndex);
  const cellPosition = firstRow[columnIndex];

  if (!cellPosition) return 0;

  return !rtlEnabled
    ? cellPosition.left + cellPosition.width
    : cellPosition.left;
};

export const getCellHeight = (DOMMetaData: DOMMetaData): number => getCellSize(DOMMetaData).height;

export const getCellWidth = (DOMMetaData: DOMMetaData): number => getCellSize(DOMMetaData).width;

export const getAllDayHeight = (
  showAllDayPanel: boolean,
  isVerticalGrouping: boolean,
  DOMMetaData: DOMMetaData,
): number => {
  if (!showAllDayPanel) {
    return 0;
  }

  if (isVerticalGrouping) {
    const { dateTableCellsMeta } = DOMMetaData;
    const { length } = dateTableCellsMeta;

    return length
      ? dateTableCellsMeta[0][0].height
      : 0;
  }

  const { allDayPanelCellsMeta } = DOMMetaData;

  return allDayPanelCellsMeta?.length
    ? allDayPanelCellsMeta[0].height
    : 0;
};

export const getMaxAllowedPosition = (
  groupIndex: number,
  viewDataProvider: ViewDataProvider,
  rtlEnabled: boolean,
  DOMMetaData: DOMMetaData,
): number => {
  const validGroupIndex = groupIndex || 0;

  return getMaxAllowedHorizontalPosition(
    validGroupIndex,
    viewDataProvider,
    rtlEnabled,
    DOMMetaData,
  );
};

export const getGroupWidth = (
  groupIndex: number,
  viewDataProvider: ViewDataProvider,
  options: GroupWidthOptions,
): number => {
  const {
    isVirtualScrolling,
    DOMMetaData,
  } = options;

  const cellWidth = getCellWidth(DOMMetaData);
  let result = viewDataProvider.getCellCount(options) * cellWidth;
  if (isVirtualScrolling) {
    const groupedData = viewDataProvider.groupedDataMap.dateTableGroupedMap;
    const groupLength = groupedData[groupIndex][0].length;

    result = groupLength * cellWidth;
  }

  return result;
};

export class PositionHelper {
  groupStrategy: GroupStrategyBase;

  get viewDataProvider(): ViewDataProvider { return this.options.viewDataProvider; }

  get rtlEnabled(): boolean { return this.options.rtlEnabled; }

  get isGroupedByDate(): boolean { return this.options.isGroupedByDate; }

  get groupCount(): number { return this.options.groupCount; }

  get DOMMetaData(): DOMMetaData { return this.options.getDOMMetaDataCallback(); }

  constructor(public options: PositionHelperOptions) {
    this.groupStrategy = this.options.isVerticalGrouping
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      ? new GroupStrategyBase(this.options)
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      : new GroupStrategyHorizontal(this.options);
  }

  getHorizontalMax(groupIndex: number): number {
    const getMaxPosition = (idx: number): number => getMaxAllowedPosition(
      idx,
      this.viewDataProvider,
      this.rtlEnabled,
      this.DOMMetaData,
    );

    if (this.isGroupedByDate) {
      const viewPortGroupCount = this.viewDataProvider.getViewPortGroupCount();
      return Math.max(
        getMaxPosition(groupIndex),
        getMaxPosition(viewPortGroupCount - 1),
      );
    }

    return getMaxPosition(groupIndex);
  }

  getResizableStep(): number {
    const cellWidth = getCellWidth(this.DOMMetaData);

    if (this.isGroupedByDate) {
      return this.groupCount * cellWidth;
    }

    return cellWidth;
  }

  getVerticalMax(options: VerticalMaxOptions): number {
    return this.groupStrategy.getVerticalMax(options);
  }

  getOffsetByAllDayPanel(options: AllDayPanelOffsetOptions): number {
    return this.groupStrategy.getOffsetByAllDayPanel(options);
  }

  getGroupTop(options: GroupTopOptions): number {
    return this.groupStrategy.getGroupTop(options);
  }
}

class GroupStrategyBase {
  constructor(public options: PositionHelperOptions) {
  }

  get viewDataProvider(): ViewDataProvider { return this.options.viewDataProvider; }

  get isGroupedByDate(): boolean { return this.options.isGroupedByDate; }

  get rtlEnabled(): boolean { return this.options.rtlEnabled; }

  get groupCount(): number { return this.options.groupCount; }

  get DOMMetaData(): DOMMetaData { return this.options.getDOMMetaDataCallback(); }

  getOffsetByAllDayPanel({
    groupIndex,
    supportAllDayRow,
    showAllDayPanel,
  }: AllDayPanelOffsetOptions): number {
    let result = 0;

    if (supportAllDayRow && showAllDayPanel) {
      const allDayPanelHeight = getAllDayHeight(
        showAllDayPanel,
        true,
        this.DOMMetaData,
      );
      result = allDayPanelHeight * (groupIndex + 1);
    }

    return result;
  }

  getVerticalMax(options: VerticalMaxOptions): number {
    let maxAllowedPosition = this.getMaxAllowedVerticalPosition(options);

    maxAllowedPosition += this.getOffsetByAllDayPanel(options);

    return maxAllowedPosition;
  }

  getGroupTop({
    groupIndex,
    showAllDayPanel,
    isGroupedAllDayPanel,
  }: GroupTopOptions): number {
    const rowCount = this.viewDataProvider.getRowCountInGroup(groupIndex);
    const maxVerticalPosition = this.getMaxAllowedVerticalPosition({
      groupIndex,
      showAllDayPanel,
      isGroupedAllDayPanel,
    });

    return maxVerticalPosition - getCellHeight(this.DOMMetaData) * rowCount;
  }

  protected getAllDayHeight(showAllDayPanel: boolean): number {
    return getAllDayHeight(showAllDayPanel, true, this.DOMMetaData);
  }

  protected getMaxAllowedVerticalPosition({
    groupIndex,
    showAllDayPanel,
    isGroupedAllDayPanel,
  }: GroupTopOptions): number {
    const { rowIndex } = this.viewDataProvider.getLastGroupCellPosition(groupIndex);
    const { dateTableCellsMeta } = this.DOMMetaData;
    const lastGroupRow = dateTableCellsMeta[rowIndex];

    if (!lastGroupRow) return 0;

    let result = lastGroupRow[0].top + lastGroupRow[0].height;

    // Should decrease allDayPanel amount due to the dual calculation corrections.
    if (isGroupedAllDayPanel) {
      result -= (groupIndex + 1) * this.getAllDayHeight(showAllDayPanel);
    }

    return result;
  }
}

class GroupStrategyHorizontal extends GroupStrategyBase {
  getOffsetByAllDayPanel(): number {
    return 0;
  }

  getVerticalMax(options: VerticalMaxOptions): number {
    const {
      isVirtualScrolling,
      groupIndex,
    } = options;

    const correctedGroupIndex = isVirtualScrolling
      ? groupIndex
      : 0;

    return this.getMaxAllowedVerticalPosition({
      ...options,
      groupIndex: correctedGroupIndex,
    });
  }

  getGroupTop(): number {
    return 0;
  }

  protected getAllDayHeight(showAllDayPanel: boolean): number {
    return getAllDayHeight(showAllDayPanel, false, this.DOMMetaData);
  }
}
