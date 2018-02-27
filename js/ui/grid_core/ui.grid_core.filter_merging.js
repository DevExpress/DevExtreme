"use strict";

var modules = require("./ui.grid_core.modules"),
    utils = require("../filter_builder/utils"),
    gridCoreUtils = require("./ui.grid_core.utils");

var FilterMergingController = modules.ViewController.inherit((function() {
    return {
        init: function() {
        },

        optionChanged: function(args) {
            switch(args.name) {
                case "filterValue":
                    this._invalidate();
                    args.handled = true;
                    break;
                default:
                    this.callBase(args);
            }
        }
    };
})());

var DataControllerFilterMergingExtender = {
    _calculateAdditionalFilter: function() {
        var that = this,
            filters = [that.callBase()],
            columns = that._columnsController.getVisibleColumns(),
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
                this._invalidate();
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
            filterValue: null
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
