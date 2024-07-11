"use strict";

require("./core");
var _globalize = _interopRequireDefault(require("globalize"));
var _message = _interopRequireDefault(require("../message"));
var _core2 = _interopRequireDefault(require("../core"));
require("globalize/message");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports, import/no-unresolved

if (_globalize.default && _globalize.default.formatMessage) {
  const DEFAULT_LOCALE = 'en';
  const originalLoadMessages = _globalize.default.loadMessages;
  _globalize.default.loadMessages = messages => {
    _message.default.load(messages);
  };
  const globalizeMessageLocalization = {
    engine: function () {
      return 'globalize';
    },
    ctor: function () {
      this.load(this._dictionary);
    },
    load: function (messages) {
      this.callBase(messages);
      originalLoadMessages(messages);
    },
    getMessagesByLocales: function () {
      return _globalize.default.cldr.get('globalize-messages');
    },
    getFormatter: function (key, locale) {
      const currentLocale = locale || _core2.default.locale();
      let formatter = this._getFormatterBase(key, locale);
      if (!formatter) {
        formatter = this._formatterByGlobalize(key, locale);
      }
      if (!formatter && currentLocale !== DEFAULT_LOCALE) {
        formatter = this.getFormatter(key, DEFAULT_LOCALE);
      }
      return formatter;
    },
    _formatterByGlobalize: function (key, locale) {
      const currentGlobalize = !locale || locale === _core2.default.locale() ? _globalize.default : new _globalize.default(locale);
      let result;
      if (this._messageLoaded(key, locale)) {
        result = currentGlobalize.messageFormatter(key);
      }
      return result;
    },
    _messageLoaded: function (key, locale) {
      const currentCldr = locale ? new _globalize.default(locale).cldr : _globalize.default.locale();
      const value = currentCldr.get(['globalize-messages/{bundle}', key]);
      return !!value;
    },
    _loadSingle: function (key, value, locale) {
      const data = {};
      data[locale] = {};
      data[locale][key] = value;
      this.load(data);
    }
  };
  _message.default.inject(globalizeMessageLocalization);
}