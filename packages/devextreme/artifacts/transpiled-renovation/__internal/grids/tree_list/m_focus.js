"use strict";

var _deferred = require("../../../core/utils/deferred");
var _m_focus = require("../../grids/grid_core/focus/m_focus");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function findIndex(items, callback) {
  let result = -1;
  items.forEach((node, index) => {
    if (callback(node)) {
      result = index;
    }
  });
  return result;
}
const data = Base => class TreeListDataControllerExtender extends _m_focus.focusModule.extenders.controllers.data(Base) {
  changeRowExpand(key) {
    // @ts-expect-error
    if (this.option('focusedRowEnabled') && this.isRowExpanded(key)) {
      if (this._isFocusedRowInside(key)) {
        this.option('focusedRowKey', key);
      }
    }
    // @ts-expect-error
    return super.changeRowExpand.apply(this, arguments);
  }
  _isFocusedRowInside(parentKey) {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this.getRowIndexByKey(focusedRowKey);
    const focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
    // @ts-expect-error
    let parent = focusedRow && focusedRow.node.parent;
    while (parent) {
      if (parent.key === parentKey) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }
  getParentKey(key) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const node = that.getNodeByKey(key);
    // @ts-expect-error
    const d = new _deferred.Deferred();
    if (node) {
      d.resolve(node.parent ? node.parent.key : undefined);
    } else {
      dataSource.load({
        filter: [dataSource.getKeyExpr(), '=', key]
      }).done(items => {
        const parentData = items[0];
        if (parentData) {
          d.resolve(dataSource.parentKeyOf(parentData));
        } else {
          d.resolve();
        }
      }).fail(d.reject);
    }
    return d.promise();
  }
  expandAscendants(key) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    that.getParentKey(key).done(parentKey => {
      if (dataSource && parentKey !== undefined && parentKey !== that.option('rootValue')) {
        dataSource._isNodesInitializing = true;
        // @ts-expect-error
        that.expandRow(parentKey);
        dataSource._isNodesInitializing = false;
        that.expandAscendants(parentKey).done(d.resolve).fail(d.reject);
      } else {
        d.resolve();
      }
    }).fail(d.reject);
    return d.promise();
  }
  getPageIndexByKey(key) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    that.expandAscendants(key).done(() => {
      dataSource.load({
        parentIds: []
      }).done(nodes => {
        const offset = findIndex(nodes, node => that.keyOf(node.data) === key);
        let pageIndex = -1;
        if (offset >= 0) {
          pageIndex = Math.floor(offset / that.pageSize());
        }
        d.resolve(pageIndex);
      }).fail(d.reject);
    }).fail(d.reject);
    return d.promise();
  }
};
_m_core.default.registerModule('focus', _extends({}, _m_focus.focusModule, {
  extenders: _extends({}, _m_focus.focusModule.extenders, {
    controllers: _extends({}, _m_focus.focusModule.extenders.controllers, {
      data
    })
  })
}));