"use strict";

var modules = require("./ui.grid_core.modules"),
    utils = require("../filter_builder/utils"),
    gridCoreUtils = require("./ui.grid_core.utils");

var FilterMergingController = modules.Controller.inherit((function() {
    return {
        init: function() {
        },

        syncFilterRow: function(filter) {
            var syncFilter = utils.syncFilters(this.option("filterValue"), filter);
            this.option("filterValue", syncFilter);
        },
    };
})());

var DataControllerFilterMergingExtender = {
    _calculateAdditionalFilter: function() {
        var that = this,
            filters = [that.callBase()],
            columns = that._columnsController.getColumns(),
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
