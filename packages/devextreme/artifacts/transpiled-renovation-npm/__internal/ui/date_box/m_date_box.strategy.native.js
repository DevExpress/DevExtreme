"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _common = require("../../../core/utils/common");
var _date_serialization = _interopRequireDefault(require("../../../core/utils/date_serialization"));
var _extend = require("../../../core/utils/extend");
var _support = require("../../../core/utils/support");
var _m_date_box = _interopRequireDefault(require("./m_date_box.strategy"));
var _m_date_utils = _interopRequireDefault(require("./m_date_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const NativeStrategy = _m_date_box.default.inherit({
  NAME: 'Native',
  popupConfig(popupConfig) {
    return (0, _extend.extend)({}, popupConfig, {
      width: 'auto'
    });
  },
  getParsedText(text) {
    if (!text) {
      return null;
    }
    // NOTE: Required for correct date parsing when native picker is used (T418155)
    if (this.dateBox.option('type') === 'datetime') {
      return new Date(text.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
    }
    return _m_date_utils.default.fromStandardDateFormat(text);
  },
  renderPopupContent: _common.noop,
  _getWidgetName: _common.noop,
  _getWidgetOptions: _common.noop,
  _getDateBoxType() {
    let type = this.dateBox.option('type');
    if (!_m_date_utils.default.SUPPORTED_FORMATS.includes(type)) {
      type = 'date';
    } else if (type === 'datetime' && !(0, _support.inputType)(type)) {
      type = 'datetime-local';
    }
    return type;
  },
  customizeButtons() {
    const dropDownButton = this.dateBox.getButton('dropDown');
    if (_devices.default.real().android && dropDownButton) {
      dropDownButton.on('click', () => {
        this.dateBox._input().get(0).click();
      });
    }
  },
  getDefaultOptions() {
    return {
      mode: this._getDateBoxType()
    };
  },
  getDisplayFormat(displayFormat) {
    const type = this._getDateBoxType();
    return displayFormat || _m_date_utils.default.FORMATS_MAP[type];
  },
  renderInputMinMax($input) {
    $input.attr({
      min: _date_serialization.default.serializeDate(this.dateBox.dateOption('min'), 'yyyy-MM-dd'),
      max: _date_serialization.default.serializeDate(this.dateBox.dateOption('max'), 'yyyy-MM-dd')
    });
  }
});
var _default = exports.default = NativeStrategy;