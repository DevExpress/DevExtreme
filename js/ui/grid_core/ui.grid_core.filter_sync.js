import { isDefined } from "../../core/utils/type";
import modules from "./ui.grid_core.modules";
import utils from "../filter_builder/utils";
import errors from "../widget/ui.errors";
import gridCoreUtils from "./ui.grid_core.utils";
import filterUtils from "../shared/filtering";
import customOperations from "./ui.grid_core.filter_custom_operations";

var FILTER_ROW_OPERATIONS = ["=", "<>", "<", "<=", ">", ">=", "notcontains", "contains", "startswith", "endswith", "between"],
    FILTER_TYPES_INCLUDE = "include",
    FILTER_TYPES_EXCLUDE = "exclude";

function getColumnIdentifier(column) {
    return column.dataField || column.name;
}

function checkForErrors(columns) {
    columns.forEach(column => {
        let identifier = getColumnIdentifier(column);
        if(!isDefined(identifier) && column.allowFiltering) throw new errors.Error("E1049", column.caption);
    });
}

var FilterSyncController = modules.Controller.inherit((function() {
    var getEmptyFilterValues = function() {
        return {
            filterType: FILTER_TYPES_INCLUDE,
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
                filterType = FILTER_TYPES_INCLUDE;
                break;
            case "noneof":
            case "<>":
                filterType = FILTER_TYPES_EXCLUDE;
                break;
            default: return getEmptyFilterValues();
        }

        return {
            filterType: filterType,
            filterValues: hasArrayValue ? value : [value]
        };
    };

    var getConditionFromFilterRow = function(column) {
        var value = column.filterValue;
        if(isDefined(value)) {
            let operation = column.selectedFilterOperation || column.defaultFilterOperation || utils.getDefaultOperation(column),
                filter = [getColumnIdentifier(column), operation, column.filterValue];
            return filter;
        } else {
            return null;
        }
    };

    var getConditionFromHeaderFilter = function(column) {
        var selectedOperation,
            value,
            filterValues = column.filterValues;

        if(!filterValues) return null;

        if(canSyncHeaderFilterWithFilterRow(column) && column.filterValues.length === 1 && !Array.isArray(filterValues[0])) {
            column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = "<>" : selectedOperation = "=";
            value = filterValues[0];
        } else {
            column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = "noneof" : selectedOperation = "anyof";
            value = filterValues;
        }
        return [getColumnIdentifier(column), selectedOperation, value];
    };

    var updateHeaderFilterCondition = function(columnsController, column, headerFilterCondition) {
        var headerFilter = getHeaderFilterFromCondition(headerFilterCondition, column);
        columnsController.columnOption(getColumnIdentifier(column), headerFilter);
    };

    var updateFilterRowCondition = function(columnsController, column, condition) {
        var filterRowOptions,
            selectedFilterOperation = condition && condition[1],
            filterOperations = column.filterOperations || column.defaultFilterOperations;

        if((!filterOperations || filterOperations.indexOf(selectedFilterOperation) >= 0 || selectedFilterOperation === column.defaultFilterOperation)
            && FILTER_ROW_OPERATIONS.indexOf(selectedFilterOperation) >= 0) {
            if(selectedFilterOperation === column.defaultFilterOperation && !isDefined(column.selectedFilterOperation)) {
                selectedFilterOperation = column.selectedFilterOperation;
            }
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
        columnsController.columnOption(getColumnIdentifier(column), filterRowOptions);
    };

    return {
        syncFilterValue: function() {
            var that = this,
                columnsController = that.getController("columns"),
                columns = columnsController.getFilteringColumns();

            this._skipSyncColumnOptions = true;
            columns.forEach(function(column) {
                var filterConditions = utils.getMatchedConditions(that.option("filterValue"), getColumnIdentifier(column));
                if(filterConditions.length === 1) {
                    var filterCondition = filterConditions[0];
                    updateHeaderFilterCondition(columnsController, column, filterCondition);
                    updateFilterRowCondition(columnsController, column, filterCondition);
                } else {
                    isDefined(column.filterValues) && updateHeaderFilterCondition(columnsController, column);
                    isDefined(column.filterValue) && updateFilterRowCondition(columnsController, column);
                }
            });
            this._skipSyncColumnOptions = false;
        },

        _initSync: function() {
            let columns = this.getController("columns").getColumns(),
                dataController = this.getController("data"),
                pageIndex = dataController.pageIndex();

            checkForErrors(columns);
            if(!this.option("filterValue")) {
                let filteringColumns = this.getController("columns").getFilteringColumns(),
                    filterValue = this.getFilterValueFromColumns(filteringColumns);
                this.option("filterValue", filterValue);
            }
            this.syncFilterValue();

            dataController.pageIndex(pageIndex);
        },

        init: function() {
            let dataController = this.getController("data");
            if(dataController.isFilterSyncActive()) {
                if(this.getController("columns").isAllDataTypesDefined()) {
                    this._initSync();
                } else {
                    dataController.dataSourceChanged.add(() => this._initSync());
                }
            }
        },

        _getSyncFilterRow: function(filterValue, column) {
            var filter = getConditionFromFilterRow(column);
            if(isDefined(filter)) {
                return utils.syncFilters(filterValue, filter);
            } else {
                return utils.removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
            }
        },

        _getSyncHeaderFilter: function(filterValue, column) {
            var filter = getConditionFromHeaderFilter(column);
            if(filter) {
                return utils.syncFilters(filterValue, filter);
            } else {
                return utils.removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
            }
        },

        getFilterValueFromColumns: function(columns) {
            if(!this.getController("data").isFilterSyncActive()) {
                return null;
            }

            var filterValue = ["and"];

            columns && columns.forEach(column => {
                let headerFilter = getConditionFromHeaderFilter(column),
                    filterRow = getConditionFromFilterRow(column);

                headerFilter && utils.addItem(headerFilter, filterValue);
                filterRow && utils.addItem(filterRow, filterValue);
            });
            return utils.getNormalizedFilter(filterValue);
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

    isFilterSyncActive: function() {
        var filterSyncEnabledValue = this.option("filterSyncEnabled");
        return filterSyncEnabledValue === "auto" ? this.option("filterPanel.visible") : filterSyncEnabledValue;
    },

    skipCalculateColumnFilters: function() {
        return isDefined(this.option("filterValue")) && this.isFilterSyncActive();
    },

    _calculateAdditionalFilter: function() {
        var that = this;

        if(that.option("filterPanel.filterEnabled") === false) {
            return that.callBase();
        }

        var filters = [that.callBase()],
            columns = that.getController("columns").getFilteringColumns(),
            filterValue = that.option("filterValue");

        if(that.isFilterSyncActive()) {
            var currentColumn = that.getController("headerFilter").getCurrentColumn();
            if(currentColumn && filterValue) {
                filterValue = utils.removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(currentColumn));
            }
        }
        var customOperations = that.getController("filterSync").getCustomFilterOperations(),
            calculatedFilterValue = utils.getFilterExpression(filterValue, columns, customOperations, "filterBuilder");
        if(calculatedFilterValue) {
            filters.push(calculatedFilterValue);
        }

        return gridCoreUtils.combineFilters(filters);
    },

    _parseColumnPropertyName: function(fullName) {
        var matched = fullName.match(/.*\.(.*)/);
        return matched[1];
    },

    clearFilter: function(filterName) {
        this.component.beginUpdate();
        if(arguments.length > 0) {
            if(filterName === "filterValue") {
                this.option("filterValue", null);
            }
            this.callBase(filterName);
        } else {
            this.option("filterValue", null);
            this.callBase();
        }
        this.component.endUpdate();
    },

    optionChanged: function(args) {
        switch(args.name) {
            case "filterValue":
                this._applyFilter();
                this.isFilterSyncActive() && this.getController("filterSync").syncFilterValue();
                args.handled = true;
                break;
            case "filterSyncEnabled":
                args.handled = true;
                break;
            case "columns":
                if(this.isFilterSyncActive()) {
                    let column = this.getController("columns").getColumnByPath(args.fullName),
                        filterSyncController = this.getController("filterSync");
                    if(column && !filterSyncController._skipSyncColumnOptions) {
                        let propertyName = this._parseColumnPropertyName(args.fullName);
                        filterSyncController._skipSyncColumnOptions = true;
                        if("filterType" === propertyName) {
                            if(FILTER_TYPES_EXCLUDE === args.value || FILTER_TYPES_EXCLUDE === args.previousValue) {
                                filterSyncController.syncHeaderFilter(column);
                            }
                        } else if("filterValues" === propertyName) {
                            filterSyncController.syncHeaderFilter(column);
                        } else if(["filterValue", "selectedFilterOperation"].indexOf(propertyName) > -1) {
                            filterSyncController.syncFilterRow(column, column.filterValue);
                        }
                        filterSyncController._skipSyncColumnOptions = false;
                    }
                }
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    }
};

var ColumnHeadersViewFilterSyncExtender = {
    _isHeaderFilterEmpty: function(column) {
        if(this.getController("data").isFilterSyncActive()) {
            return !utils.filterHasField(this.option("filterValue"), getColumnIdentifier(column));
        }

        return this.callBase(column);
    },

    _needUpdateFilterIndicators: function() {
        return !this.getController("data").isFilterSyncActive();
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
             * @name GridBaseOptions.filterValue
             * @type Filter expression
             * @default null
             * @fires GridBase.onOptionChanged
             */
            filterValue: null,

            /**
             * @name GridBaseOptions.filterSyncEnabled
             * @type boolean|Enums.Mode
             * @default "auto"
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
