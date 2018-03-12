"use strict";

var modules = require("./ui.grid_core.modules"),
    utils = require("../filter_builder/utils"),
    gridCoreUtils = require("./ui.grid_core.utils");

var FilterMergingController = modules.Controller.inherit((function() {
    return {
        _initSync: function() {
            var columns = this.getController("columns").getColumns(),
                filterValue = this.option("filterValue");
            for(var i = 0; i < columns.length; i++) {
                if(columns[i].filterValue) {
                    filterValue = this._getSyncFilterRow(filterValue, columns[i], columns[i].filterValue);
                }
            }

            if(filterValue && filterValue.length > 0) {
                this.option("filterValue", filterValue);
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

        syncFilterRow: function(column, value) {
            this.option("filterValue", this._getSyncFilterRow(this.option("filterValue"), column, value));
        },
    };
})());

var DataControllerFilterMergingExtender = {
    _calculateAdditionalFilter: function() {
        var that = this,
            filters = [that.callBase()],
            columns = that.getController("columns").getColumns(),
            filterValue = this.option("filterValue"),
            calculatedFilterValue = utils.getFilterExpression(filterValue, columns, [], "filterBuilder");

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
