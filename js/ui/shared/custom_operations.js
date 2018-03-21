"use strict";

var $ = require("../../core/renderer"),
    messageLocalization = require("../../localization/message"),
    extend = require("../../core/utils/extend").extend,
    utils = require("../filter_builder/utils");

function baseOperation(grid) {
    var calculateFilterExpression = function(filterValue, field) {
        var result = [],
            lastIndex = filterValue.length - 1;
        filterValue && filterValue.forEach(function(value, index) {
            if(utils.isCondition(value) || utils.isGroup(value)) {
                var filterExpression = utils.getFilterExpression(value, [field], [], "headerFilter");
                result.push(filterExpression);
            } else {
                result.push(utils.getFilterExpression([field.dataField, "=", value], [field], [], "headerFilter"));
            }
            index !== lastIndex && result.push("or");
        });
        if(result.length === 1) {
            result = result[0];
        }
        return result;
    };

    var headerFilterController = grid && grid.getController("headerFilter"),
        customizeText = function(fieldInfo) {
            var values = fieldInfo.value || [],
                column = grid.columnOption(fieldInfo.field.dataField),
                texts = values.map(function(value) {
                    var text = headerFilterController.getHeaderItemText(value, column, 0, grid.option("headerFilter"));
                    return text;
                });

            return texts.join(", ") || messageLocalization.format("dxFilterBuilder-enterValueText");
        };
    return {
        dataTypes: ["string", "date", "datetime", "number"],
        calculateFilterExpression: calculateFilterExpression,
        editorTemplate: function(conditionInfo, container) {
            var div = $("<div>")
                    .addClass("dx-filterbuilder-item-value-text")
                    .text(customizeText(conditionInfo))
                    .appendTo(container),
                column = extend(true, {}, grid.columnOption(conditionInfo.field.dataField));

            var setValue = function(value) {
                div.text(customizeText({
                    field: conditionInfo.field,
                    value: value
                }));
                conditionInfo.setValue(value);
            };

            column.filterType = "include";
            column.filterValues = conditionInfo.value;

            headerFilterController.showHeaderFilterMenuBase({
                columnElement: div,
                column: column,
                apply: function() {
                    setValue(this.filterValues);
                    headerFilterController.hideHeaderFilterMenu();
                },
                onHidden: function() {
                    $("body").trigger("dxpointerdown");
                },
                isCustomOperation: true
            });
            return container;
        },
        customizeText: customizeText
    };
}

function anyOf(grid) {
    return extend(baseOperation(grid), {
        name: "anyof",
        caption: messageLocalization.format("dxFilterBuilder-filterOperationAnyOf")
    });
}

function noneOf(grid) {
    var baseOp = baseOperation(grid);
    return extend({}, baseOp, {
        calculateFilterExpression: function(filterValue, field) {
            var baseFilter = baseOp.calculateFilterExpression(filterValue, field);
            if(!baseFilter || baseFilter.length === 0) return null;

            return baseFilter[0] === "!" ? baseFilter : ["!", baseFilter];
        },
        name: "noneof",
        caption: messageLocalization.format("dxFilterBuilder-filterOperationNoneOf")
    });
}

exports.anyOf = anyOf;
exports.noneOf = noneOf;
