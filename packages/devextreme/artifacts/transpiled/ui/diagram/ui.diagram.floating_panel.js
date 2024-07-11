"use strict";

exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _window = require("../../core/utils/window");
var _ui = _interopRequireDefault(require("../popup/ui.popup"));
var _uiDiagram = _interopRequireDefault(require("./ui.diagram.panel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DIAGRAM_MOBILE_POPUP_CLASS = 'dx-diagram-mobile-popup';
class DiagramFloatingPanel extends _uiDiagram.default {
  _init() {
    super._init();
    this._createOnVisibilityChangingAction();
    this._createOnVisibilityChangedAction();
  }
  isVisible() {
    return this.option('isVisible');
  }
  isMobileView() {
    return this.option('isMobileView');
  }
  _initMarkup() {
    super._initMarkup();
    const $parent = this.$element();
    const $popupElement = (0, _renderer.default)('<div>').addClass(this._getPopupClass()).addClass(this.isMobileView() && DIAGRAM_MOBILE_POPUP_CLASS).appendTo($parent);
    this._popup = this._createComponent($popupElement, _ui.default, this._getPopupOptions());
    this._updatePopupVisible();
  }
  show() {
    this.option('isVisible', true);
  }
  hide() {
    this.option('isVisible', false);
  }
  toggle() {
    this.option('isVisible', !this.isVisible());
  }
  repaint() {
    this._popup.repaint();
  }
  _getPopupContent() {
    return this._popup.content();
  }
  _getPopupTitle() {
    const $content = (0, _renderer.default)(this._getPopupContent());
    return $content.parent().find('.dx-popup-title');
  }
  _getPointerUpElements() {
    return [this._getPopupContent(), this._getPopupTitle()];
  }
  _getVerticalPaddingsAndBorders() {
    const $content = (0, _renderer.default)(this._getPopupContent());
    return (0, _size.getOuterHeight)($content) - (0, _size.getHeight)($content);
  }
  _getHorizontalPaddingsAndBorders() {
    const $content = (0, _renderer.default)(this._getPopupContent());
    return (0, _size.getOuterWidth)($content) - (0, _size.getWidth)($content);
  }
  _getPopupClass() {
    return '';
  }
  _getPopupWidth() {
    return this.option('width') || 'auto';
  }
  _getPopupMaxWidth() {
    return this.option('maxWidth');
  }
  _getPopupMinWidth() {
    return this.option('minWidth');
  }
  _getPopupHeight() {
    return this.option('height') || 'auto';
  }
  _getPopupMaxHeight() {
    return this.option('maxHeight');
  }
  _getPopupMinHeight() {
    return this.option('minHeight');
  }
  _getPopupPosition() {
    return {};
  }
  _getPopupContainer() {
    return this.option('container');
  }
  _getPopupSlideAnimationObject(properties) {
    return (0, _extend.extend)({
      type: 'slide',
      start: () => {
        (0, _renderer.default)('body').css('overflow', 'hidden');
      },
      complete: () => {
        (0, _renderer.default)('body').css('overflow', '');
      }
    }, properties);
  }
  _getPopupAnimation() {
    return {
      hide: {
        type: 'fadeOut'
      },
      show: {
        type: 'fadeIn'
      }
    };
  }
  _getPopupOptions() {
    const that = this;
    return {
      animation: (0, _window.hasWindow)() ? this._getPopupAnimation() : null,
      shading: false,
      showTitle: false,
      focusStateEnabled: false,
      container: this._getPopupContainer(),
      width: this._getPopupWidth(),
      height: this._getPopupHeight(),
      maxWidth: this._getPopupMaxWidth(),
      maxHeight: this._getPopupMaxHeight(),
      minWidth: this._getPopupMinWidth(),
      minHeight: this._getPopupMinHeight(),
      position: this._getPopupPosition(),
      showCloseButton: true,
      copyRootClassesToWrapper: true,
      _ignoreCopyRootClassesToWrapperDeprecation: true,
      onContentReady: function () {
        that._renderPopupContent(that._popup.content());
      },
      onShowing: () => {
        this._onVisibilityChangingAction({
          visible: true,
          component: this
        });
      },
      onShown: () => {
        this.option('isVisible', true);
        this._onVisibilityChangedAction({
          visible: true,
          component: this
        });
      },
      onHiding: () => {
        this._onVisibilityChangingAction({
          visible: false,
          component: this
        });
      },
      onHidden: () => {
        this.option('isVisible', false);
        this._onVisibilityChangedAction({
          visible: false,
          component: this
        });
      }
    };
  }
  _renderPopupContent($parent) {}
  _updatePopupVisible() {
    this._popup.option('visible', this.isVisible());
  }
  _createOnVisibilityChangingAction() {
    this._onVisibilityChangingAction = this._createActionByOption('onVisibilityChanging');
  }
  _createOnVisibilityChangedAction() {
    this._onVisibilityChangedAction = this._createActionByOption('onVisibilityChanged');
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'onVisibilityChanging':
        this._createOnVisibilityChangingAction();
        break;
      case 'onVisibilityChanged':
        this._createOnVisibilityChangedAction();
        break;
      case 'container':
        this._popup.option('container', this._getPopupContainer());
        break;
      case 'width':
        this._popup.option('width', this._getPopupWidth());
        break;
      case 'height':
        this._popup.option('height', this._getPopupHeight());
        break;
      case 'maxWidth':
        this._popup.option('maxWidth', this._getPopupMaxWidth());
        break;
      case 'maxHeight':
        this._popup.option('maxHeight', this._getPopupMaxHeight());
        break;
      case 'minWidth':
        this._popup.option('minWidth', this._getPopupMinWidth());
        break;
      case 'minHeight':
        this._popup.option('minHeight', this._getPopupMinHeight());
        break;
      case 'isMobileView':
        this._invalidate();
        break;
      case 'isVisible':
        this._updatePopupVisible();
        break;
      default:
        super._optionChanged(args);
    }
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      isVisible: true,
      isMobileView: false,
      offsetX: 0,
      offsetY: 0
    });
  }
}
var _default = exports.default = DiagramFloatingPanel;
module.exports = exports.default;
module.exports.default = exports.default;