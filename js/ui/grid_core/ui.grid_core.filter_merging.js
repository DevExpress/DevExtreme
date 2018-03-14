"use strict";

var modules = require("./ui.grid_core.modules"),
    utils = require("../filter_builder/utils"),
    gridCoreUtils = require("./ui.grid_core.utils");

var FilterMergingController = modules.Controller.inherit((function() {
    return {
        _initSync: function() {
            var that = this,
                columns = that.getController("columns").getColumns(),
                filterValue = that.option("filterValue");

            columns.forEach(function(column) {
                var filterRowCondition = utils.getFilterRowCondition(filterValue, column.dataField);
                if(filterRowCondition) {
                    column.filterValue = filterRowCondition[2];
                    column.selectedFilterOperation = filterRowCondition[1];
                }
                var headerFilterValue = utils.getHeaderFilterValue(filterValue, column.dataField);
                if(headerFilterValue) {
                    if(headerFilterValue[0] === "!") {
                        column.filterType = "exclude";
                        headerFilterValue = headerFilterValue[1];
                    } else {
                        column.filterType = "include";
                    }
                    column.filterValues = headerFilterValue;
                }
                if(column.filterValues && !headerFilterValue) {
                    filterValue = that._getSyncHeaderFilter(filterValue, column);
                } else if(column.filterValue && !filterRowCondition) {
                    filterValue = that._getSyncFilterRow(filterValue, column, column.filterValue);
                }
            });

            if(filterValue && filterValue.length > 0) {
                that.option("filterValue", filterValue);
            }
        },

        init: function() {
            if(this.option("filterSyncEnabled")) {
                this._initSync();
            }
        },

        _getSyncFilterRow: function(filterValue, column, value) {
            var operation = column.selectedFilterOperation || column.defaultFilterOperation || utils.getDefaultOperation(column),
                filter = [column.dataField, operation, value];
            return utils.syncFilters(filterValue, filter);
        },

        _getSyncHeaderFilter: function(filterValue, column) {
            var filterValues = column.filterValues,
                filter = [column.dataField];
            if(filterValues) {
                filter.push(this._getOperation(filterValues, column.filterType === "exclude"));
                filter.push(filterValues.length === 1 ? filterValues[0] : filterValues);
            } else {
                filter.push("=");
                filter.push(null);
            }
            return utils.syncFilters(filterValue, filter);
        },

        syncFilterRow: function(column, value) {
            this.option("filterValue", this._getSyncFilterRow(this.option("filterValue"), column, value));
        },

        _getOperation: function(filterValues, isExclude) {
            var hasOneValue = filterValues.length === 1;
            if(isExclude) {
                return hasOneValue ? "<>" : "noneof";
            } else {
                return hasOneValue ? "=" : "anyof";
            }
        },

        syncHeaderFilter: function(column) {
            this.option("filterValue", this._getSyncHeaderFilter(this.option("filterValue"), column));
        },
    };
})());

function anyOf(dataField, filterValue) {
    var result = [],
        lastIndex = filterValue.length - 1;
    filterValue.forEach(function(value, index) {
        if(utils.isCondition(value) || utils.isGroup(value)) {
            result.push(value);
        } else {
            result.push([dataField, "=", value]);
        }
        index !== lastIndex && result.push("or");
    });
    return result;
}

var DataControllerFilterMergingExtender = {
    _calculateAdditionalFilter: function() {
        var that = this,
            filters = [that.callBase()],
            columns = that.getController("columns").getColumns(),
            filterValue = this.option("filterValue"),
            calculatedFilterValue = utils.getFilterExpression(filterValue, columns, [{
                name: "anyof",
                calculateFilterExpression: function(filterValue, field) {
                    if(filterValue && filterValue.length > 0) {
                        return anyOf(field.dataField, filterValue);
                    }
                }
            }, {
                name: "noneof",
                calculateFilterExpression: function(filterValue, field) {
                    if(filterValue && filterValue.length > 0) {
                        return ["!", anyOf(field.dataField, filterValue)];
                    }
                }
            }], "filterBuilder");

        if(calculatedFilterValue) {
            filters.push(calculatedFilterValue);
        }

        return gridCoreUtils.combineFilters(filters);
    },

    optionChanged: function(args) {
        switch(args.name) {
            case "filterValue":
                this._applyFilter();
                args.handled = true;
                break;
            case "filterSyncEnabled":
                args.handled = true;
                break;
            default:
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
             * @default false
             */
            filterSyncEnabled: false
        };
    },
    controllers: {
        filterMerging: FilterMergingController
    },
    extenders: {
        controllers: {
            data: DataControllerFilterMergingExtender
        }
    }
};
