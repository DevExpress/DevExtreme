"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopupPositionController = void 0;
var _translator = require("../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _view_port = require("../../../core/utils/view_port");
var _window = require("../../../core/utils/window");
var _m_overlay_position_controller = require("../../ui/overlay/m_overlay_position_controller");
const _excluded = ["fullScreen", "forceApplyBindings", "dragOutsideBoundary", "dragAndResizeArea", "outsideDragFactor"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
const window = (0, _window.getWindow)();
class PopupPositionController extends _m_overlay_position_controller.OverlayPositionController {
  constructor(_ref) {
    let {
        fullScreen,
        forceApplyBindings,
        dragOutsideBoundary,
        dragAndResizeArea,
        outsideDragFactor
      } = _ref,
      args = _objectWithoutPropertiesLoose(_ref, _excluded);
    // @ts-expect-error
    super(args);
    this._props = _extends({}, this._props, {
      fullScreen,
      forceApplyBindings,
      dragOutsideBoundary,
      dragAndResizeArea,
      outsideDragFactor
    });
    this._$dragResizeContainer = undefined;
    this._updateDragResizeContainer();
  }
  set fullScreen(fullScreen) {
    this._props.fullScreen = fullScreen;
    if (fullScreen) {
      this._fullScreenEnabled();
    } else {
      this._fullScreenDisabled();
    }
  }
  get $dragResizeContainer() {
    return this._$dragResizeContainer;
  }
  get outsideDragFactor() {
    if (this._props.dragOutsideBoundary) {
      return 1;
    }
    return this._props.outsideDragFactor;
  }
  set dragAndResizeArea(dragAndResizeArea) {
    this._props.dragAndResizeArea = dragAndResizeArea;
    this._updateDragResizeContainer();
  }
  set dragOutsideBoundary(dragOutsideBoundary) {
    this._props.dragOutsideBoundary = dragOutsideBoundary;
    this._updateDragResizeContainer();
  }
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures, grouped-accessor-pairs
  set outsideDragFactor(outsideDragFactor) {
    this._props.outsideDragFactor = outsideDragFactor;
  }
  updateContainer(containerProp) {
    super.updateContainer(containerProp);
    this._updateDragResizeContainer();
  }
  dragHandled() {
    this.restorePositionOnNextRender(false);
  }
  resizeHandled() {
    this.restorePositionOnNextRender(false);
  }
  positionContent() {
    if (this._props.fullScreen) {
      (0, _translator.move)(this._$content, {
        top: 0,
        left: 0
      });
      this.detectVisualPositionChange();
    } else {
      var _this$_props$forceApp, _this$_props;
      (_this$_props$forceApp = (_this$_props = this._props).forceApplyBindings) === null || _this$_props$forceApp === void 0 || _this$_props$forceApp.call(_this$_props);
      super.positionContent();
    }
  }
  _updateDragResizeContainer() {
    this._$dragResizeContainer = this._getDragResizeContainer();
  }
  _getDragResizeContainer() {
    if (this._props.dragOutsideBoundary) {
      // @ts-expect-error
      return (0, _renderer.default)(window);
    }
    if (this._props.dragAndResizeArea) {
      return (0, _renderer.default)(this._props.dragAndResizeArea);
    }
    const isContainerDefined = (0, _view_port.originalViewPort)().get(0) || this._props.container;
    return isContainerDefined ? this._$markupContainer
    // @ts-expect-error
    : (0, _renderer.default)(window);
  }
  _getVisualContainer() {
    if (this._props.fullScreen) {
      // @ts-expect-error
      return (0, _renderer.default)(window);
    }
    return super._getVisualContainer();
  }
  _fullScreenEnabled() {
    this.restorePositionOnNextRender(false);
  }
  _fullScreenDisabled() {
    this.restorePositionOnNextRender(true);
  }
}
exports.PopupPositionController = PopupPositionController;