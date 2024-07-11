"use strict";

exports.default = void 0;
var _extend = require("./extend");
var _window = require("./window");
const navigator = (0, _window.getNavigator)();
const webkitRegExp = /(webkit)[ /]([\w.]+)/;
const mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;
const browserFromUA = ua => {
  ua = ua.toLowerCase();
  const result = {};
  const matches = webkitRegExp.exec(ua) || ua.indexOf('compatible') < 0 && mozillaRegExp.exec(ua) || [];
  let browserName = matches[1];
  let browserVersion = matches[2];
  if (browserName === 'webkit') {
    result['webkit'] = true;
    if (ua.indexOf('chrome') >= 0 || ua.indexOf('crios') >= 0) {
      browserName = 'chrome';
      browserVersion = /(?:chrome|crios)\/(\d+\.\d+)/.exec(ua);
      browserVersion = browserVersion && browserVersion[1];
    } else if (ua.indexOf('fxios') >= 0) {
      browserName = 'mozilla';
      browserVersion = /fxios\/(\d+\.\d+)/.exec(ua);
      browserVersion = browserVersion && browserVersion[1];
    } else if (ua.indexOf('safari') >= 0 && /version|phantomjs/.test(ua)) {
      browserName = 'safari';
      browserVersion = /(?:version|phantomjs)\/([0-9.]+)/.exec(ua);
      browserVersion = browserVersion && browserVersion[1];
    } else {
      browserName = 'unknown';
      browserVersion = /applewebkit\/([0-9.]+)/.exec(ua);
      browserVersion = browserVersion && browserVersion[1];
    }
  }
  if (browserName) {
    result[browserName] = true;
    result.version = browserVersion;
  }
  return result;
};
var _default = exports.default = (0, _extend.extend)({
  _fromUA: browserFromUA
}, browserFromUA(navigator.userAgent));
module.exports = exports.default;
module.exports.default = exports.default;