"use strict";

exports.BasePagerProps = void 0;
var _message = _interopRequireDefault(require("../../../../localization/message"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const BasePagerProps = exports.BasePagerProps = {
  gridCompatibility: true,
  showInfo: false,
  displayMode: 'adaptive',
  maxPagesCount: 10,
  pageCount: 10,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: 'auto',
  showPageSizes: true,
  pageSizes: Object.freeze([5, 10]),
  showNavigationButtons: false,
  totalCount: 0,
  get label() {
    return _message.default.format('dxPager-ariaLabel');
  }
};