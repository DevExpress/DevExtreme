"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TABLE_OPERATIONS = void 0;
exports.getAutoSizedElements = getAutoSizedElements;
exports.getColumnElements = getColumnElements;
exports.getLineElements = getLineElements;
exports.getRowElements = getRowElements;
exports.getTableFormats = getTableFormats;
exports.getTableOperationHandler = getTableOperationHandler;
exports.hasEmbedContent = hasEmbedContent;
exports.setLineElementsFormat = setLineElementsFormat;
exports.unfixTableWidth = unfixTableWidth;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _inflector = require("../../../../core/utils/inflector");
var _iterator = require("../../../../core/utils/iterator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TABLE_FORMATS = ['table', 'tableHeaderCell'];
const TABLE_OPERATIONS = exports.TABLE_OPERATIONS = ['insertTable', 'insertHeaderRow', 'insertRowAbove', 'insertRowBelow', 'insertColumnLeft', 'insertColumnRight', 'deleteColumn', 'deleteRow', 'deleteTable', 'cellProperties', 'tableProperties'];
function getTableFormats(quill) {
  const tableModule = quill.getModule('table');
  // backward compatibility with an old devextreme-quill packages
  return tableModule !== null && tableModule !== void 0 && tableModule.tableFormats ? tableModule.tableFormats() : TABLE_FORMATS;
}
function hasEmbedContent(module, selection) {
  return !!selection && module.quill.getText(selection).length < selection.length;
}
function unfixTableWidth($table, _ref) {
  let {
    tableBlot,
    quill
  } = _ref;
  const unfixValue = 'initial';
  const formatBlot = tableBlot ?? quill.scroll.find($table.get(0));
  formatBlot.format('tableWidth', unfixValue);
}
function getColumnElements($table) {
  let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return $table.find('tr').eq(index).find('th, td');
}
function getAutoSizedElements($table) {
  let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'horizontal';
  const result = [];
  const isHorizontal = direction === 'horizontal';
  const $lineElements = isHorizontal ? getColumnElements($table) : getRowElements($table);
  $lineElements.each((index, element) => {
    const $element = (0, _renderer.default)(element);
    // @ts-expect-error
    if ($element.get(0).style[isHorizontal ? 'width' : 'height'] === '') {
      result.push($element);
    }
  });
  return result;
}
function setLineElementsFormat(module, _ref2) {
  let {
    elements,
    property,
    value
  } = _ref2;
  const tableBlotNames = module.quill.getModule('table').tableBlots;
  const fullPropertyName = `cell${(0, _inflector.camelize)(property, true)}`;
  (0, _iterator.each)(elements, (i, element) => {
    var _formatBlot;
    let formatBlot = module.quill.scroll.find(element);
    if (!tableBlotNames.includes(formatBlot.statics.blotName)) {
      const descendBlot = formatBlot.descendant(blot => tableBlotNames.includes(blot.statics.blotName));
      formatBlot = descendBlot ? descendBlot[0] : null;
    }
    (_formatBlot = formatBlot) === null || _formatBlot === void 0 || _formatBlot.format(fullPropertyName, `${value}px`);
  });
}
function getLineElements($table, index) {
  let direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'horizontal';
  return direction === 'horizontal' ? getRowElements($table, index) : getColumnElements($table, index);
}
function getRowElements($table) {
  let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return $table.find(`th:nth-child(${1 + index}), td:nth-child(${1 + index})`);
}
function getTableOperationHandler(quill, operationName) {
  for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }
  return () => {
    const table = quill.getModule('table');
    if (!table) {
      return;
    }
    quill.focus();
    return table[operationName](...rest);
  };
}