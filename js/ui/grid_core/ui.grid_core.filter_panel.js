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
                .append(this._getFilterElement())
                .append(this._getTextElement())
                .append(this._getRemoveButtonElement());
        } else {
            $element.append(this._getFilterElement())
                .append(this._getTextElement());
        }
    },

    _getCheckElement: function() {
        var that = this,
            $element = $("<div>")
                .addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));

        that._createComponent($element, CheckBox, {
            value: that.option("filterPanel.filterEnabled"),
            onValueChanged: function(e) {
                that.option("filterPanel.filterEnabled", e.value);
            }
        });
        $element.attr("title", this.option("filterPanel.texts.filterEnabledHint"));
        return $element;
    },

    _getFilterElement: function() {
        var that = this,
            $element = $("<div>").addClass("dx-icon-filter");
        eventsEngine.on($element, "click", function() {
            that.option("filterBuilderPopup.visible", true);
        });
        return $element;
    },

    _getTextElement: function() {
        var that = this,
            $textElement = $("<div>").addClass(this.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS)),
            filterText,
            filterValue = this.option("filterValue");
        if(filterValue) {
            var columns = that.getController("columns").getColumns();
            filterText = utils.getFilterText(filterValue, this.getController("filterSync").getCustomFilterOperations(), columns, that.option("filterRow.operationDescriptions"), that.option("filterBuilder.groupOperationDescriptions"));
            var customizeText = this.option("filterPanel.customizeText");
            if(customizeText) {
                var customText = customizeText({
                    component: that.component,
                    filterValue: filterValue,
                    text: filterText
                });
                if(typeof customText === "string") {
                    filterText = customText;
                }
            }
        } else {
            filterText = this.option("filterPanel.texts.createFilter");
        }
        eventsEngine.on($textElement, "click", function() {
            that.option("filterBuilderPopup.visible", true);
        });
        $textElement.text(filterText);
        return $textElement;
    },

    _getRemoveButtonElement: function() {
        var that = this,
            $element = $("<div>")
                .addClass(this.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS))
                .text(this.option("filterPanel.texts.clearFilter"));
        eventsEngine.on($element, "click", function() {
            that.option("filterValue", null);
        });
        return $element;
    },

    optionChanged: function(args) {
        switch(args.name) {
            case "filterValue":
                this._invalidate();
                this.option("filterPanel.filterEnabled", true);
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
                 * @name GridBaseOptions_filterPanel_filterEnabled
                 * @publicName filterEnabled
                 * @type boolean
                 * @default true
                 */
                filterEnabled: true,

                /**
                 * @name GridBaseOptions_filterPanel_customizeText
                 * @publicName customizeText
                 * @type function
                 * @type_function_param1 e:object
                 * @type_function_param1_field1 component:Component
                 * @type_function_param1_field2 filterValue:object
                 * @type_function_param1_field3 text:string
                 * @type_function_return string
                 */

                /**
                 * @name GridBaseOptions_filterPanel_texts
                 * @publicName texts
                 * @type dxFilterPanelTexts
                 * @default {}
                 */
                texts: {
                    /**
                     * @name GridBaseOptions_filterPanel_texts_createFilter
                     * @publicName createFilter
                     * @type string
                     * @default "Create Filter"
                     */
                    createFilter: messageLocalization.format("dxDataGrid-filterPanelCreateFilter"),

                    /**
                     * @name GridBaseOptions_filterPanel_texts_clearFilter
                     * @publicName clearFilter
                     * @type string
                     * @default "Clear"
                     */
                    clearFilter: messageLocalization.format("dxDataGrid-filterPanelClearFilter"),

                    /**
                     * @name GridBaseOptions_filterPanel_texts_filterEnabledHint
                     * @publicName filterEnabledHint
                     * @type string
                     * @default "Apply Filter"
                     */
                    filterEnabledHint: messageLocalization.format("dxDataGrid-filterPanelFilterEnabledHint"),
                }
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
        }
    }
};
