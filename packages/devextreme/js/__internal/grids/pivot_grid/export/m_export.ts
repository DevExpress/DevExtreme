import localizationNumber from '@js/common/core/localization/number';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getDefaultAlignment } from '@js/core/utils/position';
import { isDefined, isFunction } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import formatHelper from '@js/format_helper';
import type { PivotGridDataType } from '@js/ui/pivot_grid/data_source';
import { prepareItems } from '@ts/grids/grid_core/export';
import type { PivotGridField } from '@ts/grids/pivot_grid/types';

import type {
  DataProviderOptions,
  ExportPivotGrid,
  PivotGridExportCellData,
  PivotGridExportCellMerging,
  PivotGridExportItem,
  PivotGridExportMixin,
  PivotGridExportStyle,
  PivotGridPreparedExportItem,
} from './types';

const DEFAULT_DATA_TYPE = 'string';
const DEFAUL_COLUMN_WIDTH = 100;

class DataProvider {
  public _exportController: ExportPivotGrid;

  private _options!: DataProviderOptions;

  private _styles?: PivotGridExportStyle[];

  constructor(exportController: ExportPivotGrid) {
    this._exportController = exportController;
  }

  public ready(): DeferredObj<DataProviderOptions> {
    return when(this._createOptions()).done((options) => {
      const { items } = options;
      const headerSize = items[0][0].rowspan;
      const columns = items[headerSize - 1];

      each(columns, (_, column) => {
        column.width = DEFAUL_COLUMN_WIDTH;
      });

      options.columns = columns;
      this._options = options;
    });
  }

  private _createOptions(): DeferredObj<DataProviderOptions> {
    const exportController = this._exportController;
    const dataController = exportController._dataController;
    const options = Deferred<DataProviderOptions>();
    const areaOptions: Omit<DataProviderOptions, 'items'> = {
      rtlEnabled: exportController.option('rtlEnabled'),
      dataFields: exportController.getDataSource().getAreaFields('data'),
      rowsArea: exportController._rowsArea,
      columnsArea: exportController._columnsArea,
    };

    dataController.beginLoading();
    setTimeout(() => {
      const columnsInfo = extend(true, [], dataController.getColumnsInfo(true));
      const rowsInfoItems = extend(true, [], dataController.getRowsInfo(true));
      const cellsInfo = dataController.getCellsInfo(true);

      options.resolve({
        ...areaOptions,
        items: exportController._getAllItems(columnsInfo, rowsInfoItems, cellsInfo),
      });
      dataController.endLoading();
    });

    return options;
  }

  public getColumns(): PivotGridPreparedExportItem[] | undefined {
    return this._options.columns;
  }

  public getColumnsWidths(): number[] {
    const colsArea = this._options.columnsArea;
    const { rowsArea } = this._options;
    const { columns } = this._options;
    const useDefaultWidth = !hasWindow() || colsArea.option('scrolling.mode') === 'virtual' || colsArea.element().is(':hidden');
    return useDefaultWidth
      ? (columns ?? []).map(() => DEFAUL_COLUMN_WIDTH)
      : rowsArea.getColumnsWidth().concat(colsArea.getColumnsWidth());
  }

  public getRowsCount(): number {
    return this._options.items.length;
  }

  public getGroupLevel(): number {
    return 0;
  }

  public getCellMerging(rowIndex: number, cellIndex: number): PivotGridExportCellMerging {
    const { items } = this._options;
    const item = items[rowIndex]?.[cellIndex];

    return item ? {
      colspan: item.colspan - 1,
      rowspan: item.rowspan - 1,
    } : { colspan: 0, rowspan: 0 };
  }

  public getFrozenArea(): { x: number; y: number } {
    return { x: this.getRowAreaColCount(), y: this.getColumnAreaRowCount() };
  }

  public getCellType(rowIndex: number, cellIndex: number): PivotGridDataType {
    const style = this.getStyles()[this.getStyleId(rowIndex, cellIndex)];
    return style?.dataType || 'string';
  }

  public getCellData(
    rowIndex: number,
    cellIndex: number,
    isExcelJS: boolean,
  ): PivotGridExportCellData {
    const result: PivotGridExportCellData = {};
    const { items } = this._options;
    const item: PivotGridExportItem = items[rowIndex]?.[cellIndex] || {};

    if (isExcelJS) {
      result.cellSourceData = item;
      const areaName = this._tryGetAreaName(item, rowIndex, cellIndex);
      if (areaName) {
        result.cellSourceData.area = areaName;
      }
      result.cellSourceData.rowIndex = rowIndex;
      result.cellSourceData.columnIndex = cellIndex;
    }

    if (this.getCellType(rowIndex, cellIndex) === 'string') {
      result.value = item.text;
    } else {
      result.value = item.value;
    }

    if (result.cellSourceData?.isWhiteSpace) {
      result.value = '';
    }

    return result;
  }

  private _tryGetAreaName(
    item: PivotGridExportItem,
    rowIndex: number,
    cellIndex: number,
  ): PivotGridExportItem['area'] {
    if (this.isColumnAreaCell(rowIndex, cellIndex)) {
      return 'column';
    } if (this.isRowAreaCell(rowIndex, cellIndex)) {
      return 'row';
    } if (isDefined(item.dataIndex)) {
      return 'data';
    }

    return undefined;
  }

  public isRowAreaCell(rowIndex: number, cellIndex: number): boolean {
    return rowIndex >= this.getColumnAreaRowCount() && cellIndex < this.getRowAreaColCount();
  }

  public isColumnAreaCell(rowIndex: number, cellIndex: number): boolean {
    return cellIndex >= this.getRowAreaColCount() && rowIndex < this.getColumnAreaRowCount();
  }

  public getColumnAreaRowCount(): number {
    return this._options.items[0][0].rowspan;
  }

  public getRowAreaColCount(): number {
    return this._options.items[0][0].colspan;
  }

  public getHeaderStyles(): PivotGridExportStyle[] {
    return [
      { alignment: 'center', dataType: 'string' },
      { alignment: getDefaultAlignment(this._options.rtlEnabled), dataType: 'string' },
    ];
  }

  public getDataFieldStyles(): PivotGridExportStyle[] {
    const { dataFields } = this._options;
    const dataItemStyle: PivotGridExportStyle = { alignment: this._options.rtlEnabled ? 'left' : 'right' };
    const dataFieldStyles: PivotGridExportStyle[] = [];

    if (dataFields.length) {
      dataFields.forEach((dataField) => {
        dataFieldStyles.push({
          ...dataItemStyle,
          ...{ format: dataField.format, dataType: this.getCellDataType(dataField) },
        });
      });

      return dataFieldStyles;
    }

    return [dataItemStyle];
  }

  public getStyles(): PivotGridExportStyle[] {
    if (this._styles) {
      return this._styles;
    }

    this._styles = [...this.getHeaderStyles(), ...this.getDataFieldStyles()];

    return this._styles;
  }

  public getCellDataType(field: PivotGridField): PivotGridDataType {
    if (field?.customizeText) {
      return 'string';
    }

    if (field.dataType) {
      return field.dataType;
    }

    if (field.format) {
      if (localizationNumber.parse(formatHelper.format(1, field.format)) === 1) {
        return 'number';
      }
      if (formatHelper.format(new Date(), field.format)) {
        return 'date';
      }
    }

    return DEFAULT_DATA_TYPE;
  }

  public getStyleId(rowIndex: number, cellIndex: number): number {
    const { items } = this._options;
    const item: PivotGridExportItem = items[rowIndex]?.[cellIndex] || {};

    if ((cellIndex === 0 && rowIndex === 0) || this.isColumnAreaCell(rowIndex, cellIndex)) {
      return 0;
    } if (this.isRowAreaCell(rowIndex, cellIndex)) {
      return 1;
    }

    return this.getHeaderStyles().length + (item.dataIndex || 0);
  }
}

const ExportMixin: PivotGridExportMixin = {
  exportTo(this: ExportPivotGrid): void {
    const onExporting = this._createActionByOption('onExporting');
    const eventArgs = {
      rtlEnabled: this.option('rtlEnabled'),
      fileName: 'PivotGrid',
      cancel: false,
    };

    if (isFunction(onExporting)) {
      onExporting(eventArgs);
    }
  },

  _getLength(items: PivotGridExportItem[][]): number {
    const itemCount = items[0].length;
    let cellCount = 0;

    for (let i = 0; i < itemCount; i += 1) {
      cellCount += items[0][i].colspan || 1;
    }

    return cellCount;
  },

  _correctCellsInfoItemLengths(
    cellsInfo: PivotGridExportItem[][],
    expectedLength: number,
  ): PivotGridExportItem[][] {
    for (const cellsInfoItem of cellsInfo) {
      while (cellsInfoItem.length < expectedLength) {
        cellsInfoItem.push({});
      }
    }
    return cellsInfo;
  },

  _calculateCellInfoItemLength(columnsRow: PivotGridExportItem[]): number {
    let result = 0;
    for (const column of columnsRow) {
      result += isDefined(column.colspan) ? column.colspan : 1;
    }
    return result;
  },

  _getEmptyCell(): PivotGridExportItem {
    return {
      text: '',
      value: undefined,
      colspan: 1,
      rowspan: 1,
    };
  },

  _getAllItems(
    this: ExportPivotGrid,
    columnsInfo: PivotGridExportItem[][],
    rowsInfoItems: PivotGridExportItem[][],
    cellsInfo: PivotGridExportItem[][],
  ): PivotGridPreparedExportItem[][] {
    let correctedCellsInfo = cellsInfo;
    const rowsLength = this._getLength(rowsInfoItems);
    const headerRowsCount = columnsInfo.length;

    if (columnsInfo.length > 0
      && columnsInfo[0].length > 0
      && cellsInfo.length > 0
      && cellsInfo[0].length === 0) {
      const cellInfoItemLength = this._calculateCellInfoItemLength(columnsInfo[0]);
      if (cellInfoItemLength > 0) {
        correctedCellsInfo = this._correctCellsInfoItemLengths(cellsInfo, cellInfoItemLength);
      }
    }

    // NOTE (T1155137): If the data area is empty - fill in empty cells
    // for the correct layout of the export table
    if (correctedCellsInfo.length === 0) {
      const rowsCount = rowsInfoItems.length;
      const collapsedColumnCount = columnsInfo
        .map((headerRowWithColumns) => headerRowWithColumns.filter((row) => !row.expanded).length)
        .reduce((result, collapsedCount) => result + collapsedCount, 0);

      for (let rowIdx = 0; rowIdx < rowsCount; rowIdx += 1) {
        correctedCellsInfo[rowIdx] = [];

        for (let colIdx = 0; colIdx < collapsedColumnCount; colIdx += 1) {
          correctedCellsInfo[rowIdx][colIdx] = this._getEmptyCell();
        }
      }
    }

    const sourceItems = columnsInfo.concat(correctedCellsInfo);

    for (let rowIndex = 0; rowIndex < rowsInfoItems.length; rowIndex += 1) {
      for (let cellIndex = rowsInfoItems[rowIndex].length - 1; cellIndex >= 0; cellIndex -= 1) {
        if (!isDefined(sourceItems[rowIndex + headerRowsCount])) {
          sourceItems[rowIndex + headerRowsCount] = [];
        }

        sourceItems[rowIndex + headerRowsCount].splice(
          0,
          0,
          extend({}, rowsInfoItems[rowIndex][cellIndex]),
        );
      }
    }

    sourceItems[0].splice(0, 0, extend(
      {},
      this._getEmptyCell(),
      {
        // @ts-expect-error _options is the Options instance and has no rtlEnabled field
        alignment: getDefaultAlignment(this._options.rtlEnabled),
        colspan: rowsLength,
        rowspan: headerRowsCount,
      },
    ));

    return prepareItems(sourceItems, this._getEmptyCell());
  },

  getDataProvider(this: ExportPivotGrid): DataProvider {
    return new DataProvider(this);
  },
};

const PivotGridExport = {
  DEFAUL_COLUMN_WIDTH,
};

export default { ExportMixin, PivotGridExport, DataProvider };
export { DataProvider, ExportMixin, PivotGridExport };
