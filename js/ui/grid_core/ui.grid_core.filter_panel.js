"use strict";

var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    gridUtils = require("./ui.grid_core.utils"),
    eventsEngine = require("../../events/core/events_engine"),
    messageLocalization = require("../../localization/message"),
    CheckBox = require("../check_box"),
    utils = require("../filter_builder/utils"),
    inflector = require("../../core/utils/inflector");

var FILTER_PANEL_CLASS = "filter-panel",
    FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + "-text",
    FILTER_PANEL_CHECKBOX_CLASS = FILTER_PANEL_CLASS + "-checkbox",
    FILTER_PANEL_CLEAR_FILTER_CLASS = FILTER_PANEL_CLASS + "-clear-filter",
    FILTER_PANEL_LEFT_CONTAINER = FILTER_PANEL_CLASS + "-left";

var FilterPanelView = modules.View.inherit({
    _renderCore: function() {
        if(this.option("filterPanel.visible")) {
            this._renderPanelElement();
        }
    },

    _renderPanelElement: function() {
        var that = this,
            $element = that.element(),
            $leftContainer;

        $element
            .empty()
            .addClass(that.addWidgetPrefix(FILTER_PANEL_CLASS));
        $leftContainer = $("<div>")
            .addClass(that.addWidgetPrefix(FILTER_PANEL_LEFT_CONTAINER))
            .appendTo($element);

        if(that.option("filterValue") || that._filterValueBuffer) {
            $leftContainer.append(that._getCheckElement())
                .append(that._getFilterElement())
                .append(that._getTextElement());
            $element.append(that._getRemoveButtonElement());
        } else {
            $leftContainer.append(that._getFilterElement())
                .append(that._getTextElement());
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
            $textElement = $("<div>").addClass(that.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS)),
            filterText,
            filterValue = that.option("filterValue");
        if(filterValue) {
            filterText = that.getFilterText(filterValue, that.getController("filterSync").getCustomFilterOperations());
            var customizeText = that.option("filterPanel.customizeText");
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
            filterText = that.option("filterPanel.texts.createFilter");
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
    },

    getConditionText: function(filterValue, options) {
        var operation = filterValue[1],
            customOperation = utils.getCustomOperation(options.customOperations, operation),
            operationText,
            field = utils.getField(filterValue[0], options.columns),
            fieldText = field.caption,
            value = filterValue[2],
            valueText;

        if(customOperation) {
            operationText = customOperation.caption || inflector.captionize(customOperation.name);
        } else {
            operationText = utils.getCaptionByOperation(operation, options.filterOperationDescriptions);
        }

        if(Array.isArray(value)) {
            valueText = `('${value.join("', '")}')`;
        } else {
            var displayValue = gridUtils.getDisplayValue(field, value);
            valueText = ` '${(utils.getCurrentValueText)(field, displayValue, customOperation)}'`;
        }

        return `[${fieldText}] ${operationText}${valueText}`;
    },

    getGroupText: function(filterValue, options) {
        var that = this,
            result = [],
            groupValue = utils.getGroupValue(filterValue);

        filterValue.forEach(function(item) {
            if(utils.isCondition(item)) {
                result.push(that.getConditionText(item, options));
            } else if(utils.isGroup(item)) {
                result.push(`(${that.getGroupText(item, options)})`);
            }
        });

        if(groupValue[0] === "!") {
            var groupText = options.groupOperationDescriptions["not" + groupValue.substring(1, 2).toUpperCase() + groupValue.substring(2)].split(" ");
            return `${groupText[0]} ${result}`;
        }

        return result.join(` ${options.groupOperationDescriptions[groupValue]} `);
    },

    getFilterText: function(filterValue, customOperations) {
        var that = this,
            options = {
                customOperations: customOperations,
                columns: that.getController("columns").getColumns(),
                filterOperationDescriptions: that.option("filterRow.operationDescriptions"),
                groupOperationDescriptions: that.option("filterBuilder.groupOperationDescriptions")
            };
        return utils.isCondition(filterValue) ? that.getConditionText(filterValue, options) : that.getGroupText(filterValue, options);
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions_filterPanel
             * @publicName filterPanel
             * @type object
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
                 * @type object
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
                     * @default "Enable the filter"
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
