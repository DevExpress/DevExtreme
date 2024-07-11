"use strict";

exports.viewFunction = exports.LayoutManager = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _combine_classes = require("../../utils/combine_classes");
var _widget = require("../common/widget");
var _responsive_box = require("../responsive_box/responsive_box");
var _layout_manager_props = require("./layout_manager_props");
const _excluded = ["screenByWidth"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = viewModel => {
  const {
    cssClasses,
    restAttributes
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "classes": cssClasses
  }, restAttributes, {
    children: (0, _inferno.createComponentVNode)(2, _responsive_box.ResponsiveBox, {
      "screenByWidth": viewModel.props.screenByWidth
    })
  })));
};
exports.viewFunction = viewFunction;
class LayoutManager extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get cssClasses() {
    return (0, _combine_classes.combineClasses)({
      'dx-layout-manager': true
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
      cssClasses: this.cssClasses,
      restAttributes: this.restAttributes
    });
  }
}
exports.LayoutManager = LayoutManager;
LayoutManager.defaultProps = _layout_manager_props.LayoutManagerProps;