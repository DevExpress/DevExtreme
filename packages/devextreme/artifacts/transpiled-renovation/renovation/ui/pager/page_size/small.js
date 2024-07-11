"use strict";

exports.viewFunction = exports.PageSizeSmallProps = exports.PageSizeSmall = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _select_box = require("../../editors/drop_down_editors/select_box");
var _calculate_values_fitted_width = require("../utils/calculate_values_fitted_width");
var _get_element_width = require("../utils/get_element_width");
var _pager_props = require("../common/pager_props");
const _excluded = ["inputAttr", "pageSize", "pageSizeChange", "pageSizes", "parentRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const viewFunction = _ref => {
  let {
    props: {
      inputAttr,
      pageSize,
      pageSizeChange,
      pageSizes
    },
    width
  } = _ref;
  return (0, _inferno.createComponentVNode)(2, _select_box.SelectBox, {
    "displayExpr": "text",
    "valueExpr": "value",
    "dataSource": pageSizes,
    "value": pageSize,
    "valueChange": pageSizeChange,
    "width": width,
    "inputAttr": inputAttr
  });
};
exports.viewFunction = viewFunction;
const PageSizeSmallProps = exports.PageSizeSmallProps = {
  inputAttr: Object.freeze({
    'aria-label': _message.default.format('dxPager-ariaPageSize')
  })
};
const PageSizeSmallPropsType = {
  get pageSize() {
    return _pager_props.InternalPagerProps.pageSize;
  },
  get inputAttr() {
    return PageSizeSmallProps.inputAttr;
  }
};
class PageSizeSmall extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {
      minWidth: 10
    };
    this.updateWidth = this.updateWidth.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.updateWidth, [this.props, this.state.minWidth, this.props.pageSize, this.props.pageSizeChange, this.props.pageSizes, this.props.inputAttr])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props, this.state.minWidth, this.props.pageSize, this.props.pageSizeChange, this.props.pageSizes, this.props.inputAttr]);
  }
  updateWidth() {
    this.setState(__state_argument => ({
      minWidth: (0, _get_element_width.getElementMinWidth)(this.props.parentRef.current) || __state_argument.minWidth
    }));
  }
  get width() {
    return (0, _calculate_values_fitted_width.calculateValuesFittedWidth)(this.state.minWidth, this.props.pageSizes.map(p => p.value));
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
      width: this.width,
      restAttributes: this.restAttributes
    });
  }
}
exports.PageSizeSmall = PageSizeSmall;
PageSizeSmall.defaultProps = PageSizeSmallPropsType;