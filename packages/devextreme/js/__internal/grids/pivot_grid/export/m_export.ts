import localizationNumber from '@js/common/core/localization/number';
import Class from '@js/core/class';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getDefaultAlignment } from '@js/core/utils/position';
import { isDefined, isFunction } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import formatHelper from '@js/format_helper';
import { prepareItems } from '@ts/grids/grid_core/m_export';

const DEFAULT_DATA_TYPE = 'string';
const DEFAUL_COLUMN_WIDTH = 100;

const ExportController = {
  exportTo() {
    const onExporting = this._createActionByOption('onExporting');
    const eventArgs = {
      rtlEnabled: this.option('rtlEnabled'),
      fileName: 'PivotGrid',
      cancel: false,
    };

    isFunction(onExporting) && onExporting(eventArgs);
  },

  _getLength(items) {
    let i;
    const itemCount = items[0].length;
    let cellCount = 0;

    for (i = 0; i < itemCount; i += 1) {
      cellCount += items[0][i].colspan || 1;
    }

    return cellCount;
  },

  _correctCellsInfoItemLengths(cellsInfo, expectedLength) {
    for (let i = 0; i < cellsInfo.length; i += 1) {
      while (cellsInfo[i].length < expectedLength) {
        cellsInfo[i].push({});
      }
    }
    return cellsInfo;
  },

  _calculateCellInfoItemLength(columnsRow) {
    let result = 0;
    for (let columnIndex = 0; columnIndex < columnsRow.length; columnIndex += 1) {
      result += isDefined(columnsRow[columnIndex].colspan) ? columnsRow[columnIndex].colspan : 1;
    }
    return result;
  },

  _getEmptyCell() {
    return {
      text: '',
      value: undefined,
      colspan: 1,
      rowspan: 1,
    };
  },

  _getAllItems(columnsInfo: any[][], rowsInfoItems: any[], cellsInfo: any[]) {
    let cellIndex;
    let rowIndex;
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

    for (rowIndex = 0; rowIndex < rowsInfoItems.length; rowIndex += 1) {
      for (cellIndex = rowsInfoItems[rowIndex].length - 1; cellIndex >= 0; cellIndex -= 1) {
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
        alignment: getDefaultAlignment(this._options.rtlEnabled),
        colspan: rowsLength,
        rowspan: headerRowsCount,
      },
    ));

    return prepareItems(sourceItems, this._getEmptyCell());
  },

  getDataProvider() {
    return new DataProvider(this);
  },
};

const DataProvider = Class.inherit({
  ctor(exportController) {
    this._exportController = exportController;
  },

  ready() {
    this._initOptions();
    const options = this._options;

    return when(options.items).done((items) => {
      const headerSize = items[0][0].rowspan;
      const columns = items[headerSize - 1];

      each(columns, (_, column) => {
        column.width = DEFAUL_COLUMN_WIDTH;
      });

      options.columns = columns;
      options.items = items;
    });
  },

  _initOptions() {
    const exportController = this._exportController;
    const dataController = exportController._dataController;
    // @ts-expect-error
    const items = new Deferred();

    dataController.beginLoading();
    setTimeout(() => {
      const columnsInfo = extend(true, [], dataController.getColumnsInfo(true));
      const rowsInfoItems = extend(true, [], dataController.getRowsInfo(true));
      const cellsInfo = dataController.getCellsInfo(true);

      items.resolve(exportController._getAllItems(columnsInfo, rowsInfoItems, cellsInfo));
      dataController.endLoading();
    });

    this._options = {
      items,
      rtlEnabled: exportController.option('rtlEnabled'),
      dataFields: exportController.getDataSource().getAreaFields('data'),
      rowsArea: exportController._rowsArea,
      columnsArea: exportController._columnsArea,
    };
  },

  getColumns() {
    return this._options.columns;
  },

  getColumnsWidths() {
    const colsArea = this._options.columnsArea;
    const { rowsArea } = this._options;
    const { columns } = this._options;
    const useDefaultWidth = !hasWindow() || colsArea.option('scrolling.mode') === 'virtual' || colsArea.element().is(':hidden');
    return useDefaultWidth
      ? columns.map(() => DEFAUL_COLUMN_WIDTH)
      : rowsArea.getColumnsWidth().concat(colsArea.getColumnsWidth());
  },

  getRowsCount() {
    return this._options.items.length;
  },

  getGroupLevel() {
    return 0;
  },

  getCellMerging(rowIndex, cellIndex) {
    const { items } = this._options;
    const item = items[rowIndex] && items[rowIndex][cellIndex];

    return item ? {
      colspan: item.colspan - 1,
      rowspan: item.rowspan - 1,
    } : { colspan: 0, rowspan: 0 };
  },

  getFrozenArea() {
    return { x: this.getRowAreaColCount(), y: this.getColumnAreaRowCount() };
  },

  getCellType(rowIndex, cellIndex) {
    const style = this.getStyles()[this.getStyleId(rowIndex, cellIndex)];
    return style && style.dataType || 'string';
  },

  getCellData(rowIndex, cellIndex, isExcelJS) {
    const result: any = {};
    const { items } = this._options;
    const item = items[rowIndex] && items[rowIndex][cellIndex] || {};

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

    if (result.cellSourceData && result.cellSourceData.isWhiteSpace) {
      result.value = '';
    }

    return result;
  },

  _tryGetAreaName(item, rowIndex, cellIndex) {
    if (this.isColumnAreaCell(rowIndex, cellIndex)) {
      return 'column';
    } if (this.isRowAreaCell(rowIndex, cellIndex)) {
      return 'row';
    } if (isDefined(item.dataIndex)) {
      return 'data';
    }

    return undefined;
  },

  isRowAreaCell(rowIndex, cellIndex) {
    return rowIndex >= this.getColumnAreaRowCount() && cellIndex < this.getRowAreaColCount();
  },

  isColumnAreaCell(rowIndex, cellIndex) {
    return cellIndex >= this.getRowAreaColCount() && rowIndex < this.getColumnAreaRowCount();
  },

  getColumnAreaRowCount() {
    return this._options.items[0][0].rowspan;
  },

  getRowAreaColCount() {
    return this._options.items[0][0].colspan;
  },

  getHeaderStyles() {
    return [
      { alignment: 'center', dataType: 'string' },
      { alignment: getDefaultAlignment(this._options.rtlEnabled), dataType: 'string' },
    ];
  },

  getDataFieldStyles() {
    const { dataFields } = this._options;
    const dataItemStyle = { alignment: this._options.rtlEnabled ? 'left' : 'right' };
    const dataFieldStyles: any = [];

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
  },

  getStyles() {
    if (this._styles) {
      return this._styles;
    }

    this._styles = [...this.getHeaderStyles(), ...this.getDataFieldStyles()];

    return this._styles;
  },

  getCellDataType(field) {
    if (field && field.customizeText) {
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
  },

  getStyleId(rowIndex, cellIndex) {
    const { items } = this._options;
    const item = items[rowIndex] && items[rowIndex][cellIndex] || {};

    if ((cellIndex === 0 && rowIndex === 0) || this.isColumnAreaCell(rowIndex, cellIndex)) {
      return 0;
    } if (this.isRowAreaCell(rowIndex, cellIndex)) {
      return 1;
    }

    return this.getHeaderStyles().length + (item.dataIndex || 0);
  },
});

const PivotGridExport = {
  DEFAUL_COLUMN_WIDTH,
};

export default { ExportController, PivotGridExport, DataProvider };
export { DataProvider, ExportController, PivotGridExport };
