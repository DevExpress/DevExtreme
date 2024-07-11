"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILTER_BUILDER_RANGE_CLASS = 'dx-filterbuilder-range';
const FILTER_BUILDER_RANGE_START_CLASS = `${FILTER_BUILDER_RANGE_CLASS}-start`;
const FILTER_BUILDER_RANGE_END_CLASS = `${FILTER_BUILDER_RANGE_CLASS}-end`;
const FILTER_BUILDER_RANGE_SEPARATOR_CLASS = `${FILTER_BUILDER_RANGE_CLASS}-separator`;
const SEPARATOR = '\u2013';
function editorTemplate(conditionInfo, container) {
  const $editorStart = (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_RANGE_START_CLASS);
  const $editorEnd = (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_RANGE_END_CLASS);
  let values = conditionInfo.value || [];
  const getStartValue = function (values) {
    return values && values.length > 0 ? values[0] : null;
  };
  const getEndValue = function (values) {
    return values && values.length === 2 ? values[1] : null;
  };
  container.append($editorStart);
  container.append((0, _renderer.default)('<span>').addClass(FILTER_BUILDER_RANGE_SEPARATOR_CLASS).text(SEPARATOR));
  container.append($editorEnd);
  container.addClass(FILTER_BUILDER_RANGE_CLASS);
  this._editorFactory.createEditor.call(this, $editorStart, (0, _extend.extend)({}, conditionInfo.field, conditionInfo, {
    value: getStartValue(values),
    parentType: 'filterBuilder',
    setValue(value) {
      values = [value, getEndValue(values)];
      conditionInfo.setValue(values);
    }
  }));
  this._editorFactory.createEditor.call(this, $editorEnd, (0, _extend.extend)({}, conditionInfo.field, conditionInfo, {
    value: getEndValue(values),
    parentType: 'filterBuilder',
    setValue(value) {
      values = [getStartValue(values), value];
      conditionInfo.setValue(values);
    }
  }));
}
function getConfig(caption, context) {
  return {
    name: 'between',
    caption,
    icon: 'range',
    valueSeparator: SEPARATOR,
    dataTypes: ['number', 'date', 'datetime'],
    editorTemplate: editorTemplate.bind(context),
    notForLookup: true
  };
}