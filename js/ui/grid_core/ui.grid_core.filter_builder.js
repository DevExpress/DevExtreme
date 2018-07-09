"use strict";

import $ from "../../core/renderer";
import modules from "./ui.grid_core.modules";
import { extend } from "../../core/utils/extend";
import FilterBuilder from "./../filter_builder";
import messageLocalization from "../../localization/message";
import ScrollView from "./../scroll_view";
import Popup from "./../popup";

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
        if(this._filterBuilderPopup) {
            this._filterBuilderPopup.dispose();
            this._filterBuilderPopup = undefined;
        }
        if(this._filterBuilder) {
            this._filterBuilder.dispose();
            this._filterBuilder = undefined;
        }
    },

    _initPopup: function() {
        var that = this;

        that._disposePopup();
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
            $filterBuilderContainer = $("<div>").appendTo($(contentElement));

        this._filterBuilder = this._createComponent($filterBuilderContainer, FilterBuilder, extend({
            value: this.option("filterValue"),
            fields: this.getController("columns").getFilteringColumns(),
        }, this.option("filterBuilder"), {
            customOperations: this.getController("filterSync").getCustomFilterOperations()
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
             * @name GridBaseOptions.filterBuilder
             * @type dxFilterBuilderOptions
             * @default {}
             */
            filterBuilder: {
                groupOperationDescriptions: {
                    and: messageLocalization.format("dxFilterBuilder-and"),
                    or: messageLocalization.format("dxFilterBuilder-or"),
                    notAnd: messageLocalization.format("dxFilterBuilder-notAnd"),
                    notOr: messageLocalization.format("dxFilterBuilder-notOr")
                },
                filterOperationDescriptions: {
                    between: messageLocalization.format("dxFilterBuilder-filterOperationBetween"),
                    equal: messageLocalization.format("dxFilterBuilder-filterOperationEquals"),
                    notEqual: messageLocalization.format("dxFilterBuilder-filterOperationNotEquals"),
                    lessThan: messageLocalization.format("dxFilterBuilder-filterOperationLess"),
                    lessThanOrEqual: messageLocalization.format("dxFilterBuilder-filterOperationLessOrEquals"),
                    greaterThan: messageLocalization.format("dxFilterBuilder-filterOperationGreater"),
                    greaterThanOrEqual: messageLocalization.format("dxFilterBuilder-filterOperationGreaterOrEquals"),
                    startsWith: messageLocalization.format("dxFilterBuilder-filterOperationStartsWith"),
                    contains: messageLocalization.format("dxFilterBuilder-filterOperationContains"),
                    notContains: messageLocalization.format("dxFilterBuilder-filterOperationNotContains"),
                    endsWith: messageLocalization.format("dxFilterBuilder-filterOperationEndsWith"),
                    isBlank: messageLocalization.format("dxFilterBuilder-filterOperationIsBlank"),
                    isNotBlank: messageLocalization.format("dxFilterBuilder-filterOperationIsNotBlank")
                }
            },

            /**
             * @name GridBaseOptions.filterBuilderPopup
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
