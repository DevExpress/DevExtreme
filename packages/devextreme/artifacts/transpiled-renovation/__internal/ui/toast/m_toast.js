"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _ready_callbacks = _interopRequireDefault(require("../../../core/utils/ready_callbacks"));
var _type = require("../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _pointer = _interopRequireDefault(require("../../../events/pointer"));
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _themes = require("../../../ui/themes");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ready = _ready_callbacks.default.add;
const TOAST_CLASS = 'dx-toast';
const TOAST_CLASS_PREFIX = `${TOAST_CLASS}-`;
const TOAST_WRAPPER_CLASS = `${TOAST_CLASS_PREFIX}wrapper`;
const TOAST_CONTENT_CLASS = `${TOAST_CLASS_PREFIX}content`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS_PREFIX}message`;
const TOAST_ICON_CLASS = `${TOAST_CLASS_PREFIX}icon`;
const WIDGET_NAME = 'dxToast';
const toastTypes = ['info', 'warning', 'error', 'success'];
const TOAST_STACK = [];
const FIRST_Z_INDEX_OFFSET = 8000;
const POSITION_ALIASES = {
  top: {
    my: 'top',
    at: 'top',
    of: null,
    offset: '0 0'
  },
  bottom: {
    my: 'bottom',
    at: 'bottom',
    of: null,
    offset: '0 -20'
  },
  center: {
    my: 'center',
    at: 'center',
    of: null,
    offset: '0 0'
  },
  right: {
    my: 'center right',
    at: 'center right',
    of: null,
    offset: '0 0'
  },
  left: {
    my: 'center left',
    at: 'center left',
    of: null,
    offset: '0 0'
  }
};
const DEFAULT_BOUNDARY_OFFSET = {
  h: 0,
  v: 0
};
const DEFAULT_MARGIN = 20;
ready(() => {
  // @ts-expect-error
  _events_engine.default.subscribeGlobal(_dom_adapter.default.getDocument(), _pointer.default.down, e => {
    for (let i = TOAST_STACK.length - 1; i >= 0; i--) {
      // @ts-expect-error
      if (!TOAST_STACK[i]._proxiedDocumentDownHandler(e)) {
        return;
      }
    }
  });
});
// @ts-expect-error
const Toast = _ui.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      message: '',
      type: 'info',
      displayTime: 2000,
      position: 'bottom center',
      animation: {
        show: {
          type: 'fade',
          duration: 400,
          from: 0,
          to: 1
        },
        hide: {
          type: 'fade',
          duration: 400,
          from: 1,
          to: 0
        }
      },
      shading: false,
      height: 'auto',
      hideTopOverlayHandler: null,
      preventScrollEvents: false,
      closeOnSwipe: true,
      closeOnClick: false
    });
  },
  _defaultOptionsRules() {
    const tabletAndMobileAnimation = {
      show: {
        type: 'fade',
        duration: 200,
        from: 0,
        to: 1
      },
      hide: {
        type: 'fade',
        duration: 200,
        from: 1,
        to: 0
      }
    };
    const tabletAndMobileCommonOptions = {
      // @ts-expect-error
      displayTime: (0, _themes.isMaterialBased)() ? 4000 : 2000,
      hideOnOutsideClick: true,
      animation: tabletAndMobileAnimation
    };
    return this.callBase().concat([{
      device(device) {
        return device.deviceType === 'phone';
      },
      options: _extends({
        width: `calc(100vw - ${DEFAULT_MARGIN * 2}px)`
      }, tabletAndMobileCommonOptions)
    }, {
      device(device) {
        return device.deviceType === 'tablet';
      },
      options: _extends({
        width: 'auto',
        maxWidth: '80vw'
      }, tabletAndMobileCommonOptions)
    }, {
      device(device) {
        // @ts-expect-error
        return (0, _themes.isMaterialBased)() && device.deviceType === 'desktop';
      },
      options: {
        minWidth: 344,
        maxWidth: 568,
        displayTime: 4000
      }
    }]);
  },
  _init() {
    this.callBase();
    this._posStringToObject();
  },
  _renderContentImpl() {
    this._message = (0, _renderer.default)('<div>').addClass(TOAST_MESSAGE_CLASS).text(this.option('message')).appendTo(this.$content());
    this.setAria('role', 'alert', this._message);
    if (toastTypes.includes(this.option('type').toLowerCase())) {
      this.$content().prepend((0, _renderer.default)('<div>').addClass(TOAST_ICON_CLASS));
    }
    this.callBase();
  },
  _render() {
    this.callBase();
    this.$element().addClass(TOAST_CLASS);
    this.$wrapper().addClass(TOAST_WRAPPER_CLASS);
    this.$content().addClass(TOAST_CLASS_PREFIX + String(this.option('type')).toLowerCase());
    this.$content().addClass(TOAST_CONTENT_CLASS);
    this._toggleCloseEvents('Swipe');
    this._toggleCloseEvents('Click');
  },
  _toggleCloseEvents(event) {
    const dxEvent = `dx${event.toLowerCase()}`;
    _events_engine.default.off(this.$content(), dxEvent);
    this.option(`closeOn${event}`) && _events_engine.default.on(this.$content(), dxEvent, this.hide.bind(this));
  },
  _posStringToObject() {
    if (!(0, _type.isString)(this.option('position'))) return;
    const verticalPosition = this.option('position').split(' ')[0];
    const horizontalPosition = this.option('position').split(' ')[1];
    this.option('position', (0, _extend.extend)({
      boundaryOffset: DEFAULT_BOUNDARY_OFFSET
    }, POSITION_ALIASES[verticalPosition]));
    // eslint-disable-next-line default-case
    switch (horizontalPosition) {
      case 'center':
      case 'left':
      case 'right':
        this.option('position').at += ` ${horizontalPosition}`;
        this.option('position').my += ` ${horizontalPosition}`;
        break;
    }
  },
  _show() {
    return this.callBase.apply(this, arguments).always(() => {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = setTimeout(this.hide.bind(this), this.option('displayTime'));
    });
  },
  _overlayStack() {
    return TOAST_STACK;
  },
  _zIndexInitValue() {
    return this.callBase() + FIRST_Z_INDEX_OFFSET;
  },
  _dispose() {
    clearTimeout(this._hideTimeout);
    this.callBase();
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'type':
        this.$content().removeClass(TOAST_CLASS_PREFIX + args.previousValue);
        this.$content().addClass(TOAST_CLASS_PREFIX + String(args.value).toLowerCase());
        break;
      case 'message':
        if (this._message) {
          this._message.text(args.value);
        }
        break;
      case 'closeOnSwipe':
        this._toggleCloseEvents('Swipe');
        break;
      case 'closeOnClick':
        this._toggleCloseEvents('Click');
        break;
      case 'displayTime':
        break;
      default:
        this.callBase(args);
    }
  }
});
(0, _component_registrator.default)(WIDGET_NAME, Toast);
var _default = exports.default = Toast;