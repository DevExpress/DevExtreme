"use strict";

exports.viewFunction = exports.DroppableProps = exports.Droppable = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _drag = require("../../events/drag");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _combine_classes = require("../utils/combine_classes");
const _excluded = ["children", "className", "disabled", "onDragEnter", "onDragLeave", "onDrop"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = _ref => {
  let {
    cssClasses,
    props: {
      children
    },
    restAttributes,
    widgetRef
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "div", cssClasses, children, 0, _extends({}, restAttributes), null, widgetRef));
};
exports.viewFunction = viewFunction;
const DroppableProps = exports.DroppableProps = {
  disabled: false,
  className: ''
};
class Droppable extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.widgetRef = (0, _inferno.createRef)();
    this.dropEventsEffect = this.dropEventsEffect.bind(this);
    this.dragEnterHandler = this.dragEnterHandler.bind(this);
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
    this.getEventArgs = this.getEventArgs.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.dropEventsEffect, [this.props.disabled, this.props.onDragEnter, this.props.onDragLeave, this.props.onDrop])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.disabled, this.props.onDragEnter, this.props.onDragLeave, this.props.onDrop]);
  }
  dropEventsEffect() {
    if (this.props.disabled) {
      return undefined;
    }
    _events_engine.default.on(this.widgetRef.current, _drag.enter, this.dragEnterHandler);
    _events_engine.default.on(this.widgetRef.current, _drag.leave, this.dragLeaveHandler);
    _events_engine.default.on(this.widgetRef.current, _drag.drop, this.dropHandler);
    return () => {
      _events_engine.default.off(this.widgetRef.current, _drag.enter, this.dragEnterHandler);
      _events_engine.default.off(this.widgetRef.current, _drag.leave, this.dragLeaveHandler);
      _events_engine.default.off(this.widgetRef.current, _drag.drop, this.dropHandler);
    };
  }
  get cssClasses() {
    const {
      className,
      disabled
    } = this.props;
    const classesMap = {
      [className]: !!className,
      'dx-droppable': true,
      'dx-state-disabled': !!disabled
    };
    return (0, _combine_classes.combineClasses)(classesMap);
  }
  dragEnterHandler(event) {
    const dragEnterArgs = this.getEventArgs(event);
    const {
      onDragEnter
    } = this.props;
    onDragEnter === null || onDragEnter === void 0 || onDragEnter(dragEnterArgs);
  }
  dragLeaveHandler(event) {
    const dragLeaveArgs = this.getEventArgs(event);
    const {
      onDragLeave
    } = this.props;
    onDragLeave === null || onDragLeave === void 0 || onDragLeave(dragLeaveArgs);
  }
  dropHandler(event) {
    const dropArgs = this.getEventArgs(event);
    const {
      onDrop
    } = this.props;
    onDrop === null || onDrop === void 0 || onDrop(dropArgs);
  }
  getEventArgs(e) {
    return {
      event: e,
      itemElement: this.widgetRef.current
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
      widgetRef: this.widgetRef,
      cssClasses: this.cssClasses,
      dragEnterHandler: this.dragEnterHandler,
      dragLeaveHandler: this.dragLeaveHandler,
      dropHandler: this.dropHandler,
      getEventArgs: this.getEventArgs,
      restAttributes: this.restAttributes
    });
  }
}
exports.Droppable = Droppable;
Droppable.defaultProps = DroppableProps;