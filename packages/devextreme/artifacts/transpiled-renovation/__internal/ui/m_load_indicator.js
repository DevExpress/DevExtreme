"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../core/devices"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _size = require("../../core/utils/size");
var _support = require("../../core/utils/support");
var _window = require("../../core/utils/window");
var _message = _interopRequireDefault(require("../../localization/message"));
var _themes = require("../../ui/themes");
var _ui = _interopRequireDefault(require("../../ui/widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

// @ts-expect-error

const navigator = (0, _window.getNavigator)();
const LOADINDICATOR_CLASS = 'dx-loadindicator';
const LOADINDICATOR_WRAPPER_CLASS = 'dx-loadindicator-wrapper';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';
const LOADINDICATOR_IMAGE_CLASS = 'dx-loadindicator-image';
// @ts-expect-error
const LoadIndicator = _ui.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      indicatorSrc: '',
      activeStateEnabled: false,
      hoverStateEnabled: false,
      _animatingSegmentCount: 1,
      _animatingSegmentInner: false
    });
  },
  _defaultOptionsRules() {
    const themeName = (0, _themes.current)();
    return this.callBase().concat([{
      device() {
        const realDevice = _devices.default.real();
        const obsoleteAndroid = realDevice.platform === 'android' && !/chrome/i.test(navigator.userAgent);
        return obsoleteAndroid;
      },
      options: {
        viaImage: true
      }
    }, {
      device() {
        return (0, _themes.isMaterialBased)(themeName);
      },
      options: {
        _animatingSegmentCount: 2,
        _animatingSegmentInner: true
      }
    }, {
      device() {
        return (0, _themes.isGeneric)(themeName);
      },
      options: {
        _animatingSegmentCount: 7
      }
    }]);
  },
  _useTemplates() {
    return false;
  },
  _init() {
    this.callBase();
    this.$element().addClass(LOADINDICATOR_CLASS);
    const label = _message.default.format('Loading');
    const aria = {
      role: 'alert',
      label
    };
    this.setAria(aria);
  },
  _initMarkup() {
    this.callBase();
    this._renderWrapper();
    this._renderIndicatorContent();
    this._renderMarkup();
  },
  _renderWrapper() {
    this._$wrapper = (0, _renderer.default)('<div>').addClass(LOADINDICATOR_WRAPPER_CLASS);
    this.$element().append(this._$wrapper);
  },
  _renderIndicatorContent() {
    this._$content = (0, _renderer.default)('<div>').addClass(LOADINDICATOR_CONTENT_CLASS);
    this._$wrapper.append(this._$content);
  },
  _renderMarkup() {
    const {
      viaImage,
      indicatorSrc
    } = this.option();
    if ((0, _support.animation)() && !viaImage && !indicatorSrc) {
      // B236922
      this._renderMarkupForAnimation();
    } else {
      this._renderMarkupForImage();
    }
  },
  _renderMarkupForAnimation() {
    const animatingSegmentInner = this.option('_animatingSegmentInner');
    this._$indicator = (0, _renderer.default)('<div>').addClass(LOADINDICATOR_ICON_CLASS);
    this._$content.append(this._$indicator);
    // Indicator markup
    for (let i = this.option('_animatingSegmentCount'); i >= 0; --i) {
      const $segment = (0, _renderer.default)('<div>').addClass(LOADINDICATOR_SEGMENT_CLASS).addClass(LOADINDICATOR_SEGMENT_CLASS + i);
      if (animatingSegmentInner) {
        $segment.append((0, _renderer.default)('<div>').addClass(LOADINDICATOR_SEGMENT_INNER_CLASS));
      }
      this._$indicator.append($segment);
    }
  },
  _renderMarkupForImage() {
    const {
      indicatorSrc
    } = this.option();
    if (indicatorSrc) {
      this._$wrapper.addClass(LOADINDICATOR_IMAGE_CLASS);
      this._$wrapper.css('backgroundImage', `url(${indicatorSrc})`);
    } else if ((0, _support.animation)()) {
      this._renderMarkupForAnimation();
    }
  },
  _renderDimensions() {
    this.callBase();
    this._updateContentSizeForAnimation();
  },
  _updateContentSizeForAnimation() {
    if (!this._$indicator) {
      return;
    }
    let width = this.option('width');
    let height = this.option('height');
    if (width || height) {
      width = (0, _size.getWidth)(this.$element());
      height = (0, _size.getHeight)(this.$element());
      const minDimension = Math.min(height, width);
      this._$wrapper.css({
        height: minDimension,
        width: minDimension,
        fontSize: minDimension
      });
    }
  },
  _clean() {
    this.callBase();
    this._removeMarkupForAnimation();
    this._removeMarkupForImage();
  },
  _removeMarkupForAnimation() {
    if (!this._$indicator) {
      return;
    }
    this._$indicator.remove();
    delete this._$indicator;
  },
  _removeMarkupForImage() {
    this._$wrapper.css('backgroundImage', 'none');
  },
  _optionChanged(args) {
    switch (args.name) {
      case '_animatingSegmentCount':
      case '_animatingSegmentInner':
      case 'indicatorSrc':
        this._invalidate();
        break;
      default:
        this.callBase(args);
    }
  }
});
(0, _component_registrator.default)('dxLoadIndicator', LoadIndicator);
var _default = exports.default = LoadIndicator;