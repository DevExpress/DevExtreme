"use strict";

exports.viewFunction = exports.DraggableContainerProps = exports.DraggableContainer = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _drag = require("../../../events/drag");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _combine_classes = require("../../utils/combine_classes");
const _excluded = ["children", "className", "data", "disabled", "onDragEnd", "onDragMove", "onDragStart"];
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
const DraggableContainerProps = exports.DraggableContainerProps = {
  className: ''
};
class DraggableContainer extends _inferno2.InfernoComponent {
  constructor(props) {
    super(props);
    this.widgetRef = (0, _inferno.createRef)();
    this.state = {
      isDragging: false
    };
    this.dragEffect = this.dragEffect.bind(this);
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragMoveHandler = this.dragMoveHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.getEventArgs = this.getEventArgs.bind(this);
  }
  createEffects() {
    return [new _inferno2.InfernoEffect(this.dragEffect, [this.props.disabled, this.props.data, this.props.onDragStart, this.props.onDragMove, this.props.onDragEnd])];
  }
  updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.disabled, this.props.data, this.props.onDragStart, this.props.onDragMove, this.props.onDragEnd]);
  }
  dragEffect() {
    if (this.props.disabled) {
      return undefined;
    }
    _events_engine.default.on(this.widgetRef.current, _drag.start, this.dragStartHandler);
    _events_engine.default.on(this.widgetRef.current, _drag.move, this.dragMoveHandler);
    _events_engine.default.on(this.widgetRef.current, _drag.end, this.dragEndHandler);
    return () => {
      _events_engine.default.off(this.widgetRef.current, _drag.start, this.dragStartHandler);
      _events_engine.default.off(this.widgetRef.current, _drag.move, this.dragMoveHandler);
      _events_engine.default.off(this.widgetRef.current, _drag.end, this.dragEndHandler);
    };
  }
  get cssClasses() {
    const {
      className,
      disabled
    } = this.props;
    const classesMap = {
      [className]: !!className,
      'dx-draggable': true,
      'dx-draggable-dragging': this.state.isDragging,
      'dx-state-disabled': !!disabled
    };
    return (0, _combine_classes.combineClasses)(classesMap);
  }
  dragStartHandler(event) {
    this.setState(__state_argument => ({
      isDragging: true
    }));
    const dragStartArgs = this.getEventArgs(event);
    const {
      onDragStart
    } = this.props;
    onDragStart === null || onDragStart === void 0 || onDragStart(dragStartArgs);
  }
  dragMoveHandler(event) {
    const dragMoveArgs = this.getEventArgs(event);
    const {
      onDragMove
    } = this.props;
    onDragMove === null || onDragMove === void 0 || onDragMove(dragMoveArgs);
  }
  dragEndHandler(event) {
    this.setState(__state_argument => ({
      isDragging: false
    }));
    const dragEndArgs = this.getEventArgs(event);
    const {
      onDragEnd
    } = this.props;
    onDragEnd === null || onDragEnd === void 0 || onDragEnd(dragEndArgs);
  }
  getEventArgs(e) {
    return {
      event: e,
      data: this.props.data,
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
      isDragging: this.state.isDragging,
      widgetRef: this.widgetRef,
      cssClasses: this.cssClasses,
      dragStartHandler: this.dragStartHandler,
      dragMoveHandler: this.dragMoveHandler,
      dragEndHandler: this.dragEndHandler,
      getEventArgs: this.getEventArgs,
      restAttributes: this.restAttributes
    });
  }
}
exports.DraggableContainer = DraggableContainer;
DraggableContainer.defaultProps = DraggableContainerProps;