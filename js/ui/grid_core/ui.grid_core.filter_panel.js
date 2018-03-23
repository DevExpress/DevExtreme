"use strict";

var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    CheckBox = require("../check_box");

var FILTER_PANEL_CLASS = "filter-panel",
    FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + "-text",
    FILTER_PANEL_CHECKBOX_CLASS = FILTER_PANEL_CLASS + "-checkbox",
    FILTER_PANEL_CLEAR_FILTER_CLASS = FILTER_PANEL_CLASS + "-clear-filter";

var FilterPanelView = modules.View.inherit({
    _renderCore: function() {
        if(this.option("filterPanel.visible")) {
            this._renderPanelElement();
        }
    },

    _renderPanelElement: function() {
        var $element = this.element();
        $element.empty();
        $element
            .addClass(this.addWidgetPrefix(FILTER_PANEL_CLASS));

        if(this.option("filterValue") || this._filterValueBuffer) {
            $element.append(this._getCheckElement())
                .append(this._getTextElement())
                .append(this._getRemoveButtonElement());
        } else {
            $element.append(this._getTextElement());
        }
    },

    _getCheckElement: function() {
        var that = this,
            $element = $("<div>")
                .addClass(FILTER_PANEL_CHECKBOX_CLASS);

        that._createComponent($element, CheckBox, {
            value: that.option("filterValue") !== null,
            onValueChanged: function(e) {
                if(e.value) {
                    that.option("filterValue", that._filterValueBuffer);
                } else {
                    that._skipClearBuffer = true;
                    that._filterValueBuffer = that.option("filterValue");
                    that.option("filterValue", null);
                    that._skipClearBuffer = false;
                }
            }
        });
        return $element;
    },

    _getTextElement: function() {
        var that = this,
            $textElement = $("<div>")
            .addClass(FILTER_PANEL_TEXT_CLASS)
            .text(this.option("filterValue") || this._filterValueBuffer || "Create Filter")
            .click(function() {
                if(that._filterValueBuffer) {
                    that.option("filterBuilder.value", that._filterValueBuffer);
                } else {
                    that.option("filterBuilder.value", that.option("filterValue"));
                }
                that.option("filterBuilderPopup.visible", true);
            });
        return $textElement;
    },

    _getRemoveButtonElement: function() {
        var that = this,
            $element = $("<div>")
                .addClass(FILTER_PANEL_CLEAR_FILTER_CLASS)
                .text("Clear filter")
                .click(function() {
                    if(that._filterValueBuffer) {
                        that._filterValueBuffer = null;
                        that._renderPanelElement();
                    } else {
                        that.option("filterValue", null);
                    }
                });
        return $element;
    },

    optionChanged: function(args) {
        switch(args.name) {
            case "filterValue":
                this._invalidate();
                if(!this._skipClearBuffer) {
                    this._filterValueBuffer = null;
                }
                args.handled = true;
                break;
            case "filterPanel":
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
             * @type dxFilterPanelOptions
             * @default {}
             */
            filterPanel: {},
        };
    },
    views: {
        filterPanelView: FilterPanelView
    }
};
