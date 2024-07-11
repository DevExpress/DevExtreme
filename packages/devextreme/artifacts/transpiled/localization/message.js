"use strict";

exports.default = void 0;
var _dependency_injector = _interopRequireDefault(require("../core/utils/dependency_injector"));
var _extend = require("../core/utils/extend");
var _string = require("../core/utils/string");
var _inflector = require("../core/utils/inflector");
var _core = _interopRequireDefault(require("./core"));
var _default_messages = require("./default_messages");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const baseDictionary = (0, _extend.extend)(true, {}, _default_messages.defaultMessages);
const getDataByLocale = (localeData, locale) => {
  var _Object$entries$find;
  return localeData[locale] || (locale === null || locale === void 0 ? void 0 : locale.toLowerCase) && ((_Object$entries$find = Object.entries(localeData).find(_ref => {
    let [key] = _ref;
    return key.toLowerCase() === locale.toLowerCase();
  })) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[1]) || {};
};
const newMessages = {};
const messageLocalization = (0, _dependency_injector.default)({
  engine: function () {
    return 'base';
  },
  _dictionary: baseDictionary,
  load: function (messages) {
    (0, _extend.extend)(true, this._dictionary, messages);
  },
  _localizablePrefix: '@',
  setup: function (localizablePrefix) {
    this._localizablePrefix = localizablePrefix;
  },
  localizeString: function (text) {
    const that = this;
    const regex = new RegExp('(^|[^a-zA-Z_0-9' + that._localizablePrefix + '-]+)(' + that._localizablePrefix + '{1,2})([a-zA-Z_0-9-]+)', 'g');
    const escapeString = that._localizablePrefix + that._localizablePrefix;
    return text.replace(regex, (str, prefix, escape, localizationKey) => {
      const defaultResult = that._localizablePrefix + localizationKey;
      let result;
      if (escape !== escapeString) {
        result = that.format(localizationKey);
      }
      if (!result) {
        newMessages[localizationKey] = (0, _inflector.humanize)(localizationKey);
      }
      return prefix + (result || defaultResult);
    });
  },
  getMessagesByLocales: function () {
    return this._dictionary;
  },
  getDictionary: function (onlyNew) {
    if (onlyNew) {
      return newMessages;
    }
    return (0, _extend.extend)({}, newMessages, this.getMessagesByLocales()[_core.default.locale()]);
  },
  getFormatter: function (key) {
    return this._getFormatterBase(key) || this._getFormatterBase(key, 'en');
  },
  _getFormatterBase: function (key, locale) {
    const message = _core.default.getValueByClosestLocale(locale => getDataByLocale(this._dictionary, locale)[key]);
    if (message) {
      return function () {
        const args = arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0].slice(0) : Array.prototype.slice.call(arguments, 0);
        args.unshift(message);
        return _string.format.apply(this, args);
      };
    }
  },
  format: function (key) {
    const formatter = this.getFormatter(key);
    const values = Array.prototype.slice.call(arguments, 1);
    return formatter && formatter.apply(this, values) || '';
  }
});
var _default = exports.default = messageLocalization;
module.exports = exports.default;
module.exports.default = exports.default;