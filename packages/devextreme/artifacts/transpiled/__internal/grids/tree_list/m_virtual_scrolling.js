"use strict";

var _extend = require("../../../core/utils/extend");
var _m_virtual_scrolling = require("../../grids/grid_core/virtual_scrolling/m_virtual_scrolling");
var _m_data_source_adapter = _interopRequireDefault(require("./data_source_adapter/m_data_source_adapter"));
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable max-classes-per-file */
const oldDefaultOptions = _m_virtual_scrolling.virtualScrollingModule.defaultOptions;
_m_virtual_scrolling.virtualScrollingModule.extenders.controllers.data = Base => class TreeListVirtualScrollingDataControllerExtender extends (0, _m_virtual_scrolling.data)(Base) {
  _loadOnOptionChange() {
    var _this$_dataSource;
    const virtualScrollController = (_this$_dataSource = this._dataSource) === null || _this$_dataSource === void 0 ? void 0 : _this$_dataSource._virtualScrollController;
    virtualScrollController === null || virtualScrollController === void 0 || virtualScrollController.reset();
    // @ts-expect-error
    super._loadOnOptionChange();
  }
};
const dataSourceAdapterExtender = Base => class VirtualScrollingDataSourceAdapterExtender extends (0, _m_virtual_scrolling.dataSourceAdapterExtender)(Base) {
  changeRowExpand() {
    return super.changeRowExpand.apply(this, arguments).done(() => {
      const viewportItemIndex = this.getViewportItemIndex();
      viewportItemIndex >= 0 && this.setViewportItemIndex(viewportItemIndex);
    });
  }
};
_m_core.default.registerModule('virtualScrolling', _extends({}, _m_virtual_scrolling.virtualScrollingModule, {
  defaultOptions() {
    return (0, _extend.extend)(true, oldDefaultOptions(), {
      scrolling: {
        mode: 'virtual'
      }
    });
  }
}));
_m_data_source_adapter.default.extend(dataSourceAdapterExtender);