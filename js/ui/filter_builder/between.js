const $ = require('../../core/renderer');
const extend = require('../../core/utils/extend').extend;

const FILTER_BUILDER_RANGE_CLASS = 'dx-filterbuilder-range';
const FILTER_BUILDER_RANGE_START_CLASS = FILTER_BUILDER_RANGE_CLASS + '-start';
const FILTER_BUILDER_RANGE_END_CLASS = FILTER_BUILDER_RANGE_CLASS + '-end';
const FILTER_BUILDER_RANGE_SEPARATOR_CLASS = FILTER_BUILDER_RANGE_CLASS + '-separator';

const SEPARATOR = '\u2013';

function editorTemplate(conditionInfo, container) {
    const $editorStart = $('<div>').addClass(FILTER_BUILDER_RANGE_START_CLASS);
    const $editorEnd = $('<div>').addClass(FILTER_BUILDER_RANGE_END_CLASS);
    let values = conditionInfo.value || [];
    const getStartValue = function(values) {
        return values && values.length > 0 ? values[0] : null;
    };
    const getEndValue = function(values) {
        return values && values.length === 2 ? values[1] : null;
    };

    container.append($editorStart);
    container.append($('<span>').addClass(FILTER_BUILDER_RANGE_SEPARATOR_CLASS).text(SEPARATOR));
    container.append($editorEnd);
    container.addClass(FILTER_BUILDER_RANGE_CLASS);

    this._editorFactory.createEditor.call(this, $editorStart, extend({}, conditionInfo.field, conditionInfo, {
        value: getStartValue(values),
        parentType: 'filterBuilder',
        setValue: function(value) {
            values = [value, getEndValue(values)];
            conditionInfo.setValue(values);
        }
    }));

    this._editorFactory.createEditor.call(this, $editorEnd, extend({}, conditionInfo.field, conditionInfo, {
        value: getEndValue(values),
        parentType: 'filterBuilder',
        setValue: function(value) {
            values = [getStartValue(values), value];
            conditionInfo.setValue(values);
        }
    }));
}

function getConfig(caption, context) {
    return {
        name: 'between',
        caption: caption,
        icon: 'range',
        valueSeparator: SEPARATOR,
        dataTypes: ['number', 'date', 'datetime'],
        editorTemplate: editorTemplate.bind(context)
    };
}

exports.getConfig = getConfig;
