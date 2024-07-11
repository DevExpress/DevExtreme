"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getButtonIndex = exports.generateNewRowTempKey = exports.forEachFormItems = exports.createFailureHandler = void 0;
exports.getButtonName = getButtonName;
exports.getEditorType = exports.getEditingTexts = void 0;
exports.isEditable = isEditable;
exports.isNewRowTempKey = exports.isEditingOrShowEditorAlwaysDataCell = exports.isEditingCell = void 0;
var _guid = _interopRequireDefault(require("../../../../core/guid"));
var _type = require("../../../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const NEW_ROW_TEMP_KEY_PREFIX = '_DX_KEY_';
const GUID_LENGTH = 36;
const createFailureHandler = function (deferred) {
  return function (arg) {
    const error = arg instanceof Error ? arg : new Error(arg && String(arg) || 'Unknown error');
    deferred.reject(error);
  };
};
exports.createFailureHandler = createFailureHandler;
const isEditingCell = function (isEditRow, cellOptions) {
  return cellOptions.isEditing || isEditRow && cellOptions.column.allowEditing;
};
exports.isEditingCell = isEditingCell;
const isEditingOrShowEditorAlwaysDataCell = function (isEditRow, cellOptions) {
  const isCommandCell = !!cellOptions.column.command;
  const isEditing = isEditingCell(isEditRow, cellOptions);
  const isEditorCell = !isCommandCell && (isEditing || cellOptions.column.showEditorAlways);
  return cellOptions.rowType === 'data' && isEditorCell;
};
exports.isEditingOrShowEditorAlwaysDataCell = isEditingOrShowEditorAlwaysDataCell;
const getEditingTexts = options => {
  const editingTexts = options.component.option('editing.texts') || {};
  return {
    save: editingTexts.saveRowChanges,
    cancel: editingTexts.cancelRowChanges,
    edit: editingTexts.editRow,
    undelete: editingTexts.undeleteRow,
    delete: editingTexts.deleteRow,
    add: editingTexts.addRowToNode
  };
};
exports.getEditingTexts = getEditingTexts;
const generateNewRowTempKey = () => `${NEW_ROW_TEMP_KEY_PREFIX}${new _guid.default()}`;
exports.generateNewRowTempKey = generateNewRowTempKey;
const isNewRowTempKey = key => typeof key === 'string' && key.startsWith(NEW_ROW_TEMP_KEY_PREFIX) && key.length === NEW_ROW_TEMP_KEY_PREFIX.length + GUID_LENGTH;
exports.isNewRowTempKey = isNewRowTempKey;
const getButtonIndex = (buttons, name) => {
  let result = -1;
  // @ts-expect-error
  // eslint-disable-next-line consistent-return, array-callback-return
  buttons.some((button, index) => {
    if (getButtonName(button) === name) {
      result = index;
      return true;
    }
  });
  return result;
};
exports.getButtonIndex = getButtonIndex;
function getButtonName(button) {
  // @ts-expect-error
  return (0, _type.isObject)(button) ? button.name : button;
}
function isEditable($element) {
  return $element && ($element.is('input') || $element.is('textarea'));
}
const getEditorType = item => {
  var _column$formItem;
  const {
    column
  } = item;
  return item.isCustomEditorType ? item.editorType : (_column$formItem = column.formItem) === null || _column$formItem === void 0 ? void 0 : _column$formItem.editorType;
};
exports.getEditorType = getEditorType;
const forEachFormItems = (items, callBack) => {
  items.forEach(item => {
    if (item.items || item.tabs) {
      forEachFormItems(item.items || item.tabs, callBack);
    } else {
      callBack(item);
    }
  });
};
exports.forEachFormItems = forEachFormItems;