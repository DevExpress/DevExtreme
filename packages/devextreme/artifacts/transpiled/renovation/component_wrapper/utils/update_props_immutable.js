"use strict";

exports.updatePropsImmutable = updatePropsImmutable;
var _type = require("../../../core/utils/type");
var _data = require("../../../core/utils/data");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function cloneObjectValue(value) {
  return Array.isArray(value) ? [...value] : _extends({}, value);
}
function cloneObjectProp(value, prevValue, fullNameParts) {
  const result = fullNameParts.length > 0 && prevValue && value !== prevValue ? cloneObjectValue(prevValue) : cloneObjectValue(value);
  const name = fullNameParts[0];
  if (fullNameParts.length > 1) {
    result[name] = cloneObjectProp(value[name], prevValue === null || prevValue === void 0 ? void 0 : prevValue[name], fullNameParts.slice(1));
  } else if (name) {
    if ((0, _type.isPlainObject)(value[name])) {
      result[name] = cloneObjectValue(value[name]);
    } else {
      result[name] = value[name];
    }
  }
  return result;
}
function updatePropsImmutable(props, option, name, fullName) {
  const currentPropsValue = option[name];
  const prevPropsValue = props[name];
  const result = props;
  if ((0, _type.isPlainObject)(currentPropsValue) || name !== fullName && Array.isArray(currentPropsValue)) {
    result[name] = cloneObjectProp(currentPropsValue, prevPropsValue, (0, _data.getPathParts)(fullName).slice(1));
  } else {
    result[name] = currentPropsValue;
  }
}