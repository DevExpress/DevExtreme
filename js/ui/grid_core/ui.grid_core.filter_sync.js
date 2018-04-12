"use strict";

import { isDefined } from "../../core/utils/type";

var modules = require("./ui.grid_core.modules"),
    utils = require("../filter_builder/utils"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    filterUtils = require("../shared/filtering"),
    customOperations = require("./ui.grid_core.filter_custom_operations");

var FILTER_ROW_OPERATIONS = ["=", "<>", "<", "<=", ">", ">=", "notcontains", "contains", "startswith", "endswith", "between"];

var FilterSyncController = modules.Controller.inherit((function() {
    var getEmptyFilterValues = function() {
        return {
            filterType: "include",
            filterValues: undefined
        };
    };

    var canSyncHeaderFilterWithFilterRow = function(column) {
        return !filterUtils.getGroupInterval(column) && !(column.headerFilter && column.headerFilter.dataSource);
    };

    var getHeaderFilterFromCondition = function(headerFilterCondition, column) {
        if(!headerFilterCondition) {
            return getEmptyFilterValues();
        }

        var filterType,
            selectedFilterOperation = headerFilterCondition[1],
            value = headerFilterCondition[2],
            hasArrayValue = Array.isArray(value);

        if(!hasArrayValue) {
            if(!canSyncHeaderFilterWithFilterRow(column)) {
                return getEmptyFilterValues();
            }
        }

        switch(selectedFilterOperation) {
            case "anyof":
            case "=":
                filterType = "include";
                break;
            case "noneof":
            case "<>":
                filterType = "exclude";
                break;
            default: return getEmptyFilterValues();
        }

        return {
            filterType: filterType,
            filterValues: hasArrayValue ? value : [value]
        };
    };

    var getConditionFromHeaderFilter = function(column) {
        var selectedOperation,
            value,
            filterValues = column.filterValues;

        if(!filterValues) return null;

        if(canSyncHeaderFilterWithFilterRow(column) && column.filterValues.length === 1 && !Array.isArray(filterValues[0])) {
            column.filterType === "exclude" ? selectedOperation = "<>" : selectedOperation = "=";
            value = filterValues[0];
        } else {
            column.filterType === "exclude" ? selectedOperation = "noneof" : selectedOperation = "anyof";
            value = filterValues;
        }
        return [column.dataField, selectedOperation, value];
    };

    var updateHeaderFilterCondition = function(columnsController, column, headerFilterCondition) {
        var headerFilter = getHeaderFilterFromCondition(headerFilterCondition, column);
        columnsController.columnOption(column.dataField, headerFilter);
    };

    var updateFilterRowCondition = function(columnsController, column, condition) {
        var filterRowOptions,
            selectedFilterOperation = condition && condition[1];
        if(FILTER_ROW_OPERATIONS.indexOf(selectedFilterOperation) >= 0) {
            filterRowOptions = {
                filterValue: condition[2],
                selectedFilterOperation: selectedFilterOperation
            };
        } else {
            filterRowOptions = {
                filterValue: undefined,
                selectedFilterOperation: undefined
            };
        }
        columnsController.columnOption(column.dataField, filterRowOptions);
    };

    return {
        syncFilterValue: function() {
            var that = this,
                columnsController = that.getController("columns"),
                columns = columnsController.getColumns();

            this._skipSyncColumnOptions = true;
            columns.forEach(function(column) {
                var filterConditions = utils.getMatchedConditions(that.option("filterValue"), column.dataField);
                if(filterConditions.length === 1) {
                    var filterCondition = filterConditions[0];
                    updateHeaderFilterCondition(columnsController, column, filterCondition);
                    updateFilterRowCondition(columnsController, column, filterCondition);
                } else {
                    column.filterValues && updateHeaderFilterCondition(columnsController, column);
                    column.filterValue && updateFilterRowCondition(columnsController, column);
                }
            });
            this._skipSyncColumnOptions = false;
        },

        init: function() {
            if(this.getController("data").skipCalculateColumnFilters()) {
                this.syncFilterValue();
            }
        },

        _getSyncFilterRow: function(filterValue, column) {
            var value = column.filterValue;
            if(isDefined(value)) {
                var operation = column.selectedFilterOperation || column.defaultFilterOperation || utils.getDefaultOperation(column),
                    filter = [column.dataField, operation, value];
                return utils.syncFilters(filterValue, filter);
            } else {
                return utils.removeFieldConditionsFromFilter(filterValue, column.dataField);
            }
        },

        _getSyncHeaderFilter: function(filterValue, column) {
            var filter = getConditionFromHeaderFilter(column);
            if(filter) {
                return utils.syncFilters(filterValue, filter);
            } else {
                return utils.removeFieldConditionsFromFilter(filterValue, column.dataField);
            }
        },

        syncFilterRow: function(column, value) {
            this.option("filterValue", this._getSyncFilterRow(this.option("filterValue"), column));
        },

        syncHeaderFilter: function(column) {
            this.option("filterValue", this._getSyncHeaderFilter(this.option("filterValue"), column));
        },

        getCustomFilterOperations: function() {
            var filterBuilderCustomOperations = this.option("filterBuilder.customOperations") || [];
            return [customOperations.anyOf(this.component), customOperations.noneOf(this.component)].concat(filterBuilderCustomOperations);
        },

        publicMethods: function() {
            return ["getCustomFilterOperations"];
        }
    };
})());

var DataControllerFilterSyncExtender = {
    skipCalculateColumnFilters: function() {
        var filterSyncEnabledValue = this.option("filterSyncEnabled");
        return filterSyncEnabledValue === "auto" ? this.option("filterPanel.visible") : filterSyncEnabledValue;
    },

    _calculateAdditionalFilter: function() {
        var that = this;

        if(that.option("filterPanel.filterEnabled") === false) {
            return that.callBase();
        }

        var filters = [that.callBase()],
            columns = that.getController("columns").getColumns(),
            filterValue = that.option("filterValue");

        if(that.skipCalculateColumnFilters()) {
            var currentColumn = that.getController("headerFilter").getCurrentColumn();
            if(currentColumn && filterValue) {
                filterValue = utils.removeFieldConditionsFromFilter(filterValue, currentColumn.dataField);
            }
        }
        var customOperations = that.getController("filterSync").getCustomFilterOperations(),
            calculatedFilterValue = utils.getFilterExpression(filterValue, columns, customOperations, "filterBuilder");
        if(calculatedFilterValue) {
            filters.push(calculatedFilterValue);
        }

        return gridCoreUtils.combineFilters(filters);
    },

    _parseColumnInfo: function(fullName) {
        var matched = fullName.match(/columns\[([0-9]*)\]\.(.*)/);
        return {
            index: matched[1],
            changedField: matched[2]
        };
    },

    optionChanged: function(args) {
        switch(args.name) {
            case "filterValue":
                this._applyFilter();
                if(this.skipCalculateColumnFilters()) {
                    this.getController("filterSync").syncFilterValue();
                }
                args.handled = true;
                break;
            case "filterSyncEnabled":
                args.handled = true;
                break;
            case "columns":
                if(this.skipCalculateColumnFilters()) {
                    var columnInfo = this._parseColumnInfo(args.fullName),
                        column,
                        filterSyncController = this.getController("filterSync");
                    if(!filterSyncController._skipSyncColumnOptions) {
                        filterSyncController._skipSyncColumnOptions = true;
                        if(["filterValues", "filterType"].indexOf(columnInfo.changedField) !== -1) {
                            column = this.getController("columns").getColumns()[columnInfo.index];
                            filterSyncController.syncHeaderFilter(column);
                        } else if(["filterValue", "selectedFilterOperation"].indexOf(columnInfo.changedField) !== -1) {
                            column = this.getController("columns").getColumns()[columnInfo.index];
                            filterSyncController.syncFilterRow(column, column.filterValue);
                        }
                        filterSyncController._skipSyncColumnOptions = false;
                    }
                }
                break;
            default:
                this.callBase(args);
        }
    }
};

var ColumnHeadersViewFilterSyncExtender = {
    _isHeaderFilterEmpty: function(column) {
        if(this.getController("data").skipCalculateColumnFilters()) {
            return !utils.filterHasField(this.option("filterValue"), column.dataField);
        }

        return this.callBase(column);
    },

    _needUpdateFilterIndicators: function() {
        return !this.getController("data").skipCalculateColumnFilters();
    },

    optionChanged: function(args) {
        if(args.name === "filterValue") {
            this._updateHeaderFilterIndicators();
        } else {
            this.callBase(args);
        }
    }
};

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions_filterValue
             * @publicName filterValue
             * @type Filter expression
             * @default null
             */
            filterValue: null,

            /**
             * @name GridBaseOptions_filterSyncEnabled
             * @publicName filterSyncEnabled
             * @type boolean
             */
            filterSyncEnabled: "auto"
        };
    },
    controllers: {
        filterSync: FilterSyncController
    },
    extenders: {
        controllers: {
            data: DataControllerFilterSyncExtender
        },
        views: {
            columnHeadersView: ColumnHeadersViewFilterSyncExtender
        }
    }
};
