"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _extend = require("../../../core/utils/extend");
var _ready_callbacks = _interopRequireDefault(require("../../../core/utils/ready_callbacks"));
var _swatch_container = _interopRequireDefault(require("../../../ui/widget/swatch_container"));
var _widget = _interopRequireDefault(require("../../ui/widget"));
var _m_speed_dial_main_item = require("./m_speed_dial_main_item");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  getSwatchContainer
} = _swatch_container.default;
const ready = _ready_callbacks.default.add;
class SpeedDialAction extends _widget.default {
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      icon: '',
      onClick: null,
      label: '',
      visible: true,
      index: 0,
      onContentReady: null,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      animation: {
        show: {
          type: 'pop',
          duration: 200,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          from: {
            scale: 0,
            opacity: 0
          },
          to: {
            scale: 1,
            opacity: 1
          }
        },
        hide: {
          type: 'pop',
          duration: 200,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          from: {
            scale: 1,
            opacity: 1
          },
          to: {
            scale: 0,
            opacity: 0
          }
        }
      },
      id: new _guid.default()
    });
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'onClick':
      case 'icon':
      case 'label':
      case 'visible':
      case 'index':
      case 'onInitializing':
        (0, _m_speed_dial_main_item.initAction)(this);
        break;
      case 'animation':
      case 'id':
        break;
      default:
        super._optionChanged(args);
    }
  }
  _render() {
    this._toggleVisibility(false);
    if (!getSwatchContainer(this.$element())) {
      ready(() => (0, _m_speed_dial_main_item.initAction)(this));
    } else {
      (0, _m_speed_dial_main_item.initAction)(this);
    }
  }
  _dispose() {
    // @ts-expect-error
    (0, _m_speed_dial_main_item.disposeAction)(this._options.silent('id'));
    super._dispose();
  }
}
// @ts-expect-error
(0, _component_registrator.default)('dxSpeedDialAction', SpeedDialAction);
var _default = exports.default = SpeedDialAction;