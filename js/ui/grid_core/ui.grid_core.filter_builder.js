"use strict";

var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    extend = require("../../core/utils/extend").extend,
    FilterBuilder = require("./../filter_builder"),
    messageLocalization = require("../../localization/message"),
    ScrollView = require("./../scroll_view"),
    Popup = require("./../popup");

var FilterBuilderView = modules.View.inherit({
    _renderCore: function() {
        this._updatePopupOptions();
    },

    _updatePopupOptions: function() {
        if(this.option("filterBuilderPopup.visible") && !this._filterBuilderPopup) {
            this._initPopup();
        } else {
            this._filterBuilderPopup && this._filterBuilderPopup.option(this._getPopupOptions());
        }
    },

    _getPopupOptions: function() {
        var that = this;

        return extend({
            title: messageLocalization.format("dxDataGrid-filterBuilderPopupTitle"),
            contentTemplate: function($contentElement) {
                return that._getPopupContentTemplate($contentElement);
            },
            onOptionChanged: function(args) {
                if(args.name === "visible") {
                    that.option("filterBuilderPopup.visible", args.value);
                }
            },
            toolbarItems: that._getPopupToolbarItems()
        }, that.option("filterBuilderPopup"));
    },

    _initPopup: function() {
        var that = this,
            $popupContainer = this.element();
        that._filterBuilderPopup = that._createComponent($popupContainer, Popup, extend(that._getPopupOptions()));
    },

    _getPopupContentTemplate: function($contentElement) {
        var $filterBuilderContainer = $("<div>").appendTo($contentElement),
            fields = this.getController("columns").getColumns(),
            customOperations = this.getController("filterSync").getCustomFilterOperations();

        fields = fields.filter(function(item) {
            return item.allowFiltering;
        }).map(function(item) {
            var column = extend({}, item, { filterOperations: null });
            return column;
        });

        this._filterBuilder = this._createComponent($filterBuilderContainer, FilterBuilder, extend({
            value: this.option("filterValue"),
            customOperations: customOperations,
            fields: fields
        }, this.option("filterBuilder")));

        this._createComponent($contentElement, ScrollView, { direction: "both" });
    },

    _getPopupToolbarItems: function() {
        var that = this;
        return [
            {
                toolbar: "bottom",
                location: "after",
                widget: "dxButton",
                options: {
                    text: messageLocalization.format("OK"),
                    onClick: function(e) {
                        var filter = that._filterBuilder.option("value");
                        that.option("filterValue", filter);
                        that._filterBuilderPopup.hide();
                    }
                }
            },
            {
                toolbar: "bottom",
                location: "after",
                widget: "dxButton",
                options: {
                    text: messageLocalization.format("Cancel"),
                    onClick: function(e) {
                        that._filterBuilderPopup.hide();
                    }
                }
            }
        ];
    },

    optionChanged: function(args) {
        switch(args.name) {
            case "filterBuilder":
            case "filterBuilderPopup":
                this._invalidate();
                args.handled = true;
                break;
            default:
                this.callBase(args);
        }
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions_filterBuilder
             * @publicName filterBuilder
             * @type dxFilterBuilderOptions
             * @default {}
             */
            filterBuilder: {
                groupOperationDescriptions: {
                    and: messageLocalization.format("dxFilterBuilder-and"),
                    or: messageLocalization.format("dxFilterBuilder-or"),
                    notAnd: messageLocalization.format("dxFilterBuilder-notAnd"),
                    notOr: messageLocalization.format("dxFilterBuilder-notOr"),
                },
            },

            /**
             * @name GridBaseOptions_filterPopup
             * @publicName filterPopup
             * @type dxPopupOptions
             * @default {}
             */
            filterBuilderPopup: {}
        };
    },
    views: {
        filterBuilderView: FilterBuilderView
    }
};
