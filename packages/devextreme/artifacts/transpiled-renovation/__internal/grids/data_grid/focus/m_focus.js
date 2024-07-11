"use strict";

var _common = require("../../../../core/utils/common");
var _data = require("../../../../core/utils/data");
var _deferred = require("../../../../core/utils/deferred");
var _type = require("../../../../core/utils/type");
var _m_focus = require("../../../grids/grid_core/focus/m_focus");
var _m_core = _interopRequireDefault(require("../m_core"));
var _m_utils = require("../m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991 /* IE11 */;
const data = Base => class FocusDataControllerExtender extends _m_focus.focusModule.extenders.controllers.data(Base) {
  changeRowExpand(path, isRowClick) {
    // @ts-expect-error
    if (this.option('focusedRowEnabled') && Array.isArray(path) && this.isRowExpanded(path)) {
      if ((!isRowClick || !this._keyboardNavigationController.isKeyboardEnabled()) && this._isFocusedRowInsideGroup(path)) {
        this.option('focusedRowKey', path);
      }
    }
    // @ts-expect-error
    return super.changeRowExpand(path, isRowClick);
  }
  _isFocusedRowInsideGroup(path) {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this.getRowIndexByKey(focusedRowKey);
    const focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
    const groups = this._columnsController.getGroupDataSourceParameters(true);
    if (focusedRow) {
      for (let i = 0; i < path.length; ++i) {
        const getter = (0, _data.compileGetter)(groups[i] && groups[i].selector);
        // @ts-expect-error
        if (getter(focusedRow.data) !== path[i]) {
          return false;
        }
      }
    }
    return true;
  }
  _getGroupPath(groupItem, groupCount) {
    const groupPath = [];
    let items = [groupItem];
    while (items && items[0] && groupCount) {
      const item = items[0];
      if (item.key !== undefined) {
        groupPath.push(item.key);
      }
      items = item.items;
      groupCount--;
    }
    return groupPath;
  }
  _expandGroupByPath(that, groupPath, level) {
    // @ts-expect-error
    const d = new _deferred.Deferred();
    level++;
    that.expandRow(groupPath.slice(0, level)).done(() => {
      if (level === groupPath.length) {
        d.resolve();
      } else {
        that._expandGroupByPath(that, groupPath, level).done(d.resolve).fail(d.reject);
      }
    }).fail(d.reject);
    return d.promise();
  }
  _calculateGlobalRowIndexByGroupedData(key) {
    const that = this;
    const dataSource = that._dataSource;
    const filter = that._generateFilterByKey(key);
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const isGroupKey = Array.isArray(key);
    const group = dataSource.group();
    if (isGroupKey) {
      return deferred.resolve(-1).promise();
    }
    if (!dataSource._grouping._updatePagingOptions) {
      that._calculateGlobalRowIndexByFlatData(key, null, true).done(deferred.resolve).fail(deferred.reject);
      return deferred;
    }
    dataSource.load({
      filter: that._concatWithCombinedFilter(filter),
      group
    }).done(data => {
      if (!data || data.length === 0 || !(0, _type.isDefined)(data[0].key) || data[0].key === -1) {
        return deferred.resolve(-1).promise();
      }
      const groupPath = that._getGroupPath(data[0], group.length);
      that._expandGroupByPath(that, groupPath, 0).done(() => {
        that._calculateExpandedRowGlobalIndex(deferred, key, groupPath, group);
      }).fail(deferred.reject);
    }).fail(deferred.reject);
    return deferred.promise();
  }
  _calculateExpandedRowGlobalIndex(deferred, key, groupPath, group) {
    const groupFilter = (0, _m_utils.createGroupFilter)(groupPath, {
      group
    });
    const dataSource = this._dataSource;
    const scrollingMode = this.option('scrolling.mode');
    const isVirtualScrolling = scrollingMode === 'virtual' || scrollingMode === 'infinite';
    const pageSize = dataSource.pageSize();
    let groupOffset;
    dataSource._grouping._updatePagingOptions({
      skip: 0,
      take: MAX_SAFE_INTEGER
    }, (groupInfo, totalOffset) => {
      if ((0, _common.equalByValue)(groupInfo.path, groupPath)) {
        groupOffset = totalOffset;
      }
    });
    // @ts-expect-error
    this._calculateGlobalRowIndexByFlatData(key, groupFilter).done(dataOffset => {
      let count;
      let groupContinuationCount;
      if (dataOffset < 0) {
        deferred.resolve(-1);
        return;
      }
      const currentPageOffset = groupOffset % pageSize || pageSize;
      count = currentPageOffset + dataOffset - groupPath.length;
      if (isVirtualScrolling) {
        groupContinuationCount = 0;
      } else {
        groupContinuationCount = Math.floor(count / (pageSize - groupPath.length)) * groupPath.length;
      }
      count = groupOffset + dataOffset + groupContinuationCount;
      deferred.resolve(count);
    }).fail(deferred.reject);
  }
};
_m_core.default.registerModule('focus', _extends({}, _m_focus.focusModule, {
  extenders: _extends({}, _m_focus.focusModule.extenders, {
    controllers: _extends({}, _m_focus.focusModule.extenders.controllers, {
      data
    })
  })
}));