"use strict";

exports.resolveRtlEnabled = resolveRtlEnabled;
exports.resolveRtlEnabledDefinition = resolveRtlEnabledDefinition;
var _type = require("../../core/utils/type");
var _config = _interopRequireDefault(require("../../core/config"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function resolveRtlEnabled(rtlProp, config) {
  if (rtlProp !== undefined) {
    return rtlProp;
  }
  if ((config === null || config === void 0 ? void 0 : config.rtlEnabled) !== undefined) {
    return config.rtlEnabled;
  }
  return (0, _config.default)().rtlEnabled;
}
function resolveRtlEnabledDefinition(rtlProp, config) {
  const isPropDefined = (0, _type.isDefined)(rtlProp);
  const onlyGlobalDefined = (0, _type.isDefined)((0, _config.default)().rtlEnabled) && !isPropDefined && !(0, _type.isDefined)(config === null || config === void 0 ? void 0 : config.rtlEnabled);
  return isPropDefined && rtlProp !== (config === null || config === void 0 ? void 0 : config.rtlEnabled) || onlyGlobalDefined;
}