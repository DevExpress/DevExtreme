"use strict";

exports.viewFunction = exports.PagesSmall = exports.PagerSmallProps = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _page = require("./page");
var _info = require("../info");
var _number_box = require("../../editors/number_box");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _calculate_values_fitted_width = require("../utils/calculate_values_fitted_width");
var _get_element_width = require("../utils/get_element_width");
var _pager_props = require("../common/pager_props");
const _excluded = ["inputAttr", "pageCount", "pageIndex", "pageIndexChange", "pagesCountText"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const PAGER_INFO_TEXT_CLASS = `${_info.PAGER_INFO_CLASS}  dx-info-text`;
const PAGER_PAGE_INDEX_CLASS = 'dx-page-index';
const LIGHT_PAGES_CLASS = 'dx-light-pages';
const PAGER_PAGES_COUNT_CLASS = 'dx-pages-count';
const viewFunction = _ref => {
  let {
    pageIndexRef,
    pagesCountText,
    props: {
      inputAttr,
      pageCount
    },
    selectLastPageIndex,
    value,
    valueChange,
    width
  } = _ref;
  return (0, _inferno.createVNode)(1, "div", LIGHT_PAGES_CLASS, [(0, _inferno.createComponentVNode)(2, _number_box.NumberBox, {
    "className": PAGER_PAGE_INDEX_CLASS,
    "min": 1,
    "max": Math.max(pageCount, value),
    "width": width,
    "value": value,
    "valueChange": valueChange,
    "inputAttr": inputAttr
  }), (0, _inferno.createVNode)(1, "span", PAGER_INFO_TEXT_CLASS, pagesCountText, 0), (0, _inferno.createComponentVNode)(2, _page.Page, {
    "className": PAGER_PAGES_COUNT_CLASS,
    "selected": false,
    "index": pageCount - 1,
    "onClick": selectLastPageIndex
  })], 4, null, null, pageIndexRef);
};
exports.viewFunction = viewFunction;
const PagerSmallProps = exports.PagerSmallProps = {
  inputAttr: Object.freeze({
    'aria-label': _message.default.format('dxPager-ariaPageNumber')
  })
};
const PagerSmallPropsType = {
  get pageIndex() {
    return _pager_props.InternalPagerProps.pageIndex;
  },
  get pageCount() {
    return _pager_props.InternalPagerProps.pageCount;
  },
  get inputAttr() {
    return PagerSmallProps.inputAttr;
  }
};
class PagesSmall extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.pageIndexRef = (0, _inferno.createRef)();
    this.state = {
      minWidth: 10
    };
    this.updateWidth = this.updateWidth.bind(this);
    this.selectLastPageIndex = this.selectLastPageIndex.bind(this);
    this.valueChange = this.valueChange.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.updateWidth, [this.state.minWidth])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.state.minWidth]);
  }
  updateWidth() {
    var _this$pageIndexRef$cu;
    const el = (_this$pageIndexRef$cu = this.pageIndexRef.current) === null || _this$pageIndexRef$cu === void 0 ? void 0 : _this$pageIndexRef$cu.querySelector(`.${PAGER_PAGE_INDEX_CLASS}`);
    this.setState(__state_argument => ({
      minWidth: el && (0, _get_element_width.getElementMinWidth)(el) || __state_argument.minWidth
    }));
  }
  get value() {
    return this.props.pageIndex + 1;
  }
  get width() {
    const {
      pageCount
    } = this.props;
    return (0, _calculate_values_fitted_width.calculateValuesFittedWidth)(this.state.minWidth, [pageCount]);
  }
  get pagesCountText() {
    return (this.props.pagesCountText ?? '') || _message.default.getFormatter('dxPager-pagesCountText')();
  }
  selectLastPageIndex() {
    this.props.pageIndexChange(this.props.pageCount - 1);
  }
  valueChange(value) {
    this.props.pageIndexChange(value - 1);
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      pageIndexRef: this.pageIndexRef,
      value: this.value,
      width: this.width,
      pagesCountText: this.pagesCountText,
      selectLastPageIndex: this.selectLastPageIndex,
      valueChange: this.valueChange,
      restAttributes: this.restAttributes
    });
  }
}
exports.PagesSmall = PagesSmall;
PagesSmall.defaultProps = PagerSmallPropsType;