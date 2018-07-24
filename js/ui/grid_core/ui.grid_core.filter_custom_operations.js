"use strict";

import { renderValueText } from "../filter_builder/filter_builder";

var $ = require("../../core/renderer"),
    messageLocalization = require("../../localization/message"),
    extend = require("../../core/utils/extend").extend,
    DataSourceModule = require("../../data/data_source/data_source"),
    deferredUtils = require("../../core/utils/deferred"),
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

    var getFullText = function(itemText, parentText) {
        return parentText ? parentText + "/" + itemText : itemText;
    };

    var getSelectedItemsTexts = function(items, parentText) {
        var result = [];
        items.forEach(function(item) {
            if(item.items) {
                var selectedItemsTexts = getSelectedItemsTexts(item.items, getFullText(item.text, parentText));
                result = result.concat(selectedItemsTexts);
            }
            item.selected && result.push(getFullText(item.text, parentText));
        });
        return result;
    };

    var headerFilterController = grid && grid.getController("headerFilter"),
        customizeText = function(fieldInfo) {
            var value = fieldInfo.value,
                column = grid.columnOption(fieldInfo.field.dataField),
                headerFilter = column && column.headerFilter,
                lookup = column && column.lookup;

            if((headerFilter && headerFilter.dataSource) || (lookup && lookup.dataSource)) {
                column = extend({}, column, { filterType: "include", filterValues: [value] });
                var dataSourceOptions = headerFilterController.getDataSource(column);
                dataSourceOptions.paginate = false;
                var dataSource = new DataSourceModule.DataSource(dataSourceOptions),
                    result = new deferredUtils.Deferred();

                dataSource.load().done(items => {
                    result.resolve(getSelectedItemsTexts(items)[0]);
                });
                return result;
            } else {
                var text = headerFilterController.getHeaderItemText(value, column, 0, grid.option("headerFilter"));
                return text;
            }
        };
    return {
        dataTypes: ["string", "date", "datetime", "number", "boolean", "object"],
        calculateFilterExpression: calculateFilterExpression,
        editorTemplate: function(conditionInfo, container) {
            var div = $("<div>")
                    .addClass("dx-filterbuilder-item-value-text")
                    .appendTo(container),
                column = extend(true, {}, grid.columnOption(conditionInfo.field.dataField));

            renderValueText(div, conditionInfo.value);

            var setValue = function(value) {
                conditionInfo.setValue(value);
            };

            column.filterType = "include";
            column.filterValues = conditionInfo.value ? conditionInfo.value.slice() : [];

            headerFilterController.showHeaderFilterMenuBase({
                columnElement: div,
                column: column,
                apply: function() {
                    setValue(this.filterValues);
                    headerFilterController.hideHeaderFilterMenu();
                },
                onHidden: function() {
                    conditionInfo.closeEditor();
                },
                isFilterBuilder: true
            });
            return container;
        },
        customizeText: customizeText
    };
}

function anyOf(grid) {
    return extend(baseOperation(grid), {
        name: "anyof",
        icon: "selectall",
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
        icon: "unselectall",
        caption: messageLocalization.format("dxFilterBuilder-filterOperationNoneOf")
    });
}

exports.anyOf = anyOf;
exports.noneOf = noneOf;
