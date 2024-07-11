"use strict";

exports.normalizeBoundaryValue = normalizeBoundaryValue;
exports.normalizeRowsInfo = normalizeRowsInfo;
var _type = require("../../../core/utils/type");
function normalizeBoundaryValue(value) {
  if ((0, _type.isNumeric)(value)) {
    return {
      top: value,
      right: value,
      bottom: value,
      left: value
    };
  }
  return {
    top: (value === null || value === void 0 ? void 0 : value.top) ?? 0,
    right: (value === null || value === void 0 ? void 0 : value.right) ?? 0,
    bottom: (value === null || value === void 0 ? void 0 : value.bottom) ?? 0,
    left: (value === null || value === void 0 ? void 0 : value.left) ?? 0
  };
}
function normalizeRowsInfo(rowsInfo) {
  rowsInfo.forEach(row => {
    row.cells.forEach(_ref => {
      let {
        pdfCell
      } = _ref;
      pdfCell.padding = normalizeBoundaryValue(pdfCell.padding);
    });
  });
}