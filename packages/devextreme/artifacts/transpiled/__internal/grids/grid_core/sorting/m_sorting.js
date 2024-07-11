"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortingModule = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _type = require("../../../../core/utils/type");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _index = require("../../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _m_sorting_mixin = _interopRequireDefault(require("./m_sorting_mixin"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const COLUMN_HEADERS_VIEW_NAMESPACE = 'dxDataGridColumnHeadersView';
// TODO improve types of this mixin
//  Now all members - protected by default (it may be wrong)
// TODO getController
const columnHeadersView = Base => class ColumnHeadersViewSortingExtender extends (0, _m_sorting_mixin.default)(Base) {
  optionChanged(args) {
    const that = this;
    switch (args.name) {
      case 'sorting':
        that._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  _createRow(row) {
    const $row = super._createRow(row);
    if (row.rowType === 'header') {
      _events_engine.default.on($row, (0, _index.addNamespace)(_click.name, COLUMN_HEADERS_VIEW_NAMESPACE), 'td', this.createAction(e => {
        this._processHeaderAction(e.event, $row);
      }));
    }
    return $row;
  }
  _processHeaderAction(event, $row) {
    if ((0, _renderer.default)(event.currentTarget).parent().get(0) !== $row.get(0)) {
      return;
    }
    const that = this;
    let keyName = null;
    const $cellElementFromEvent = (0, _renderer.default)(event.currentTarget);
    const rowIndex = $cellElementFromEvent.parent().index();
    let columnIndex = -1;
    // eslint-disable-next-line array-callback-return
    [].slice.call(that.getCellElements(rowIndex)).some(($cellElement, index) => {
      if ($cellElement === $cellElementFromEvent.get(0)) {
        columnIndex = index;
        return true;
      }
      return undefined;
    });
    const visibleColumns = that._columnsController.getVisibleColumns(rowIndex);
    const column = visibleColumns[columnIndex];
    const editingController = that.getController('editing');
    const editingMode = that.option('editing.mode');
    const isCellEditing = editingController && editingController.isEditing() && (editingMode === 'batch' || editingMode === 'cell');
    if (isCellEditing || !that._isSortableElement((0, _renderer.default)(event.target))) {
      return;
    }
    if (column && !(0, _type.isDefined)(column.groupIndex) && !column.command) {
      if (event.shiftKey) {
        keyName = 'shift';
      } else if ((0, _index.isCommandKeyPressed)(event)) {
        keyName = 'ctrl';
      }
      setTimeout(() => {
        that._columnsController.changeSortOrder(column.index, keyName);
      });
    }
  }
  _renderCellContent($cell, options) {
    const that = this;
    const {
      column
    } = options;
    if (!column.command && options.rowType === 'header') {
      that._applyColumnState({
        name: 'sort',
        rootElement: $cell,
        column,
        showColumnLines: that.option('showColumnLines')
      });
    }
    super._renderCellContent.apply(this, arguments);
  }
  _columnOptionChanged(e) {
    const {
      changeTypes
    } = e;
    if (changeTypes.length === 1 && changeTypes.sorting) {
      this._updateIndicators('sort');
      return;
    }
    super._columnOptionChanged(e);
  }
};
const headerPanel = Base => class HeaderPanelSortingExtender extends (0, _m_sorting_mixin.default)(Base) {
  optionChanged(args) {
    const that = this;
    switch (args.name) {
      case 'sorting':
        that._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  _createGroupPanelItem($rootElement, groupColumn) {
    const that = this;
    const $item = super._createGroupPanelItem(...arguments);
    _events_engine.default.on($item, (0, _index.addNamespace)(_click.name, 'dxDataGridHeaderPanel'), that.createAction(() => {
      that._processGroupItemAction(groupColumn.index);
    }));
    that._applyColumnState({
      name: 'sort',
      rootElement: $item,
      column: {
        alignment: that.option('rtlEnabled') ? 'right' : 'left',
        allowSorting: groupColumn.allowSorting,
        sortOrder: groupColumn.sortOrder === 'desc' ? 'desc' : 'asc',
        isGrouped: true
      },
      showColumnLines: true
    });
    return $item;
  }
  _processGroupItemAction(groupColumnIndex) {
    setTimeout(() => this.getController('columns').changeSortOrder(groupColumnIndex));
  }
};
const sortingModule = exports.sortingModule = {
  defaultOptions() {
    return {
      sorting: {
        mode: 'single',
        ascendingText: _message.default.format('dxDataGrid-sortingAscendingText'),
        descendingText: _message.default.format('dxDataGrid-sortingDescendingText'),
        clearText: _message.default.format('dxDataGrid-sortingClearText'),
        showSortIndexes: true
      }
    };
  },
  extenders: {
    views: {
      columnHeadersView,
      headerPanel
    }
  }
};