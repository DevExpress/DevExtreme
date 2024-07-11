"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _support = require("../../../core/utils/support");
var _window = require("../../../core/utils/window");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _m_date_box = _interopRequireDefault(require("./m_date_box.strategy"));
var _m_date_utils = _interopRequireDefault(require("./m_date_utils"));
var _m_date_view = _interopRequireDefault(require("./m_date_view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const DateViewStrategy = _m_date_box.default.inherit({
  NAME: 'DateView',
  getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      openOnFieldClick: true,
      applyButtonText: _message.default.format('OK'),
      'dropDownOptions.showTitle': true
    });
  },
  getDisplayFormat(displayFormat) {
    return displayFormat || _m_date_utils.default.FORMATS_MAP[this.dateBox.option('type')];
  },
  popupConfig(config) {
    return {
      toolbarItems: this.dateBox._popupToolbarItemsConfig(),
      onInitialized: config.onInitialized,
      defaultOptionsRules: [{
        device: {
          platform: 'android'
        },
        options: {
          width: 333,
          height: 331
        }
      }, {
        device(device) {
          const {
            platform
          } = device;
          return platform === 'generic' || platform === 'ios';
        },
        options: {
          width: 'auto',
          height: 'auto'
        }
      }, {
        device(device) {
          const {
            platform
          } = device;
          const {
            phone
          } = device;
          return platform === 'generic' && phone;
        },
        options: {
          width: 333,
          maxWidth: '100%',
          maxHeight: '100%',
          height: 'auto',
          position: {
            collision: 'flipfit flip'
          }
        }
      }, {
        device: {
          platform: 'ios',
          phone: true
        },
        options: {
          width: '100%',
          position: {
            my: 'bottom',
            at: 'bottom',
            of: window
          }
        }
      }]
    };
  },
  _renderWidget() {
    if ((0, _support.inputType)(this.dateBox.option('mode')) && this.dateBox._isNativeType() || this.dateBox.option('readOnly')) {
      if (this._widget) {
        this._widget.$element().remove();
        this._widget = null;
      }
      return;
    }
    const popup = this._getPopup();
    if (this._widget) {
      this._widget.option(this._getWidgetOptions());
    } else {
      const element = (0, _renderer.default)('<div>').appendTo(popup.$content());
      this._widget = this._createWidget(element);
    }
    this._widget.$element().appendTo(this._getWidgetContainer());
  },
  _getWidgetName() {
    return _m_date_view.default;
  },
  renderOpenedState() {
    this.callBase();
    if (this._widget) {
      this._widget.option('value', this._widget._getCurrentDate());
    }
  },
  _getWidgetOptions() {
    return {
      value: this.dateBoxValue() || new Date(),
      type: this.dateBox.option('type'),
      minDate: this.dateBox.dateOption('min') || new Date(1900, 0, 1),
      maxDate: this.dateBox.dateOption('max') || new Date(Date.now() + 50 * _m_date_utils.default.ONE_YEAR),
      onDisposing: function () {
        this._widget = null;
      }.bind(this)
    };
  }
});
var _default = exports.default = DateViewStrategy;