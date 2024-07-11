"use strict";

exports.Export = void 0;
var _type = require("../../core/utils/type");
var _export_format = require("./export_format");
var _extend = require("../../core/utils/extend");
var _export_load_panel = require("../common/export_load_panel");
var _window = require("../../core/utils/window");
// docs.microsoft.com/en-us/office/troubleshoot/excel/determine-column-widths - "Description of how column widths are determined in Excel"
const MAX_DIGIT_WIDTH_IN_PIXELS = 7; // Calibri font with 11pt size

// support.office.com/en-us/article/change-the-column-width-and-row-height-72f5e3cc-994d-43e8-ae58-9774a0905f46 - "Column.Max - 255"
// support.office.com/en-us/article/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3 - "Column width limit - 255 characters"
const MAX_EXCEL_COLUMN_WIDTH = 255;
const Export = exports.Export = {
  getFullOptions(options) {
    const fullOptions = (0, _extend.extend)({}, options);
    if (!((0, _type.isDefined)(fullOptions.worksheet) && (0, _type.isObject)(fullOptions.worksheet))) {
      throw Error('The "worksheet" field must contain an object.');
    }
    if (!(0, _type.isDefined)(fullOptions.topLeftCell)) {
      fullOptions.topLeftCell = {
        row: 1,
        column: 1
      };
    } else if ((0, _type.isString)(fullOptions.topLeftCell)) {
      const {
        row,
        col
      } = fullOptions.worksheet.getCell(fullOptions.topLeftCell);
      fullOptions.topLeftCell = {
        row,
        column: col
      };
    }
    if (!(0, _type.isDefined)(fullOptions.keepColumnWidths)) {
      fullOptions.keepColumnWidths = true;
    }
    if (!(0, _type.isDefined)(fullOptions.loadPanel)) {
      fullOptions.loadPanel = {};
    }
    if (!(0, _type.isDefined)(fullOptions.loadPanel.enabled)) {
      fullOptions.loadPanel.enabled = true;
    }
    if (!(0, _type.isDefined)(fullOptions.encodeExecutableContent)) {
      fullOptions.encodeExecutableContent = false;
    }
    return fullOptions;
  },
  convertDateForExcelJS(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  },
  setNumberFormat(excelCell, numberFormat) {
    excelCell.numFmt = numberFormat;
  },
  getCellStyles(dataProvider) {
    const styles = dataProvider.getStyles();
    styles.forEach(style => {
      let numberFormat = this.tryConvertToExcelNumberFormat(style.format, style.dataType);
      if ((0, _type.isDefined)(numberFormat)) {
        numberFormat = numberFormat.replace(/&quot;/g, '"');
      }
      style.numberFormat = numberFormat;
    });
    return styles;
  },
  tryConvertToExcelNumberFormat(format, dataType) {
    const newFormat = _export_format.ExportFormat.formatObjectConverter(format, dataType);
    const currency = newFormat.currency;
    format = newFormat.format;
    dataType = newFormat.dataType;
    return _export_format.ExportFormat.convertFormat(format, newFormat.precision, dataType, currency);
  },
  setAlignment(excelCell, wrapText, horizontalAlignment) {
    excelCell.alignment = excelCell.alignment ?? {};
    if ((0, _type.isDefined)(wrapText)) {
      excelCell.alignment.wrapText = wrapText;
    }
    if ((0, _type.isDefined)(horizontalAlignment)) {
      excelCell.alignment.horizontal = horizontalAlignment;
    }
    excelCell.alignment.vertical = 'top';
  },
  setColumnsWidth(worksheet, widths, startColumnIndex) {
    if (!(0, _type.isDefined)(widths)) {
      return;
    }
    for (let i = 0; i < widths.length; i++) {
      const columnWidth = widths[i];
      if (typeof columnWidth === 'number' && isFinite(columnWidth)) {
        worksheet.getColumn(startColumnIndex + i).width = Math.min(MAX_EXCEL_COLUMN_WIDTH, Math.floor(columnWidth / MAX_DIGIT_WIDTH_IN_PIXELS * 100) / 100);
      }
    }
  },
  export(options, Helpers, getLoadPanelTargetElement, getLoadPanelContainer) {
    var _component$_getIntern;
    const {
      component,
      worksheet,
      topLeftCell,
      keepColumnWidths,
      selectedRowsOnly,
      loadPanel,
      encodeExecutableContent
    } = options;
    const dataProvider = component.getDataProvider(selectedRowsOnly);
    const internalComponent = ((_component$_getIntern = component._getInternalInstance) === null || _component$_getIntern === void 0 ? void 0 : _component$_getIntern.call(component)) || component;
    const initialLoadPanelEnabledOption = internalComponent.option('loadPanel') && internalComponent.option('loadPanel').enabled;
    if (initialLoadPanelEnabledOption) {
      component.option('loadPanel.enabled', false);
    }
    let exportLoadPanel;
    if (loadPanel.enabled && (0, _window.hasWindow)()) {
      const $targetElement = getLoadPanelTargetElement(component);
      const $container = getLoadPanelContainer(component);
      exportLoadPanel = new _export_load_panel.ExportLoadPanel(component, $targetElement, $container, loadPanel);
      exportLoadPanel.show();
    }
    const wrapText = !!component.option('wordWrapEnabled');
    worksheet.properties.outlineProperties = {
      summaryBelow: false,
      summaryRight: false
    };
    const cellRange = {
      from: {
        row: topLeftCell.row,
        column: topLeftCell.column
      },
      to: {
        row: topLeftCell.row,
        column: topLeftCell.column
      }
    };
    return new Promise(resolve => {
      dataProvider.ready().done(() => {
        const columns = dataProvider.getColumns();
        const dataRowsCount = dataProvider.getRowsCount();
        const helpers = new Helpers(component, dataProvider, worksheet, options);
        if (keepColumnWidths) {
          this.setColumnsWidth(worksheet, dataProvider.getColumnsWidths(), cellRange.from.column);
        }
        helpers._exportAllFieldHeaders(columns, this.setAlignment);
        const fieldHeaderRowsCount = helpers._getFieldHeaderRowsCount();
        cellRange.to.row = cellRange.from.row + fieldHeaderRowsCount;
        const styles = this.getCellStyles(dataProvider);
        for (let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
          const currentRowIndex = cellRange.from.row + fieldHeaderRowsCount + rowIndex;
          const row = worksheet.getRow(currentRowIndex);
          let startColumnIndex = 0;
          if (helpers._isRowFieldHeadersRow(rowIndex)) {
            startColumnIndex = dataProvider.getRowAreaColCount();
            helpers._exportFieldHeaders('row', currentRowIndex, 0, startColumnIndex, this.setAlignment);
          }
          helpers._trySetOutlineLevel(row, rowIndex);
          this.exportRow(dataProvider, helpers, row, rowIndex, startColumnIndex, columns.length, wrapText, styles, encodeExecutableContent);
          cellRange.to.row = currentRowIndex;
        }
        helpers.mergedRangesManager.applyMergedRages();
        cellRange.to.column += columns.length > 0 ? columns.length - 1 : 0;
        const worksheetViewSettings = worksheet.views[0] || {};
        if (component.option('rtlEnabled')) {
          worksheetViewSettings.rightToLeft = true;
        }
        if (helpers._isFrozenZone(dataProvider)) {
          if (Object.keys(worksheetViewSettings).indexOf('state') === -1) {
            (0, _extend.extend)(worksheetViewSettings, helpers._getWorksheetFrozenState(cellRange));
          }
          helpers._trySetAutoFilter(cellRange);
        }
        if (Object.keys(worksheetViewSettings).length > 0) {
          worksheet.views = [worksheetViewSettings];
        }
        resolve(cellRange);
      }).always(() => {
        if (initialLoadPanelEnabledOption) {
          component.option('loadPanel.enabled', initialLoadPanelEnabledOption);
        }
        if (loadPanel.enabled && (0, _window.hasWindow)()) {
          exportLoadPanel.dispose();
        }
      });
    });
  },
  exportRow(dataProvider, helpers, row, rowIndex, startColumnIndex, columnsCount, wrapText, styles, encodeExecutableContent) {
    for (let cellIndex = startColumnIndex; cellIndex < columnsCount; cellIndex++) {
      const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
      const excelCell = row.getCell(helpers._getFirstColumnIndex() + cellIndex);
      helpers.mergedRangesManager.updateMergedRanges(excelCell, rowIndex, cellIndex, helpers);
      const cellInfo = helpers.mergedRangesManager.findMergedCellInfo(rowIndex, cellIndex, helpers._isHeaderCell(rowIndex, cellIndex));
      if ((0, _type.isDefined)(cellInfo) && excelCell !== cellInfo.masterCell) {
        excelCell.style = cellInfo.masterCell.style;
        excelCell.value = cellInfo.masterCell.value;
      } else {
        if ((0, _type.isDate)(cellData.value)) {
          excelCell.value = this.convertDateForExcelJS(cellData.value);
        } else {
          excelCell.value = cellData.value;
        }
        if ((0, _type.isDefined)(excelCell.value)) {
          const {
            bold,
            alignment: horizontalAlignment,
            numberFormat
          } = styles[dataProvider.getStyleId(rowIndex, cellIndex)];
          if ((0, _type.isDefined)(numberFormat)) {
            this.setNumberFormat(excelCell, numberFormat);
          } else if ((0, _type.isString)(excelCell.value) && /^[@=+-]/.test(excelCell.value)) {
            this.setNumberFormat(excelCell, '@');
          }
          helpers._trySetFont(excelCell, bold);
          this.setAlignment(excelCell, wrapText, horizontalAlignment);
        }
      }
      helpers._customizeCell(excelCell, cellData.cellSourceData);
      if (encodeExecutableContent) {
        excelCell.value = _export_format.ExportFormat.encode(excelCell.value);
      }
    }
  }
};

//#DEBUG
Export.__internals = {
  MAX_EXCEL_COLUMN_WIDTH,
  MAX_DIGIT_WIDTH_IN_PIXELS
};
//#ENDDEBUG