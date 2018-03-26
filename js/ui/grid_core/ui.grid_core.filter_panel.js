"use strict";

var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    eventsEngine = require("../../events/core/events_engine"),
    messageLocalization = require("../../localization/message"),
    CheckBox = require("../check_box"),
    utils = require("../filter_builder/utils");

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
                .addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));

        that._createComponent($element, CheckBox, {
            value: that.option("filterPanel.applyFilterValue"),
            onValueChanged: function(e) {
                that.option("filterPanel.applyFilterValue", e.value);
            }
        });
        return $element;
    },

    _getTextElement: function() {
        var that = this,
            $textElement = $("<div>").addClass(this.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS)),
            filterText,
            filterValue = this.option("filterValue");
        if(filterValue) {
            var customizeFilterText = this.option("filterPanel.customizeFilterText");
            if(customizeFilterText) {
                filterText = customizeFilterText(filterValue);
            } else {
                var columns = that.getController("columns").getColumns();
                filterText = utils.getFilterText(filterValue, this.getController("filterSync").getCustomFilterOperations(), columns, that.option("filterRow.operationDescriptions"), that.option("filterBuilder.groupOperationDescriptions"));
            }
        } else {
            filterText = this.option("filterPanel.createFilterText");
        }
        $textElement.text(filterText);
        eventsEngine.on($textElement, "click", function() {
            that.option("filterBuilderPopup.visible", true);
        });
        return $textElement;
    },

    _getRemoveButtonElement: function() {
        var that = this,
            $element = $("<div>")
                .addClass(this.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS))
                .text("Clear filter");
        eventsEngine.on($element, "click", function() {
            that.option("filterValue", null);
        });
        return $element;
    },

    optionChanged: function(args) {
        switch(args.name) {
            case "filterValue":
                this._invalidate();
                this.option("filterPanel.applyFilterValue", true);
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
             * @name GridBaseOptions_filterPanel
             * @publicName filterPanel
             * @type dxFilterPanelOptions
             * @default {}
             */
            filterPanel: {
                /**
                 * @name GridBaseOptions_filterPanel_visible
                 * @publicName visible
                 * @type boolean
                 * @default false
                 */
                visible: false,

                /**
                 * @name GridBaseOptions_filterPanel_applyFilterValue
                 * @publicName applyFilterValue
                 * @type boolean
                 * @default true
                 */
                applyFilterValue: true,
                /**
                 * @name GridBaseOptions_filterPanel_createFilterText
                 * @publicName createFilterText
                 * @type string
                 * @default "Create Filter"
                 */
                createFilterText: messageLocalization.format("dxDataGrid-filterPanelCreateFilter"),

                /**
                 * @name GridBaseOptions_filterPanel_customizeFilterText
                 * @publicName customizeFilterText
                 * @type function(filterValue)
                 * @type_function_param1 filterValue:object
                 * @type_function_return string
                 */
            },
        };
    },
    views: {
        filterPanelView: FilterPanelView
    },
    extenders: {
        controllers: {
            data: {
                optionChanged: function(args) {
                    switch(args.name) {
                        case "filterPanel":
                            this._applyFilter();
                            args.handled = true;
                            break;
                        default:
                            this.callBase(args);
                    }
                }
            }
        },
    }
};
