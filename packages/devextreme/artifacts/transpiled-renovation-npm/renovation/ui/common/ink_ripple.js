"use strict";

exports.viewFunction = exports.InkRippleProps = exports.InkRipple = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _utils = require("../../../ui/widget/utils.ink_ripple");
const _excluded = ["config"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = model => (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "div", "dx-inkripple", null, 1, _extends({}, model.restAttributes)));
exports.viewFunction = viewFunction;
const InkRippleProps = exports.InkRippleProps = {
  config: Object.freeze({})
};
class InkRipple extends _inferno2.BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
    this.hideWave = this.hideWave.bind(this);
    this.showWave = this.showWave.bind(this);
  }
  get getConfig() {
    if (this.__getterCache['getConfig'] !== undefined) {
      return this.__getterCache['getConfig'];
    }
    return this.__getterCache['getConfig'] = (() => {
      const {
        config
      } = this.props;
      return (0, _utils.initConfig)(config);
    })();
  }
  get restAttributes() {
    const _this$props = this.props,
      restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }
  hideWave(opts) {
    (0, _utils.hideWave)(this.getConfig, opts);
  }
  showWave(opts) {
    (0, _utils.showWave)(this.getConfig, opts);
  }
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['config'] !== nextProps['config']) {
      this.__getterCache['getConfig'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      getConfig: this.getConfig,
      restAttributes: this.restAttributes
    });
  }
}
exports.InkRipple = InkRipple;
InkRipple.defaultProps = InkRippleProps;