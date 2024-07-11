"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _translator = require("../../../../animation/translator");
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _position = require("../../../../core/utils/position");
var _size = require("../../../../core/utils/size");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _index = require("../../../../events/utils/index");
var _resizable = _interopRequireDefault(require("../../../../ui/resizable"));
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _m_base = _interopRequireDefault(require("./m_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DX_RESIZE_FRAME_CLASS = 'dx-resize-frame';
const DX_TOUCH_DEVICE_CLASS = 'dx-touch-device';
const MODULE_NAMESPACE = 'dxHtmlResizingModule';
const KEYDOWN_EVENT = (0, _index.addNamespace)('keydown', MODULE_NAMESPACE);
const SCROLL_EVENT = (0, _index.addNamespace)('scroll', MODULE_NAMESPACE);
const MOUSEDOWN_EVENT = (0, _index.addNamespace)('mousedown', MODULE_NAMESPACE);
const FRAME_PADDING = 1;
class ResizingModule extends _m_base.default {
  constructor(quill, options) {
    // @ts-expect-error
    super(quill, options);
    this.allowedTargets = options.allowedTargets || ['image'];
    this.enabled = !!options.enabled;
    this._hideFrameWithContext = this.hideFrame.bind(this);
    this._framePositionChangedHandler = this._prepareFramePositionChangedHandler();
    if (this.enabled) {
      this._attachEvents();
      this._createResizeFrame();
    }
  }
  _attachEvents() {
    _events_engine.default.on(this.quill.root, (0, _index.addNamespace)(_click.name, MODULE_NAMESPACE), this._clickHandler.bind(this));
    _events_engine.default.on(this.quill.root, SCROLL_EVENT, this._framePositionChangedHandler);
    this.editorInstance.on('focusOut', this._hideFrameWithContext);
    this.quill.on('text-change', this._framePositionChangedHandler);
  }
  _detachEvents() {
    _events_engine.default.off(this.quill.root, `.${MODULE_NAMESPACE}`);
    this.editorInstance.off('focusOut', this._hideFrameWithContext);
    this.quill.off('text-change', this._framePositionChangedHandler);
  }
  _clickHandler(e) {
    if (this._isAllowedTarget(e.target)) {
      if (this._$target === e.target) {
        return;
      }
      this._$target = e.target;
      const $target = (0, _renderer.default)(this._$target);
      // @ts-expect-error
      const minWidth = Math.max((0, _size.getOuterWidth)($target) - (0, _size.getWidth)($target), this.resizable.option('minWidth'));
      // @ts-expect-error
      const minHeight = Math.max((0, _size.getOuterHeight)($target) - (0, _size.getHeight)($target), this.resizable.option('minHeight'));
      this.resizable.option({
        minWidth,
        minHeight
      });
      this.updateFramePosition();
      this.showFrame();
      this._adjustSelection();
    } else if (this._$target) {
      this.hideFrame();
    }
  }
  _prepareFramePositionChangedHandler() {
    return () => {
      if (this._$target) {
        this.updateFramePosition();
      }
    };
  }
  _adjustSelection() {
    if (!this.quill.getSelection()) {
      this.quill.setSelection(0, 0);
    }
  }
  _isAllowedTarget(targetElement) {
    return this._isImage(targetElement);
  }
  _isImage(targetElement) {
    return this.allowedTargets.indexOf('image') !== -1 && targetElement.tagName.toUpperCase() === 'IMG';
  }
  showFrame() {
    this._$resizeFrame.show();
    _events_engine.default.on(this.quill.root, KEYDOWN_EVENT, this._handleFrameKeyDown.bind(this));
  }
  _handleFrameKeyDown(e) {
    const keyName = (0, _index.normalizeKeyName)(e);
    if (keyName === 'del' || keyName === 'backspace') {
      this._deleteImage();
    }
    this.hideFrame();
  }
  hideFrame() {
    // @ts-expect-error
    this._$target = null;
    this._$resizeFrame.hide();
    _events_engine.default.off(this.quill.root, KEYDOWN_EVENT);
  }
  updateFramePosition() {
    const {
      height,
      width,
      top: targetTop,
      left: targetLeft
    } = (0, _position.getBoundingRect)(this._$target);
    const {
      top: containerTop,
      left: containerLeft
    } = (0, _position.getBoundingRect)(this.quill.root);
    const borderWidth = this._getBorderWidth();
    this._$resizeFrame
    // @ts-expect-error
    .css({
      height,
      width,
      padding: FRAME_PADDING,
      top: targetTop - containerTop - borderWidth - FRAME_PADDING,
      left: targetLeft - containerLeft - borderWidth - FRAME_PADDING
    });
    (0, _translator.move)(this._$resizeFrame, {
      left: 0,
      top: 0
    });
  }
  _getBorderWidth() {
    // @ts-expect-error
    // eslint-disable-next-line radix
    return parseInt(this._$resizeFrame.css('borderTopWidth'));
  }
  _createResizeFrame() {
    if (this._$resizeFrame) {
      return;
    }
    const {
      deviceType
    } = _devices.default.current();
    this._$resizeFrame = (0, _renderer.default)('<div>').addClass(DX_RESIZE_FRAME_CLASS).toggleClass(DX_TOUCH_DEVICE_CLASS, deviceType !== 'desktop').appendTo(this.editorInstance._getQuillContainer()).hide();
    _events_engine.default.on(this._$resizeFrame, MOUSEDOWN_EVENT, e => {
      e.preventDefault();
    });
    this.resizable = this.editorInstance._createComponent(this._$resizeFrame, _resizable.default, {
      onResize: e => {
        if (!this._$target) {
          return;
        }
        // @ts-expect-error
        (0, _renderer.default)(this._$target).attr({
          height: e.height,
          width: e.width
        });
        this.updateFramePosition();
      }
    });
  }
  _deleteImage() {
    if (this._isAllowedTarget(this._$target)) {
      var _Quill$find;
      (_Quill$find = _devextremeQuill.default.find(this._$target)) === null || _Quill$find === void 0 || _Quill$find.deleteAt(0);
    }
  }
  option(option, value) {
    if (option === 'mediaResizing') {
      // @ts-expect-error
      this.handleOptionChangeValue(value);
      return;
    }
    if (option === 'enabled') {
      if (this.enabled === value) {
        return;
      }
      this.enabled = value;
      if (value) {
        this._attachEvents();
        this._createResizeFrame();
      } else {
        this.clean();
      }
    } else if (option === 'allowedTargets' && Array.isArray(value)) {
      this.allowedTargets = value;
    }
  }
  clean() {
    this._detachEvents();
    this._$resizeFrame.remove();
    // @ts-expect-error
    this._$resizeFrame = undefined;
  }
}
exports.default = ResizingModule;