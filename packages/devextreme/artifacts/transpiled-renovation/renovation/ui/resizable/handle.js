"use strict";

exports.ResizableHandleProps = exports.ResizableHandle = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _drag = require("../../../events/drag");
var _index = require("../../../events/utils/index");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _utils = require("../../../core/options/utils");
const _excluded = ["direction", "disabled", "onResize", "onResizeEnd", "onResizeStart"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const namespace = 'dxResizable';
const dragStartEvent = (0, _index.addNamespace)(_drag.start, namespace);
const dragEvent = (0, _index.addNamespace)(_drag.move, namespace);
const dragEndEvent = (0, _index.addNamespace)(_drag.end, namespace);
const viewFunction = viewModel => {
  const {
    mainRef,
    props
  } = viewModel;
  const {
    direction
  } = props;
  return (0, _inferno.createVNode)(1, "div", `dx-resizable-handle dx-resizable-handle-${direction}`, null, 1, null, null, mainRef);
};
exports.viewFunction = viewFunction;
const ResizableHandleProps = exports.ResizableHandleProps = {
  direction: 'top',
  disabled: false
};
class ResizableHandle extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.mainRef = (0, _inferno.createRef)();
    this.dragEventsEffect = this.dragEventsEffect.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.dragEventsEffect, [this.props.disabled, this.props.onResize, this.props.onResizeEnd, this.props.onResizeStart])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.disabled, this.props.onResize, this.props.onResizeEnd, this.props.onResizeStart]);
  }
  dragEventsEffect() {
    const {
      disabled,
      onResize,
      onResizeEnd,
      onResizeStart
    } = this.props;
    if (!disabled) {
      const handleEl = this.mainRef.current;
      const opts = {
        direction: 'both',
        immediate: true
      };
      _events_engine.default.on(handleEl, {
        [dragStartEvent]: event => {
          _events_engine.default.on(handleEl, {
            [dragEvent]: onResize,
            [dragEndEvent]: onResizeEnd
          }, opts);
          onResizeStart === null || onResizeStart === void 0 || onResizeStart(event);
        }
      }, opts);
      return () => _events_engine.default.off(handleEl, undefined, undefined);
    }
    return undefined;
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
      mainRef: this.mainRef,
      restAttributes: this.restAttributes
    });
  }
}
exports.ResizableHandle = ResizableHandle;
ResizableHandle.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ResizableHandleProps), Object.getOwnPropertyDescriptors(_extends({}, (0, _utils.convertRulesToOptions)([])))));
const __defaultOptionRules = [];
function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  ResizableHandle.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(ResizableHandle.defaultProps), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)([])), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(__defaultOptionRules))));
}