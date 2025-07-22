/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dateLocalization from '@js/common/core/localization/date';
import numberLocalization from '@js/common/core/localization/number';
import { isDate, isDefined, isNumeric } from '@js/core/utils/type';

import { toPdfUnit } from './pdf_utils';

const defaultStyles = {
  base: { font: { size: 10 }, borderWidth: 0.5, borderColor: '#979797' },
  header: { textColor: '#979797' },
  group: { },
  data: { },
  groupFooter: { },
  totalFooter: { },
};

function generateRowsInfo(doc, dataProvider, dataGrid, headerBackgroundColor) {
  const result = [];

  const rowsCount = dataProvider.getRowsCount();
  const wordWrapEnabled = !!dataGrid.option('wordWrapEnabled');
  const rtlEnabled = !!dataGrid.option('rtlEnabled');
  const columns = dataProvider.getColumns();
  const styles = dataProvider.getStyles();

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    const { rowType } = dataProvider.getCellData(rowIndex, 0, true).cellSourceData;
    let indentLevel = rowType !== 'header' ? dataProvider.getGroupLevel(rowIndex) : 0;
    const previousRow = result[rowIndex - 1];
    // @ts-expect-error
    if (rowType === 'groupFooter' && previousRow?.rowType === 'groupFooter') {
      // @ts-expect-error
      indentLevel = previousRow.indentLevel - 1;
    }

    // @ts-expect-error
    result.push({
      rowType,
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
        rtlEnabled,
      }),
      rowIndex,
    });
  }

  return result;
}

function generateRowCells({
  doc, dataProvider, rowIndex, wordWrapEnabled, columns, styles, rowType, backgroundColor, rtlEnabled,
}) {
  const result = [];
  for (let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
    const cellStyle = styles[dataProvider.getStyleId(rowIndex, cellIndex)];
    const style = getPdfCellStyle(columns[cellIndex], rowType, cellStyle);

    const defaultAlignment = rtlEnabled ? 'right' : 'left';
    const paddingValue = toPdfUnit(doc, 5);
    const pdfCell = {
      text: getFormattedValue(cellData.value, cellStyle.format),
      verticalAlign: 'middle',
      horizontalAlign: style.alignment ?? defaultAlignment,
      wordWrapEnabled,
      backgroundColor,
      padding: {
        top: paddingValue, right: paddingValue, bottom: paddingValue, left: paddingValue,
      },
      _rect: {},
      _internalTextOptions: {},
    };

    if (rtlEnabled) {
      // https://github.com/parallax/jsPDF/issues/2235
      // @ts-expect-error
      pdfCell._internalTextOptions.isInputVisual = false;
      // @ts-expect-error
      pdfCell._internalTextOptions.isOutputVisual = true;
      // @ts-expect-error
      pdfCell._internalTextOptions.isInputRtl = true;
      // @ts-expect-error
      pdfCell._internalTextOptions.isOutputRtl = false;
    }

    const cellInfo = {
      gridCell: cellData.cellSourceData,
      pdfCell: { ...pdfCell, ...style },
    };

    if (rowType === 'header') {
      const cellMerging = dataProvider.getCellMerging(rowIndex, cellIndex);
      if (cellMerging && cellMerging.rowspan > 0) {
        // @ts-expect-error
        cellInfo.rowSpan = cellMerging.rowspan;
      }
      if (cellMerging && cellMerging.colspan > 0) {
        // @ts-expect-error
        cellInfo.colSpan = cellMerging.colspan;
      }
    } else if (rowType === 'group') {
      const drawLeftBorderField = rtlEnabled ? 'drawRightBorder' : 'drawLeftBorder';
      const drawRightBorderField = rtlEnabled ? 'drawLeftBorder' : 'drawRightBorder';
      cellInfo.pdfCell[drawLeftBorderField] = cellIndex === 0;
      cellInfo.pdfCell[drawRightBorderField] = cellIndex === columns.length - 1;

      if (cellIndex > 0) {
        const isEmptyCellsExceptFirst = result.slice(1).reduce(
          // @ts-expect-error
          (accumulate, cellInfo) => accumulate && !isDefined(cellInfo.pdfCell.text),
          true,
        );
        if (!isDefined(cellInfo.pdfCell.text) && isEmptyCellsExceptFirst) {
          // @ts-expect-error
          result[0].pdfCell[drawRightBorderField] = true;
          for (let i = 0; i < result.length; i++) {
            // @ts-expect-error
            result[i].colSpan = result.length;
          }
          // @ts-expect-error
          cellInfo.colSpan = result.length;
        }
      }
    }

    // @ts-expect-error
    result.push(cellInfo);
  }
  return result;
}

function getBaseTableStyle() {
  return defaultStyles.base;
}

function getPdfCellStyle(column, rowType, cellStyle) {
  const styles = { ...defaultStyles.base, ...defaultStyles[rowType] };
  const alignment = rowType === 'header' ? column.alignment : cellStyle.alignment;

  if (alignment) {
    styles.alignment = alignment;
  }

  if (cellStyle.bold && rowType !== 'header') {
    styles.font = { ...styles.font, style: 'bold' };
  }

  return styles;
}

function getFormattedValue(value, format) {
  if (isDefined(format)) {
    if (isDate(value)) {
      return dateLocalization.format(value, format);
    }
    if (isNumeric(value)) {
      return numberLocalization.format(value, format);
    }
  }
  return value?.toString();
}

export { generateRowsInfo, getBaseTableStyle };
