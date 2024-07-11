"use strict";

exports.viewFunction = exports.Form = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _form_props = require("./form_props");
var _combine_classes = require("../../utils/combine_classes");
var _widget = require("../common/widget");
var _layout_manager = require("./layout_manager");
var _scrollable = require("../scroll_view/scrollable");
const _excluded = ["screenByWidth", "scrollingEnabled", "useNativeScrolling"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = viewModel => {
  const aria = {
    role: 'form'
  };
  const cssClasses = (0, _combine_classes.combineClasses)({
    'dx-form': true
  });
  const {
    props: {
      scrollingEnabled,
      useNativeScrolling
    },
    restAttributes
  } = viewModel;
  const rootLayoutManager = (0, _inferno.createComponentVNode)(2, _layout_manager.LayoutManager, {
    "screenByWidth": viewModel.props.screenByWidth
  });
  return scrollingEnabled ? (0, _inferno.createComponentVNode)(2, _scrollable.Scrollable, {
    "aria": aria,
    "classes": cssClasses,
    "useNative": !!useNativeScrolling,
    "useSimulatedScrollbar": !useNativeScrolling,
    "useKeyboard": false,
    "direction": "both",
    "bounceEnabled": false,
    children: rootLayoutManager
  }) : (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "aria": aria,
    "classes": cssClasses
  }, restAttributes, {
    children: rootLayoutManager
  })));
};
exports.viewFunction = viewFunction;
class Form extends _inferno2.InfernoWrapperComponent {
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
exports.Form = Form;
Form.defaultProps = _form_props.FormProps;