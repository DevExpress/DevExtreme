"use strict";

var formatUtils = require("./format_utils"),
    isDefined = require("../../core/utils/type").isDefined,
    messageLocalization = require("../../localization/message"),
    $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend;

var FILTER_BUILDER_RANGE_CLASS = "dx-filterbuilder-range",
    FILTER_BUILDER_RANGE_START_CLASS = FILTER_BUILDER_RANGE_CLASS + "-start",
    FILTER_BUILDER_RANGE_END_CLASS = FILTER_BUILDER_RANGE_CLASS + "-end",
    FILTER_BUILDER_RANGE_SEPARATOR_CLASS = FILTER_BUILDER_RANGE_CLASS + "-separator";

function editorTemplate(conditionInfo, container) {
    var $editorStart = $("<div>").addClass(FILTER_BUILDER_RANGE_START_CLASS),
        $editorEnd = $("<div>").addClass(FILTER_BUILDER_RANGE_END_CLASS),
        values = conditionInfo.value || [],
        getStartValue = function(values) {
            return values && values.length > 0 ? values[0] : null;
        },
        getEndValue = function(values) {
            return values && values.length === 2 ? values[1] : null;
        };

    container.append($editorStart);
    container.append($("<span>").addClass(FILTER_BUILDER_RANGE_SEPARATOR_CLASS).text("-"));
    container.append($editorEnd);
    container.addClass(FILTER_BUILDER_RANGE_CLASS);

    this._editorFactory.createEditor.call(this, $editorStart, extend({}, conditionInfo.field, conditionInfo, {
        value: getStartValue(values),
        parentType: "filterBuilder",
        setValue: function(value) {
            values = [value, getEndValue(values)];
            conditionInfo.setValue(values);
        }
    }));

    this._editorFactory.createEditor.call(this, $editorEnd, extend({}, conditionInfo.field, conditionInfo, {
        value: getEndValue(values),
        parentType: "filterBuilder",
        setValue: function(value) {
            values = [getStartValue(values), value];
            conditionInfo.setValue(values);
        }
    }));
}

function customizeText(conditionInfo) {
    var startValue = conditionInfo.value[0],
        endValue = conditionInfo.value[1];

    if(!isDefined(startValue) && !isDefined(endValue)) {
        return messageLocalization.format("dxFilterBuilder-enterValueText");
    }

    return (isDefined(startValue) ? formatUtils.getFormattedValueText(conditionInfo.field, startValue) : "?") + " - "
                + (isDefined(endValue) ? formatUtils.getFormattedValueText(conditionInfo.field, endValue) : "?");
}

function getConfig(caption) {
    return {
        name: "between",
        caption: caption,
        icon: "range",
        dataTypes: ["number", "date", "datetime"],
        editorTemplate: editorTemplate,
        customizeText: customizeText
    };
}

exports.getConfig = getConfig;
