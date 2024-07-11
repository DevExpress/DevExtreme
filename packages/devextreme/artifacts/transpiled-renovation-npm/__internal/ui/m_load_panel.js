"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _message = _interopRequireDefault(require("../../localization/message"));
var _load_indicator = _interopRequireDefault(require("../../ui/load_indicator"));
var _ui = _interopRequireDefault(require("../../ui/overlay/ui.overlay"));
var _themes = require("../../ui/themes");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LOADPANEL_CLASS = 'dx-loadpanel';
const LOADPANEL_WRAPPER_CLASS = 'dx-loadpanel-wrapper';
const LOADPANEL_INDICATOR_CLASS = 'dx-loadpanel-indicator';
const LOADPANEL_MESSAGE_CLASS = 'dx-loadpanel-message';
const LOADPANEL_CONTENT_CLASS = 'dx-loadpanel-content';
const LOADPANEL_CONTENT_WRAPPER_CLASS = 'dx-loadpanel-content-wrapper';
const LOADPANEL_PANE_HIDDEN_CLASS = 'dx-loadpanel-pane-hidden';
// @ts-expect-error
const LoadPanel = _ui.default.inherit({
  _supportedKeys() {
    return (0, _extend.extend)(this.callBase(), {
      escape: _common.noop
    });
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      message: _message.default.format('Loading'),
      width: 222,
      height: 90,
      animation: null,
      showIndicator: true,
      indicatorSrc: '',
      showPane: true,
      delay: 0,
      templatesRenderAsynchronously: false,
      hideTopOverlayHandler: null,
      focusStateEnabled: false,
      propagateOutsideClick: true,
      preventScrollEvents: false
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        platform: 'generic'
      },
      options: {
        shadingColor: 'transparent'
      }
    }, {
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterial)();
      },
      options: {
        message: '',
        width: 60,
        height: 60,
        maxHeight: 60,
        maxWidth: 60
      }
    }, {
      device() {
        // @ts-expect-error
        return (0, _themes.isFluent)();
      },
      options: {
        width: 'auto',
        height: 'auto'
      }
    }]);
  },
  _init() {
    this.callBase.apply(this, arguments);
  },
  _render() {
    this.callBase();
    this.$element().addClass(LOADPANEL_CLASS);
    this.$wrapper().addClass(LOADPANEL_WRAPPER_CLASS);
    this._updateWrapperAria();
  },
  _updateWrapperAria() {
    this.$wrapper().removeAttr('aria-label').removeAttr('role');
    const showIndicator = this.option('showIndicator');
    if (!showIndicator) {
      const aria = this._getAriaAttributes();
      this.$wrapper().attr(aria);
    }
  },
  _getAriaAttributes() {
    const {
      message
    } = this.option();
    const label = message || _message.default.format('Loading');
    const aria = {
      role: 'alert',
      'aria-label': label
    };
    return aria;
  },
  _renderContentImpl() {
    this.callBase();
    this.$content().addClass(LOADPANEL_CONTENT_CLASS);
    this._$loadPanelContentWrapper = (0, _renderer.default)('<div>').addClass(LOADPANEL_CONTENT_WRAPPER_CLASS);
    this._$loadPanelContentWrapper.appendTo(this.$content());
    this._togglePaneVisible();
    this._cleanPreviousContent();
    this._renderLoadIndicator();
    this._renderMessage();
  },
  _show() {
    const delay = this.option('delay');
    if (!delay) {
      return this.callBase();
    }
    const deferred = (0, _deferred.Deferred)();
    const callBase = this.callBase.bind(this);
    this._clearShowTimeout();
    this._showTimeout = setTimeout(() => {
      callBase().done(() => {
        deferred.resolve();
      });
    }, delay);
    return deferred.promise();
  },
  _hide() {
    this._clearShowTimeout();
    return this.callBase();
  },
  _clearShowTimeout() {
    clearTimeout(this._showTimeout);
  },
  _renderMessage() {
    if (!this._$loadPanelContentWrapper) {
      return;
    }
    const message = this.option('message');
    if (!message) return;
    const $message = (0, _renderer.default)('<div>').addClass(LOADPANEL_MESSAGE_CLASS).text(message);
    this._$loadPanelContentWrapper.append($message);
  },
  _renderLoadIndicator() {
    if (!this._$loadPanelContentWrapper || !this.option('showIndicator')) {
      return;
    }
    if (!this._$indicator) {
      this._$indicator = (0, _renderer.default)('<div>').addClass(LOADPANEL_INDICATOR_CLASS).appendTo(this._$loadPanelContentWrapper);
    }
    this._createComponent(this._$indicator, _load_indicator.default, {
      elementAttr: this._getAriaAttributes(),
      indicatorSrc: this.option('indicatorSrc')
    });
  },
  _cleanPreviousContent() {
    this.$content().find(`.${LOADPANEL_MESSAGE_CLASS}`).remove();
    this.$content().find(`.${LOADPANEL_INDICATOR_CLASS}`).remove();
    delete this._$indicator;
  },
  _togglePaneVisible() {
    this.$content().toggleClass(LOADPANEL_PANE_HIDDEN_CLASS, !this.option('showPane'));
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'delay':
        break;
      case 'message':
      case 'showIndicator':
        this._cleanPreviousContent();
        this._renderLoadIndicator();
        this._renderMessage();
        this._updateWrapperAria();
        break;
      case 'showPane':
        this._togglePaneVisible();
        break;
      case 'indicatorSrc':
        this._renderLoadIndicator();
        break;
      default:
        this.callBase(args);
    }
  },
  _dispose() {
    this._clearShowTimeout();
    this.callBase();
  }
});
(0, _component_registrator.default)('dxLoadPanel', LoadPanel);
var _default = exports.default = LoadPanel;