"use strict";

exports.generateRowsInfo = generateRowsInfo;
exports.getBaseTableStyle = getBaseTableStyle;
var _type = require("../../../core/utils/type");
var _date = _interopRequireDefault(require("../../../localization/date"));
var _number = _interopRequireDefault(require("../../../localization/number"));
var _pdf_utils = require("./pdf_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const defaultStyles = {
  base: {
    font: {
      size: 10
    },
    borderWidth: 0.5,
    borderColor: '#979797'
  },
  header: {
    textColor: '#979797'
  },
  group: {},
  data: {},
  groupFooter: {},
  totalFooter: {}
};
function generateRowsInfo(doc, dataProvider, dataGrid, headerBackgroundColor) {
  const result = [];
  const rowsCount = dataProvider.getRowsCount();
  const wordWrapEnabled = !!dataGrid.option('wordWrapEnabled');
  const rtlEnabled = !!dataGrid.option('rtlEnabled');
  const columns = dataProvider.getColumns();
  const styles = dataProvider.getStyles();
  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    const rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
    let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
    const previousRow = result[rowIndex - 1];
    if (rowType === 'groupFooter' && (previousRow === null || previousRow === void 0 ? void 0 : previousRow.rowType) === 'groupFooter') {
      indentLevel = previousRow.indentLevel - 1;
    }
    result.push({
      rowType: rowType,
      indentLevel,
      cells: generateRowCells({
        doc,
        dataProvider,
        rowIndex,
        wordWrapEnabled,
        columns,
        styles,
        rowType,
        backgroundColor: rowType === 'header' ? headerBackgroundColor : undefined,
        rtlEnabled
      }),
      rowIndex
    });
  }
  return result;
}
function generateRowCells(_ref) {
  let {
    doc,
    dataProvider,
    rowIndex,
    wordWrapEnabled,
    columns,
    styles,
    rowType,
    backgroundColor,
    rtlEnabled
  } = _ref;
  const result = [];
  for (let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
    const cellStyle = styles[dataProvider.getStyleId(rowIndex, cellIndex)];
    const style = getPdfCellStyle(columns[cellIndex], rowType, cellStyle);
    const defaultAlignment = rtlEnabled ? 'right' : 'left';
    const paddingValue = (0, _pdf_utils.toPdfUnit)(doc, 5);
    const pdfCell = {
      text: getFormattedValue(cellData.value, cellStyle.format),
      verticalAlign: 'middle',
      horizontalAlign: style.alignment ?? defaultAlignment,
      wordWrapEnabled,
      backgroundColor,
      padding: {
        top: paddingValue,
        right: paddingValue,
        bottom: paddingValue,
        left: paddingValue
      },
      _rect: {},
      _internalTextOptions: {}
    };
    if (rtlEnabled) {
      // https://github.com/parallax/jsPDF/issues/2235
      pdfCell._internalTextOptions.isInputVisual = false;
      pdfCell._internalTextOptions.isOutputVisual = true;
      pdfCell._internalTextOptions.isInputRtl = true;
      pdfCell._internalTextOptions.isOutputRtl = false;
    }
    const cellInfo = {
      gridCell: cellData.cellSourceData,
      pdfCell: Object.assign({}, pdfCell, style)
    };
    if (rowType === 'header') {
      const cellMerging = dataProvider.getCellMerging(rowIndex, cellIndex);
      if (cellMerging && cellMerging.rowspan > 0) {
        cellInfo.rowSpan = cellMerging.rowspan;
      }
      if (cellMerging && cellMerging.colspan > 0) {
        cellInfo.colSpan = cellMerging.colspan;
      }
    } else if (rowType === 'group') {
      const drawLeftBorderField = rtlEnabled ? 'drawRightBorder' : 'drawLeftBorder';
      const drawRightBorderField = rtlEnabled ? 'drawLeftBorder' : 'drawRightBorder';
      cellInfo.pdfCell[drawLeftBorderField] = cellIndex === 0;
      cellInfo.pdfCell[drawRightBorderField] = cellIndex === columns.length - 1;
      if (cellIndex > 0) {
        const isEmptyCellsExceptFirst = result.slice(1).reduce((accumulate, cellInfo) => {
          return accumulate && !(0, _type.isDefined)(cellInfo.pdfCell.text);
        }, true);
        if (!(0, _type.isDefined)(cellInfo.pdfCell.text) && isEmptyCellsExceptFirst) {
          result[0].pdfCell[drawRightBorderField] = true;
          for (let i = 0; i < result.length; i++) {
            result[i].colSpan = result.length;
          }
          cellInfo.colSpan = result.length;
        }
      }
    }
    result.push(cellInfo);
  }
  return result;
}
function getBaseTableStyle() {
  return defaultStyles['base'];
}
function getPdfCellStyle(column, rowType, cellStyle) {
  const styles = Object.assign({}, defaultStyles['base'], defaultStyles[rowType]);
  const alignment = rowType === 'header' ? column.alignment : cellStyle.alignment;
  if (alignment) {
    styles.alignment = alignment;
  }
  if (cellStyle.bold && rowType !== 'header') {
    styles.font = Object.assign({}, styles.font, {
      style: 'bold'
    });
  }
  return styles;
}
function getFormattedValue(value, format) {
  if ((0, _type.isDefined)(format)) {
    if ((0, _type.isDate)(value)) {
      return _date.default.format(value, format);
    }
    if ((0, _type.isNumeric)(value)) {
      return _number.default.format(value, format);
    }
  }
  return value === null || value === void 0 ? void 0 : value.toString();
}