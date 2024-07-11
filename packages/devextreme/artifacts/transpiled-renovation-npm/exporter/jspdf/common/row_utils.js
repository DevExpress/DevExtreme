"use strict";

exports.applyBordersConfig = applyBordersConfig;
exports.applyColSpans = applyColSpans;
exports.applyRowSpans = applyRowSpans;
exports.calculateCoordinates = calculateCoordinates;
exports.calculateHeights = calculateHeights;
exports.calculateTableSize = calculateTableSize;
exports.initializeCellsWidth = initializeCellsWidth;
exports.resizeFirstColumnByIndentLevel = resizeFirstColumnByIndentLevel;
var _type = require("../../../core/utils/type");
var _pdf_utils = require("./pdf_utils");
const getSum = (a, b) => a + b;
function calculateColumnWidths(doc, dataProvider, topLeftX, margin, customerColumnWidths) {
  const DEFAULT_WIDTH = 150;
  const resultWidths = dataProvider.getColumnsWidths().map(width => (0, _pdf_utils.toPdfUnit)(doc, width ?? DEFAULT_WIDTH));
  const totalAutoColumnsWidth = resultWidths.filter((width, index) => !(0, _type.isDefined)(customerColumnWidths[index])).reduce(getSum, 0);
  const totalCustomerColumnsWidth = customerColumnWidths.filter(width => (0, _type.isNumeric)(width)).reduce(getSum, 0);
  const availablePageWidth = getAvailablePageAreaWidth(doc, topLeftX, margin);
  const ratio = totalCustomerColumnsWidth < availablePageWidth ? (availablePageWidth - totalCustomerColumnsWidth) / totalAutoColumnsWidth : 1;
  return resultWidths.map((width, index) => customerColumnWidths[index] ?? width * ratio);
}
function getAvailablePageAreaWidth(doc, topLeftX, margin) {
  return (0, _pdf_utils.getPageWidth)(doc) - topLeftX - margin.left - margin.right;
}
function initializeCellsWidth(doc, dataProvider, rows, options) {
  const columnWidths = calculateColumnWidths(doc, dataProvider, options.topLeft.x, options.margin, options.columnWidths);
  rows.forEach(row => {
    row.cells.forEach((_ref, index) => {
      let {
        gridCell,
        pdfCell
      } = _ref;
      pdfCell._rect.w = columnWidths[index];
    });
  });
}
function calculateHeights(doc, rows, options) {
  rows.forEach(row => {
    const pdfCells = row.cells.map(c => c.pdfCell);
    let customerHeight;
    if (options.onRowExporting) {
      const args = {
        rowCells: pdfCells
      };
      options.onRowExporting(args);
      if ((0, _type.isDefined)(args.rowHeight)) {
        customerHeight = args.rowHeight;
      }
    }
    row.height = (0, _type.isDefined)(customerHeight) ? customerHeight : (0, _pdf_utils.calculateRowHeight)(doc, row.cells, pdfCells.map(c => c._rect.w));
    pdfCells.forEach(cell => {
      cell._rect.h = row.height;
    });
  });
}
function applyColSpans(rows) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      const cell = row.cells[cellIndex];
      if ((0, _type.isDefined)(cell.colSpan) && !(0, _type.isDefined)(cell.pdfCell.isMerged)) {
        for (let spanIndex = 1; spanIndex <= cell.colSpan; spanIndex++) {
          const mergedCell = rows[rowIndex].cells[cellIndex + spanIndex];
          cell.pdfCell._rect.w += mergedCell.pdfCell._rect.w;
          mergedCell.pdfCell._rect.w = 0;
          mergedCell.pdfCell.isMerged = true;
        }
      }
    }
  }
}
function applyRowSpans(rows) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      const cell = row.cells[cellIndex];
      if ((0, _type.isDefined)(cell.rowSpan) && !(0, _type.isDefined)(cell.pdfCell.isMerged)) {
        for (let spanIndex = 1; spanIndex <= cell.rowSpan; spanIndex++) {
          const mergedCell = rows[rowIndex + spanIndex].cells[cellIndex];
          cell.pdfCell._rect.h += mergedCell.pdfCell._rect.h;
          mergedCell.pdfCell._rect.h = 0;
          mergedCell.pdfCell.isMerged = true;
        }
      }
    }
  }
}
function resizeFirstColumnByIndentLevel(rows, options) {
  rows.forEach(row => {
    row.cells[0].pdfCell._rect.w -= row.indentLevel * options.indent;
  });
}
function applyBordersConfig(rows) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const cells = rows[rowIndex].cells;
    for (let columnIndex = 0; columnIndex < cells.length; columnIndex++) {
      const pdfCell = cells[columnIndex].pdfCell;
      const leftPdfCell = columnIndex >= 1 ? cells[columnIndex - 1].pdfCell : null;
      const topPdfCell = rowIndex >= 1 ? rows[rowIndex - 1].cells[columnIndex].pdfCell : null;
      if (pdfCell.drawLeftBorder === false && !(0, _type.isDefined)(cells[columnIndex].colSpan)) {
        // TODO: Check this logic after implementing splitting to pages
        if ((0, _type.isDefined)(leftPdfCell)) {
          leftPdfCell.drawRightBorder = false;
        }
      } else if (!(0, _type.isDefined)(pdfCell.drawLeftBorder)) {
        if ((0, _type.isDefined)(leftPdfCell) && leftPdfCell.drawRightBorder === false) {
          pdfCell.drawLeftBorder = false;
        }
      }
      if (pdfCell.drawTopBorder === false) {
        if ((0, _type.isDefined)(topPdfCell)) {
          topPdfCell.drawBottomBorder = false;
        }
      } else if (!(0, _type.isDefined)(pdfCell.drawTopBorder)) {
        if ((0, _type.isDefined)(topPdfCell) && topPdfCell.drawBottomBorder === false) {
          pdfCell.drawTopBorder = false;
        }
      }
    }
  }
}
function calculateCoordinates(doc, rows, options) {
  const topLeft = options === null || options === void 0 ? void 0 : options.topLeft;
  const margin = options === null || options === void 0 ? void 0 : options.margin;
  let y = ((topLeft === null || topLeft === void 0 ? void 0 : topLeft.y) ?? 0) + margin.top;
  rows.forEach(row => {
    let x = ((topLeft === null || topLeft === void 0 ? void 0 : topLeft.x) ?? 0) + margin.left;
    const intend = row.indentLevel * options.indent;
    row.cells.forEach(cell => {
      cell.pdfCell._rect.x = x + intend;
      cell.pdfCell._rect.y = y;
      x += cell.pdfCell._rect.w;
    });
    y += row.height;
  });
}
function calculateTableSize(doc, cells, options) {
  var _options$topLeft, _options$topLeft2;
  let leftPos;
  let topPos;
  let rightPos;
  let bottomPos;
  cells.forEach(cell => {
    if (!(0, _type.isDefined)(leftPos) || leftPos > cell._rect.x) {
      leftPos = cell._rect.x;
    }
    if (!(0, _type.isDefined)(topPos) || topPos > cell._rect.y) {
      topPos = cell._rect.y;
    }
    if (!(0, _type.isDefined)(rightPos) || rightPos < cell._rect.x + cell._rect.w) {
      rightPos = cell._rect.x + cell._rect.w;
    }
    if (!(0, _type.isDefined)(bottomPos) || bottomPos < cell._rect.y + cell._rect.h) {
      bottomPos = cell._rect.y + cell._rect.h;
    }
  });
  const x = leftPos ?? (options === null || options === void 0 || (_options$topLeft = options.topLeft) === null || _options$topLeft === void 0 ? void 0 : _options$topLeft.x) ?? 0;
  const y = topPos ?? (options === null || options === void 0 || (_options$topLeft2 = options.topLeft) === null || _options$topLeft2 === void 0 ? void 0 : _options$topLeft2.y) ?? 0;
  const w = (0, _type.isDefined)(rightPos) ? rightPos - x : 0;
  const h = (0, _type.isDefined)(bottomPos) ? bottomPos - y : 0;
  return {
    x,
    y,
    w,
    h
  };
}