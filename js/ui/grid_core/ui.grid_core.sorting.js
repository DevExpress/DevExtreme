"use strict";

var commonUtils = require("../../core/utils/common");

var DATAGRID_SORT_CLASS = "dx-sort",
    DATAGRID_SORT_NONE_CLASS = "dx-sort-none",
    DATAGRID_SORTUP_CLASS = "dx-sort-up",
    DATAGRID_SORTDOWN_CLASS = "dx-sort-down",
    DATAGRID_HEADERS_ACTION_CLASS = "dx-datagrid-action";


exports.sortingMixin = {
    _applyColumnState: function(options) {
        var that = this,
            side,
            ariaSortState,
            $sortIndicator,
            sortingMode = that.option("sorting.mode"),
            rootElement = options.rootElement,
            column = options.column,
            $indicatorsContainer = that._getIndicatorContainer(rootElement);

        if(options.name === "sort") {
            side = that.option("rtlEnabled") ? "right" : "left";
            rootElement.find("." + DATAGRID_SORT_CLASS).remove();
            !$indicatorsContainer.children().length && $indicatorsContainer.remove();

            if((sortingMode === "single" || sortingMode === "multiple") && column.allowSorting || commonUtils.isDefined(column.sortOrder)) {
                ariaSortState = column.sortOrder === "asc" ? "ascending" : "descending";
                $sortIndicator = that.callBase(options)
                    .toggleClass(DATAGRID_SORTUP_CLASS, column.sortOrder === "asc")
                    .toggleClass(DATAGRID_SORTDOWN_CLASS, column.sortOrder === "desc");

                options.rootElement.addClass(DATAGRID_HEADERS_ACTION_CLASS);
            }

            if(!commonUtils.isDefined(column.sortOrder)) {
                that.setAria("sort", "none", rootElement);
            } else {
                that.setAria("sort", ariaSortState, rootElement);
            }

            return $sortIndicator;
        } else {
            return that.callBase(options);
        }
    },

    _getIndicatorClassName: function(name) {
        if(name === "sort") {
            return DATAGRID_SORT_CLASS;
        }
        return this.callBase(name);
    },

    _renderIndicator: function(options) {
        var rtlEnabled,
            column = options.column,
            $container = options.container,
            $indicator = options.indicator;

        if(options.name === "sort") {
            rtlEnabled = this.option("rtlEnabled");

            if(!commonUtils.isDefined(column.sortOrder)) {
                $indicator && $indicator.addClass(DATAGRID_SORT_NONE_CLASS);
            }

            if($container.children().length && (!rtlEnabled && options.columnAlignment === "left" || rtlEnabled && options.columnAlignment === "right")) {
                $container.prepend($indicator);
                return;
            }
        }

        this.callBase(options);
    },

    _updateIndicator: function($cell, column, indicatorName) {
        if(indicatorName === "sort" && commonUtils.isDefined(column.groupIndex)) {
            return;
        }

        return this.callBase.apply(this, arguments);
    },

    _getIndicatorElements: function($cell, returnAll) {
        var $indicatorElements = this.callBase($cell);

        return returnAll ? $indicatorElements : $indicatorElements && $indicatorElements.not("." + DATAGRID_SORT_NONE_CLASS);
    }
};
