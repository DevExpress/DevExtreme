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
        if(this.option("filterBuilderPopup.visible")) {
            this._initPopup();
        } else if(this._filterBuilderPopup) {
            this._filterBuilderPopup.hide();
        }
    },

    _disposePopup: function() {
        this._filterBuilderPopup.dispose();
        this._filterBuilderPopup = undefined;
        this._filterBuilder.dispose();
        this._filterBuilder = undefined;
    },

    _initPopup: function() {
        var that = this;

        that._filterBuilderPopup && that._disposePopup();
        that._filterBuilderPopup = that._createComponent(that.element(), Popup, extend({
            title: messageLocalization.format("dxDataGrid-filterBuilderPopupTitle"),
            contentTemplate: function($contentElement) {
                return that._getPopupContentTemplate($contentElement);
            },
            onOptionChanged: function(args) {
                if(args.name === "visible") {
                    that.option("filterBuilderPopup.visible", args.value);
                }
            },
            toolbarItems: that._getPopupToolbarItems(),
        }, that.option("filterBuilderPopup"), {
            onHidden: function(e) {
                that._disposePopup();
            }
        }));
    },

    _getPopupContentTemplate: function(contentElement) {
        var $contentElement = $(contentElement),
            $filterBuilderContainer = $("<div>").appendTo($contentElement),
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
            fields: fields
        }, this.option("filterBuilder"), {
            customOperations: customOperations
        }));

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
             * @name GridBaseOptions_filterBuilderPopup
             * @publicName filterBuilderPopup
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
