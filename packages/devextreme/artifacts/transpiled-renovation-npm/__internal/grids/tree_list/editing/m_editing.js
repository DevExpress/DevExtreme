"use strict";

require("../module_not_extended/editor_factory");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_editing = require("../../../grids/grid_core/editing/m_editing");
var _m_utils = _interopRequireDefault(require("../../../grids/grid_core/m_utils"));
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
const DATA_EDIT_DATA_INSERT_TYPE = 'insert';
class EditingController extends _m_editing.editingModule.controllers.editing {
  _generateNewItem(key) {
    const item = super._generateNewItem(key);
    item.data = {
      key
    };
    item.children = [];
    item.level = 0;
    item.parentKey = this.option('rootValue');
    return item;
  }
  _isProcessedItem() {
    return true;
  }
  _setInsertAfterOrBeforeKey(change, parentKey) {
    if (parentKey !== undefined && parentKey !== this.option('rootValue')) {
      change.insertAfterKey = parentKey;
    } else {
      // @ts-expect-error
      super._setInsertAfterOrBeforeKey.apply(this, arguments);
    }
  }
  _getLoadedRowIndex(items, change) {
    const dataSourceAdapter = this._dataController.dataSource();
    const parentKey = dataSourceAdapter === null || dataSourceAdapter === void 0 ? void 0 : dataSourceAdapter.parentKeyOf(change.data);
    if (parentKey !== undefined && parentKey !== this.option('rootValue')) {
      const rowIndex = _m_utils.default.getIndexByKey(parentKey, items);
      // @ts-expect-error
      if (rowIndex >= 0 && this._dataController.isRowExpanded(parentKey)) {
        return rowIndex + 1;
      }
      return -1;
    }
    // @ts-expect-error
    return super._getLoadedRowIndex.apply(this, arguments);
  }
  _isEditColumnVisible() {
    // @ts-expect-error
    const result = super._isEditColumnVisible.apply(this, arguments);
    const editingOptions = this.option('editing');
    return result || editingOptions.allowAdding;
  }
  _isDefaultButtonVisible(button, options) {
    // @ts-expect-error
    const result = super._isDefaultButtonVisible.apply(this, arguments);
    const {
      row
    } = options;
    if (button.name === 'add') {
      return this.allowAdding(options) && row.rowIndex !== this._getVisibleEditRowIndex() && !(row.removed || row.isNewRow);
    }
    return result;
  }
  _getEditingButtons(options) {
    // @ts-expect-error
    const buttons = super._getEditingButtons.apply(this, arguments);
    if (!options.column.buttons) {
      buttons.unshift(this._getButtonConfig('add', options));
    }
    return buttons;
  }
  _beforeSaveEditData(change) {
    // @ts-expect-error
    const result = super._beforeSaveEditData.apply(this, arguments);
    if (change && change.type !== DATA_EDIT_DATA_INSERT_TYPE) {
      var _this$_dataController;
      const store = (_this$_dataController = this._dataController) === null || _this$_dataController === void 0 ? void 0 : _this$_dataController.store();
      const key = store === null || store === void 0 ? void 0 : store.key();
      if (!(0, _type.isDefined)(key)) {
        throw _ui.default.Error('E1045');
      }
    }
    return result;
  }
  addRowByRowIndex(rowIndex) {
    const row = this._dataController.getVisibleRows()[rowIndex];
    return this.addRow(row ? row.key : undefined);
  }
  addRow(key) {
    if (key === undefined) {
      key = this.option('rootValue');
    }
    return super.addRow.call(this, key);
  }
  _addRowCore(data, parentKey, oldEditRowIndex) {
    const rootValue = this.option('rootValue');
    const dataSourceAdapter = this._dataController.dataSource();
    const parentKeyGetter = dataSourceAdapter.createParentIdGetter();
    parentKey = parentKeyGetter(data);
    // @ts-expect-error
    if (parentKey !== undefined && parentKey !== rootValue && !this._dataController.isRowExpanded(parentKey)) {
      // @ts-expect-error
      const deferred = new _deferred.Deferred();
      // @ts-expect-error
      this._dataController.expandRow(parentKey).done(() => {
        setTimeout(() => {
          super._addRowCore.call(this, data, parentKey, oldEditRowIndex).done(deferred.resolve).fail(deferred.reject);
        });
      }).fail(deferred.reject);
      return deferred.promise();
    }
    return super._addRowCore.call(this, data, parentKey, oldEditRowIndex);
  }
  _initNewRow(options, parentKey) {
    const dataSourceAdapter = this._dataController.dataSource();
    const parentIdSetter = dataSourceAdapter.createParentIdSetter();
    parentIdSetter(options.data, parentKey);
    // @ts-expect-error
    return super._initNewRow.apply(this, arguments);
  }
  allowAdding(options) {
    return this._allowEditAction('allowAdding', options);
  }
  _needToCloseEditableCell($targetElement) {
    // @ts-expect-error
    return super._needToCloseEditableCell.apply(this, arguments) || $targetElement.closest(`.${TREELIST_EXPAND_ICON_CONTAINER_CLASS}`).length && this.isEditing();
  }
  getButtonLocalizationNames() {
    const names = super.getButtonLocalizationNames.apply(this);
    // @ts-expect-error
    names.add = 'dxTreeList-editingAddRowToNode';
    return names;
  }
}
const rowsView = Base => class TreeListEditingRowsViewExtender extends _m_editing.editingModule.extenders.views.rowsView(Base) {
  _renderCellCommandContent($container, options) {
    const editingController = this._editingController;
    const isEditRow = options.row && editingController.isEditRow(options.row.rowIndex);
    const isEditing = options.isEditing || isEditRow;
    if (!options.isOnForm && !isEditing) {
      // @ts-expect-error
      return super._renderCellCommandContent.apply(this, arguments);
    }
    return false;
  }
  validateClick(e) {
    const $targetElement = (0, _renderer.default)(e.event.target);
    const originalClickHandler = e.event.type === 'dxdblclick' ? super._rowDblClick : super._rowClick;
    if ($targetElement.closest(`.${SELECT_CHECKBOX_CLASS}`).length) {
      return false;
    }
    return !this.needToCallOriginalClickHandler(e, originalClickHandler);
  }
  needToCallOriginalClickHandler(e, originalClickHandler) {
    const $targetElement = (0, _renderer.default)(e.event.target);
    if (!$targetElement.closest(`.${TREELIST_EXPAND_ICON_CONTAINER_CLASS}`).length) {
      originalClickHandler.call(this, e);
      return true;
    }
    return false;
  }
  _rowClick(e) {
    if (this.validateClick(e)) {
      // @ts-expect-error
      super._rowClickTreeListHack.apply(this, arguments);
    }
  }
  _rowDblClick(e) {
    if (this.validateClick(e)) {
      // @ts-expect-error
      super._rowDblClickTreeListHack.apply(this, arguments);
    }
  }
};
const data = Base => class DataControllerTreeListEditingExtender extends (0, _m_editing.dataControllerEditingExtenderMixin)(Base) {
  changeRowExpand() {
    this._editingController.refresh();
    // @ts-expect-error
    return super.changeRowExpand.apply(this, arguments);
  }
};
_m_core.default.registerModule('editing', {
  defaultOptions() {
    return (0, _extend.extend)(true, _m_editing.editingModule.defaultOptions(), {
      editing: {
        texts: {
          addRowToNode: _message.default.format('dxTreeList-editingAddRowToNode')
        }
      }
    });
  },
  controllers: {
    editing: EditingController
  },
  extenders: {
    controllers: {
      data
    },
    views: {
      rowsView,
      headerPanel: _m_editing.editingModule.extenders.views.headerPanel
    }
  }
});