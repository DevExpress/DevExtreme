var extend = require("./extend").extend,
    windowUtils = require("./window"),
    navigator = windowUtils.getNavigator();

var webkitRegExp = /(webkit)[ /]([\w.]+)/,
    ieRegExp = /(msie) (\d{1,2}\.\d)/,
    ie11RegExp = /(trident).*rv:(\d{1,2}\.\d)/,
    msEdge = /(edge)\/((\d+)?[\w.]+)/,
    safari = /(safari)/i,
    mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;

var browserFromUA = function(ua) {
    ua = ua.toLowerCase();

    var result = {},
        matches =
            ieRegExp.exec(ua) ||
            ie11RegExp.exec(ua) ||
            msEdge.exec(ua) ||
            ua.indexOf("compatible") < 0 && mozillaRegExp.exec(ua) ||
            webkitRegExp.exec(ua) ||
            [],
        browserName = matches[1],
        browserVersion = matches[2];

    if(browserName === "webkit") {
        result["webkit"] = true;

        if(ua.indexOf("chrome") < 0 && safari.exec(ua)) {
            browserName = "safari";
            browserVersion = /Version\/([0-9.]+)/i.exec(ua);
            browserVersion = browserVersion && browserVersion[1];
        } else if(ua.indexOf("chrome") >= 0) {
            browserName = "chrome";
            browserVersion = /Chrome\/(\d+\.\d+)/i.exec(ua);
            browserVersion = browserVersion && browserVersion[1];
        }
    }

    if(browserName === "trident" || browserName === "edge") {
        browserName = "msie";
    }

    if(browserName) {
        result[browserName] = true;
        result.version = browserVersion;
    }

    return result;
};
module.exports = extend({ _fromUA: browserFromUA }, browserFromUA(navigator.userAgent));
