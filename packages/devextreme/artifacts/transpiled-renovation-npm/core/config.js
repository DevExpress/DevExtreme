"use strict";

exports.default = void 0;
var _extend = require("./utils/extend");
var _errors = _interopRequireDefault(require("./errors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* global DevExpress */

const config = {
  rtlEnabled: false,
  defaultCurrency: 'USD',
  defaultUseCurrencyAccountingStyle: true,
  oDataFilterToLower: true,
  serverDecimalSeparator: '.',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  forceIsoDateParsing: true,
  wrapActionsBeforeExecute: true,
  useLegacyStoreResult: false,
  /**
  * @name GlobalConfig.useJQuery
  * @type boolean
  * @hidden
  */
  useJQuery: undefined,
  editorStylingMode: undefined,
  useLegacyVisibleIndex: false,
  floatingActionButtonConfig: {
    icon: 'add',
    closeIcon: 'close',
    label: '',
    position: {
      at: 'right bottom',
      my: 'right bottom',
      offset: {
        x: -16,
        y: -16
      }
    },
    maxSpeedDialActionCount: 5,
    shading: false,
    direction: 'auto'
  },
  optionsParser: optionsString => {
    if (optionsString.trim().charAt(0) !== '{') {
      optionsString = '{' + optionsString + '}';
    }
    try {
      return JSON.parse(optionsString);
    } catch (ex) {
      try {
        return JSON.parse(normalizeToJSONString(optionsString));
      } catch (exNormalize) {
        throw _errors.default.Error('E3018', ex, optionsString);
      }
    }
  }
};
const normalizeToJSONString = optionsString => {
  return optionsString.replace(/'/g, '"') // replace all ' to "
  .replace(/,\s*([\]}])/g, '$1') // remove trailing commas
  .replace(/([{,])\s*([^":\s]+)\s*:/g, '$1"$2":'); // add quotes for unquoted keys
};
const deprecatedFields = ['decimalSeparator', 'thousandsSeparator'];
const configMethod = function () {
  if (!arguments.length) {
    return config;
  }
  const newConfig = arguments.length <= 0 ? undefined : arguments[0];
  deprecatedFields.forEach(deprecatedField => {
    if (newConfig[deprecatedField]) {
      const message = `Now, the ${deprecatedField} is selected based on the specified locale.`;
      _errors.default.log('W0003', 'config', deprecatedField, '19.2', message);
    }
  });
  (0, _extend.extend)(config, newConfig);
};
if (typeof DevExpress !== 'undefined' && DevExpress.config) {
  configMethod(DevExpress.config);
}
var _default = exports.default = configMethod;
module.exports = exports.default;
module.exports.default = exports.default;