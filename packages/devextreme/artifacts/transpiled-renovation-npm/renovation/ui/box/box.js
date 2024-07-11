"use strict";

exports.viewFunction = exports.Box = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _widget = require("../common/widget");
var _box_props = require("./box_props");
var _combine_classes = require("../../utils/combine_classes");
const _excluded = ["align", "crossAlign", "direction"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const viewFunction = viewModel => (0, _inferno.createComponentVNode)(2, _widget.Widget, {
  "classes": viewModel.cssClasses,
  "style": (0, _inferno2.normalizeStyles)(viewModel.cssStyles)
});
exports.viewFunction = viewFunction;
class Box extends _inferno2.InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  get cssClasses() {
    return (0, _combine_classes.combineClasses)({
      'dx-box dx-box-flex': true
    });
  }
  get cssStyles() {
    const DIRECTION_MAP = {
      row: 'row',
      col: 'column'
    };
    const tryGetFromMap = (prop, map) => prop in map ? map[prop] : prop;
    return {
      display: 'flex',
      flexDirection: DIRECTION_MAP[this.props.direction],
      justifyContent: tryGetFromMap(this.props.align, {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        'space-between': 'space-between',
        'space-around': 'space-around'
      }),
      alignItems: tryGetFromMap(this.props.crossAlign, {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        stretch: 'stretch'
      })
    };
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
      cssStyles: this.cssStyles,
      restAttributes: this.restAttributes
    });
  }
}
exports.Box = Box;
Box.defaultProps = _box_props.BoxProps;