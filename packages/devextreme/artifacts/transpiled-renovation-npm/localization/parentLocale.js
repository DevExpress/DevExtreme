"use strict";

exports.default = void 0;
/* eslint-disable import/no-commonjs */
const PARENT_LOCALE_SEPARATOR = '-';
var _default = (parentLocales, locale) => {
  const parentLocale = parentLocales[locale];
  if (parentLocale) {
    return parentLocale !== 'root' && parentLocale;
  }
  return locale.substr(0, locale.lastIndexOf(PARENT_LOCALE_SEPARATOR));
};
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;