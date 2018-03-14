"use strict";

var modules = require("./ui.grid_core.modules"),
    utils = require("../filter_builder/utils"),
    gridCoreUtils = require("./ui.grid_core.utils");

var FilterMergingController = modules.Controller.inherit((function() {
    var setHeaderFilterValue = function(columnsController, column, headerFilterValue) {
        if(headerFilterValue) {
            if(headerFilterValue[0] === "!") {
                columnsController.columnOption(column.dataField, {
                    filterType: "exclude",
                    filterValues: headerFilterValue[1]
                });
            } else {
                columnsController.columnOption(column.dataField, {
                    filterType: "include",
                    filterValues: headerFilterValue
                });
            }
        }
    };

    var clearHeaderFilterValues = function(columnsController, column) {
        columnsController.columnOption(column.dataField, {
            filterType: "include",
            filterValues: undefined
        });
    };

    var setFilterRowCondition = function(columnsController, column, filterValue, selectedFilterOperation) {
        columnsController.columnOption(column.dataField, {
            filterValue: filterValue,
            selectedFilterOperation: selectedFilterOperation
        });
    };

    var clearFilterRowCondition = function(columnsController, column) {
        columnsController.columnOption(column.dataField, {
            filterValue: undefined,
            selectedFilterOperation: undefined
        });
    };

    return {
        syncFilterValue: function(isInit) {
            var that = this,
                columnsController = that.getController("columns"),
                columns = columnsController.getColumns(),
                filterValue = that.option("filterValue");

            columns.forEach(function(column) {
                var headerFilterValue = utils.getHeaderFilterValue(filterValue, column.dataField);
                if(headerFilterValue) {
                    setHeaderFilterValue(columnsController, column, headerFilterValue);
                } else if(column.filterValues && !isInit) {
                    clearHeaderFilterValues(columnsController, column);
                }

                var filterRowCondition = utils.getFilterRowCondition(filterValue, column.dataField);
                if(!headerFilterValue && filterRowCondition) {
                    setFilterRowCondition(columnsController, column, filterRowCondition[2], filterRowCondition[1]);
                } else if(column.filterValue && column.filterValues) {
                    clearFilterRowCondition(columnsController, column);
                }

                if(column.filterValues && !headerFilterValue) {
                    filterValue = that._getSyncHeaderFilter(filterValue, column);
                } else if(column.filterValue && !filterRowCondition) {
                    filterValue = that._getSyncFilterRow(filterValue, column, column.filterValue);
                }
            });

            if(filterValue && filterValue.length > 0) {
                that._setFilterValue(filterValue);
            }
        },

        init: function() {
            if(this.option("filterSyncEnabled")) {
                this.syncFilterValue(true);
            }
        },

        _setFilterValue: function(filterValue) {
            this.skipSyncFilterValue = true;
            this.option("filterValue", filterValue);
            this.skipSyncFilterValue = false;
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
                filter.push("anyof");
                filter.push(filterValues);
            } else {
                filter.push("=");
                filter.push(null);
            }
            return utils.syncFilters(filterValue, filter);
        },

        syncFilterRow: function(column, value) {
            this.option("filterValue", this._getSyncFilterRow(this.option("filterValue"), column, value));
        },

        syncHeaderFilter: function(column) {
            this._setFilterValue(this._getSyncHeaderFilter(this.option("filterValue"), column));
            clearFilterRowCondition(this.getController("columns"), column);
        },
    };
})());

function anyOf(field, filterValue) {
    var result = [],
        isExclude = field.filterType === "exclude",
        lastIndex = filterValue.length - 1;
    filterValue.forEach(function(value, index) {
        if(utils.isCondition(value) || utils.isGroup(value)) {
            result.push(utils.getFilterExpression(value, [field], [], "headerFilter"));
        } else {
            result.push(utils.getFilterExpression([field.dataField, "=", value], [field], [], "headerFilter"));
        }
        index !== lastIndex && result.push(isExclude ? "and" : "or");
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
                        return anyOf(field, filterValue);
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
                var filterMergingController = this.getController("filterMerging");
                if(!filterMergingController.skipSyncFilterValue) {
                    filterMergingController.syncFilterValue();
                }
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
