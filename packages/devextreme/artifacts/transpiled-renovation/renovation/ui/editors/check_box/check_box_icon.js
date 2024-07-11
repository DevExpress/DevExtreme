"use strict";

exports.viewFunction = exports.CheckBoxIconProps = exports.CheckBoxIcon = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _get_computed_style = _interopRequireDefault(require("../../../utils/get_computed_style"));
var _window = require("../../../../core/utils/window");
var _style = require("../../../../core/utils/style");
var _type = require("../../../../core/utils/type");
var _utils = require("./utils");
const _excluded = ["isChecked", "size"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const viewFunction = viewModel => {
  const {
    cssStyles,
    elementRef
  } = viewModel;
  return (0, _inferno.createVNode)(1, "span", "dx-checkbox-icon", null, 1, {
    "style": (0, _inferno2.normalizeStyles)(cssStyles)
  }, null, elementRef);
};
exports.viewFunction = viewFunction;
const CheckBoxIconProps = exports.CheckBoxIconProps = {
  isChecked: false
};
class CheckBoxIcon extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.elementRef = (0, _inferno.createRef)();
    this.__getterCache = {};
    this.updateFontSize = this.updateFontSize.bind(this);
    this.setIconFontSize = this.setIconFontSize.bind(this);
    this.getIconSize = this.getIconSize.bind(this);
    this.getComputedIconSize = this.getComputedIconSize.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.updateFontSize, [this.props.isChecked, this.props.size])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.isChecked, this.props.size]);
  }
  updateFontSize() {
    const {
      isChecked,
      size
    } = this.props;
    if ((0, _window.hasWindow)() && size) {
      const newIconSize = this.getIconSize(size);
      const newFontSize = (0, _utils.getFontSizeByIconSize)(newIconSize, isChecked);
      this.setIconFontSize(newFontSize);
    }
  }
  setIconFontSize(fontSize) {
    const element = this.elementRef.current;
    element.style.fontSize = `${fontSize}px`;
  }
  getIconSize(size) {
    if ((0, _type.isNumeric)(size)) {
      return size;
    }
    if (size.endsWith('px')) {
      return parseInt(size, 10);
    }
    return this.getComputedIconSize();
  }
  getComputedIconSize() {
    const element = this.elementRef.current;
    const iconComputedStyle = (0, _get_computed_style.default)(element);
    const computedIconSize = parseInt(iconComputedStyle === null || iconComputedStyle === void 0 ? void 0 : iconComputedStyle.width, 10);
    return computedIconSize;
  }
  get cssStyles() {
    if (this.__getterCache['cssStyles'] !== undefined) {
      return this.__getterCache['cssStyles'];
    }
    return this.__getterCache['cssStyles'] = (() => {
      const {
        size
      } = this.props;
      const width = (0, _style.normalizeStyleProp)('width', size);
      const height = (0, _style.normalizeStyleProp)('height', size);
      return {
        height,
        width
      };
    })();
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();
    if (this.props['size'] !== nextProps['size']) {
      this.__getterCache['cssStyles'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      elementRef: this.elementRef,
      setIconFontSize: this.setIconFontSize,
      getIconSize: this.getIconSize,
      getComputedIconSize: this.getComputedIconSize,
      cssStyles: this.cssStyles,
      restAttributes: this.restAttributes
    });
  }
}
exports.CheckBoxIcon = CheckBoxIcon;
CheckBoxIcon.defaultProps = CheckBoxIconProps;