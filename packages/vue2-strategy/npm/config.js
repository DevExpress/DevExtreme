"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOption = void 0;
var config = {
    useLegacyTemplateEngine: false
};
function setOptions(options) {
    config = __assign(__assign({}, config), options);
}
function getOption(optionName) {
    return config[optionName];
}
exports.getOption = getOption;
exports.default = setOptions;
