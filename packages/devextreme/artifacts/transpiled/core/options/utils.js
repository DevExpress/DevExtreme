"use strict";

exports.normalizeOptions = exports.getParentName = exports.getNestedOptionValue = exports.getFieldName = exports.deviceMatch = exports.createDefaultOptionRules = exports.convertRulesToOptions = void 0;
var _devices = _interopRequireDefault(require("../devices"));
var _type = require("../utils/type");
var _common = require("../utils/common");
var _extend = require("../utils/extend");
var _data = require("../utils/data");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const cachedGetters = {};
const convertRulesToOptions = rules => {
  const currentDevice = _devices.default.current();
  return rules.reduce((options, _ref) => {
    let {
      device,
      options: ruleOptions
    } = _ref;
    const deviceFilter = device || {};
    const match = (0, _type.isFunction)(deviceFilter) ? deviceFilter(currentDevice) : deviceMatch(currentDevice, deviceFilter);
    if (match) {
      (0, _extend.extend)(true, options, ruleOptions);
    }
    return options;
  }, {});
};
exports.convertRulesToOptions = convertRulesToOptions;
const normalizeOptions = (options, value) => {
  return typeof options !== 'string' ? options : {
    [options]: value
  };
};
exports.normalizeOptions = normalizeOptions;
const deviceMatch = (device, filter) => (0, _type.isEmptyObject)(filter) || (0, _common.findBestMatches)(device, [filter]).length > 0;
exports.deviceMatch = deviceMatch;
const getFieldName = fullName => fullName.substr(fullName.lastIndexOf('.') + 1);
exports.getFieldName = getFieldName;
const getParentName = fullName => fullName.substr(0, fullName.lastIndexOf('.'));
exports.getParentName = getParentName;
const getNestedOptionValue = function (optionsObject, name) {
  cachedGetters[name] = cachedGetters[name] || (0, _data.compileGetter)(name);
  return cachedGetters[name](optionsObject, {
    functionsAsIs: true
  });
};
exports.getNestedOptionValue = getNestedOptionValue;
const createDefaultOptionRules = function () {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return options;
};
exports.createDefaultOptionRules = createDefaultOptionRules;