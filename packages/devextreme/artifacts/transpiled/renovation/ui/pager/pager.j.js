"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _grid_pager = require("../../component_wrapper/grid_pager");
var _pager = require("./pager");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class Pager extends _grid_pager.GridPagerWrapper {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }
  get _propsInfo() {
    return {
      twoWay: [['pageSize', 'defaultPageSize', 'pageSizeChange'], ['pageIndex', 'defaultPageIndex', 'pageIndexChange']],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['defaultPageSize', 'pageSizeChange', 'defaultPageIndex', 'pageIndexChange', 'gridCompatibility', 'className', 'showInfo', 'infoText', 'lightModeEnabled', 'displayMode', 'maxPagesCount', 'pageCount', 'pagesCountText', 'visible', 'hasKnownLastPage', 'pagesNavigatorVisible', 'showPageSizes', 'pageSizes', 'rtlEnabled', 'showNavigationButtons', 'totalCount', 'label', 'onKeyDown', 'pageSize', 'pageIndex']
    };
  }
  get _viewComponent() {
    return _pager.Pager;
  }
}
exports.default = Pager;
(0, _component_registrator.default)('dxPager', Pager);
module.exports = exports.default;
module.exports.default = exports.default;