"use strict";

exports.viewFunction = exports.ResponsiveBox = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _widget = require("../common/widget");
var _responsive_box_props = require("./responsive_box_props");
var _combine_classes = require("../../utils/combine_classes");
var _box = require("../box/box");
var _window = require("../../../core/utils/window");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _screen_utils = require("./screen_utils");
const _excluded = ["screenByWidth"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const HD_SCREEN_WIDTH = 1920;
const RESPONSIVE_BOX_CLASS = 'dx-responsivebox';
const SCREEN_SIZE_CLASS_PREFIX = `${RESPONSIVE_BOX_CLASS}-screen-`;
const viewFunction = viewModel => {
  const getCurrentScreenSizeQualifier = () => {
    const screenWidth = (0, _window.hasWindow)() ? _dom_adapter.default.getDocumentElement().clientWidth : HD_SCREEN_WIDTH;
    const screenSizeFunc = viewModel.props.screenByWidth ?? _screen_utils.convertToScreenSizeQualifier;
    return screenSizeFunc(screenWidth);
  };
  const screenSizeQualifier = getCurrentScreenSizeQualifier();
  const cssClasses = (0, _combine_classes.combineClasses)({
    [RESPONSIVE_BOX_CLASS]: true,
    [SCREEN_SIZE_CLASS_PREFIX + screenSizeQualifier]: true
  });
  return (0, _inferno.createComponentVNode)(2, _widget.Widget, {
    "classes": cssClasses,
    children: (0, _inferno.createComponentVNode)(2, _box.Box)
  });
};
exports.viewFunction = viewFunction;
class ResponsiveBox extends _inferno2.InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
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
      restAttributes: this.restAttributes
    });
  }
}
exports.ResponsiveBox = ResponsiveBox;
ResponsiveBox.defaultProps = _responsive_box_props.ResponsiveBoxProps;