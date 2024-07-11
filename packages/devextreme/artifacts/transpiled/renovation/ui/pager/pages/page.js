"use strict";

exports.viewFunction = exports.PageProps = exports.Page = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _light_button = require("../common/light_button");
var _consts = require("../common/consts");
var _combine_classes = require("../../../utils/combine_classes");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _string = require("../../../../core/utils/string");
const _excluded = ["className", "index", "onClick", "selected"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const viewFunction = _ref => {
  let {
    className,
    label,
    props: {
      onClick,
      selected
    },
    value
  } = _ref;
  return (0, _inferno.createComponentVNode)(2, _light_button.LightButton, {
    "className": className,
    "label": label,
    "onClick": onClick,
    "selected": selected,
    children: value
  });
};
exports.viewFunction = viewFunction;
const PageProps = exports.PageProps = {
  index: 0,
  selected: false,
  className: _consts.PAGER_PAGE_CLASS
};
class Page extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get label() {
    return (0, _string.format)(_message.default.getFormatter('dxPager-page'), this.value);
  }
  get value() {
    return this.props.index + 1;
  }
  get className() {
    const {
      selected
    } = this.props;
    return (0, _combine_classes.combineClasses)({
      [`${this.props.className}`]: !!this.props.className,
      [_consts.PAGER_SELECTION_CLASS]: !!selected
    });
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
      label: this.label,
      value: this.value,
      className: this.className,
      restAttributes: this.restAttributes
    });
  }
}
exports.Page = Page;
Page.defaultProps = PageProps;