"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    eventsEngine = require("../../events/core/events_engine"),
    Widget = require("../widget/ui.widget"),
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    messageLocalization = require("../../localization/message"),
    utils = require("./utils"),
    ContextMenu = require("../context_menu"),
    TreeView = require("../tree_view"),
    Popup = require("../popup"),
    EditorFactoryMixin = require("../shared/ui.editor_factory_mixin");

var FILTER_BUILDER_CLASS = "dx-filterbuilder",
    FILTER_BUILDER_GROUP_CLASS = "dx-filterbuilder-group",
    FILTER_BUILDER_GROUP_ITEM_CLASS = "dx-filterbuilder-group-item",
    FILTER_BUILDER_GROUP_CONTENT_CLASS = "dx-filterbuilder-group-content",
    FILTER_BUILDER_GROUP_OPERATION_CLASS = "dx-filterbuilder-group-operation",
    FILTER_BUILDER_ACTION_CLASS = "dx-filterbuilder-action",
    FILTER_BUILDER_IMAGE_CLASS = "dx-filterbuilder-action-icon",
    FILTER_BUILDER_IMAGE_ADD_CLASS = "dx-icon-plus",
    FILTER_BUILDER_IMAGE_REMOVE_CLASS = "dx-icon-remove",
    FILTER_BUILDER_ITEM_TEXT_CLASS = "dx-filterbuilder-text",
    FILTER_BUILDER_ITEM_FIELD_CLASS = "dx-filterbuilder-item-field",
    FILTER_BUILDER_ITEM_OPERATION_CLASS = "dx-filterbuilder-item-operation",
    FILTER_BUILDER_ITEM_VALUE_CLASS = "dx-filterbuilder-item-value",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = "dx-filterbuilder-item-value-text",
    FILTER_BUILDER_OVERLAY_CLASS = "dx-filterbuilder-overlay",
    ACTIVE_CLASS = "dx-state-active";

var ACTIONS = [
        "onEditorPreparing", "onEditorPrepared"
    ],
    OPERATORS = {
        and: "And",
        or: "Or",
        notAnd: "!And",
        notOr: "!Or"
    };

var EditorFactory = Class.inherit(EditorFactoryMixin);

var FilterBuilder = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
              * @name dxFilterBuilderOptions_onEditorPreparing
              * @publicName onEditorPreparing
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field4 value:any
              * @type_function_param1_field5 setValue(newValue):any
              * @type_function_param1_field6 cancel:boolean
              * @type_function_param1_field7 editorElement:jQuery
              * @type_function_param1_field8 editorName:string
              * @type_function_param1_field9 editorOptions:object
              * @type_function_param1_field10 dataField:string
              * @extends Action
              * @action
             */
            onEditorPreparing: null,

            /**
              * @name dxFilterBuilderOptions_onEditorPrepared
              * @publicName onEditorPrepared
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field4 value:any
              * @type_function_param1_field5 setValue(newValue):any
              * @type_function_param1_field6 cancel:boolean
              * @type_function_param1_field7 editorElement:jQuery
              * @type_function_param1_field8 editorName:string
              * @type_function_param1_field9 editorOptions:object
              * @type_function_param1_field10 dataField:string
              * @extends Action
              * @action
             */
            onEditorPrepared: null,

            /**
            * @name dxFilterBuilderOptions_fields
            * @publicName fields
            * @type Array<dxFilterBuilderField>
            * @default []
            */
            fields: [],

            /**
            * @name dxFilterBuilderField_caption
            * @publicName caption
            * @type string
            * @default undefined
            */

            /**
            * @name dxFilterBuilderField_dataField
            * @publicName dataField
            * @type string
            * @default undefined
            */

            /**
             * @name dxFilterBuilderField_dataType
             * @publicName dataType
             * @type string
             * @default "string"
             * @acceptValues "string" | "number" | "date" | "datetime" | "boolean" | "object"
             */

            /**
             * @name dxFilterBuilderField_format
             * @publicName format
             * @type format
             * @default ""
             */

            /**
             * @name dxFilterBuilderField_trueText
             * @publicName trueText
             * @type string
             * @default "true"
             */

            /**
             * @name dxFilterBuilderField_falseText
             * @publicName falseText
             * @type string
             * @default "false"
             */

            /**
             * @name dxFilterBuilderField_lookup
             * @publicName lookup
             * @type object
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField_lookup_dataSource
             * @publicName dataSource
             * @type Array<any>|DataSourceOptions
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField_lookup_valueExpr
             * @publicName valueExpr
             * @type string|function(data)
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField_lookup_displayExpr
             * @publicName displayExpr
             * @type string|function(data)
             * @type_function_param1 data:object
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField_lookup_allowClearing
             * @publicName allowClearing
             * @type boolean
             * @default false
             */

            /**
             * @name dxFilterBuilderField_defaultFilterOperation
             * @publicName defaultFilterOperation
             * @type string
             * @acceptValues "=" | "<>" | "<" | "<=" | ">" | ">=" | "notcontains" | "contains" | "startswith" | "endswith" | "isblank" | "isnotblank"
             * @default
             * @hidden
             */

            /**
             * @name dxFilterBuilderField_filterOperations
             * @publicName filterOperations
             * @type Array<string>
             * @acceptValues "=" | "<>" | "<" | "<=" | ">" | ">=" | "notcontains" | "contains" | "startswith" | "endswith" | "isblank" | "isnotblank"
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField_customizeText
             * @publicName customizeText
             * @type function(fieldInfo)
             * @type_function_param1 fieldInfo:object
             * @type_function_param1_field1 value:string|number|date
             * @type_function_param1_field2 valueText:string
             * @type_function_return string
             */

            /**
            * @name dxFilterBuilderOptions_defaultGroupOperation
            * @publicName defaultGroupOperation
            * @type string
            * @default "And"
            * @hidden
            */
            defaultGroupOperation: "And",

            /**
             * @name dxFilterBuilderOptions_value
             * @publicName value
             * @type Filter expression
             * @default null
             */
            value: null,

            /**
             * @name dxFilterBuilderOptions_allowHierarchicalFields
             * @publicName allowHierarchicalFields
             * @type boolean
             * @default false
             */
            allowHierarchicalFields: false,

            /**
             * @name dxFilterBuilderOptions_groupOperationDescriptions
             * @publicName groupOperationDescriptions
             * @type object
             */
            groupOperationDescriptions: {
                /**
                 * @name dxFilterBuilderOptions_groupOperationDescriptions_and
                 * @publicName and
                 * @type string
                 * @default "And"
                 */
                and: messageLocalization.format("dxFilterBuilder-and"),
                /**
                 * @name dxFilterBuilderOptions_groupOperationDescriptions_or
                 * @publicName or
                 * @type string
                 * @default "Or"
                 */
                or: messageLocalization.format("dxFilterBuilder-or"),
                /**
                 * @name dxFilterBuilderOptions_groupOperationDescriptions_notAnd
                 * @publicName notAnd
                 * @type string
                 * @default "Not And"
                 */
                notAnd: messageLocalization.format("dxFilterBuilder-notAnd"),
                /**
                 * @name dxFilterBuilderOptions_groupOperationDescriptions_notOr
                 * @publicName notOr
                 * @type string
                 * @default "Not Or"
                 */
                notOr: messageLocalization.format("dxFilterBuilder-notOr"),
            },

            /**
             * @name dxFilterBuilderOptions_filterOperationDescriptions
             * @publicName filterOperationDescriptions
             * @type object
             */
            filterOperationDescriptions: {
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_equal
                 * @publicName equal
                 * @type string
                 * @default "Equals"
                 */
                equal: messageLocalization.format("dxFilterBuilder-filterOperationEquals"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_notEqual
                 * @publicName notEqual
                 * @type string
                 * @default "Does not equal"
                 */
                notEqual: messageLocalization.format("dxFilterBuilder-filterOperationNotEquals"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_lessThan
                 * @publicName lessThan
                 * @type string
                 * @default "Less than"
                 */
                lessThan: messageLocalization.format("dxFilterBuilder-filterOperationLess"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_lessThanOrEqual
                 * @publicName lessThanOrEqual
                 * @type string
                 * @default "Less than or equal to"
                 */
                lessThanOrEqual: messageLocalization.format("dxFilterBuilder-filterOperationLessOrEquals"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_greaterThan
                 * @publicName greaterThan
                 * @type string
                 * @default "Greater than"
                 */
                greaterThan: messageLocalization.format("dxFilterBuilder-filterOperationGreater"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_greaterThanOrEqual
                 * @publicName greaterThanOrEqual
                 * @type string
                 * @default "Greater than or equal to"
                 */
                greaterThanOrEqual: messageLocalization.format("dxFilterBuilder-filterOperationGreaterOrEquals"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_startsWith
                 * @publicName startsWith
                 * @type string
                 * @default "Starts with"
                 */
                startsWith: messageLocalization.format("dxFilterBuilder-filterOperationStartsWith"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_contains
                 * @publicName contains
                 * @type string
                 * @default "Contains"
                 */
                contains: messageLocalization.format("dxFilterBuilder-filterOperationContains"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_notContains
                 * @publicName notContains
                 * @type string
                 * @default "Does not contain"
                 */
                notContains: messageLocalization.format("dxFilterBuilder-filterOperationNotContains"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_endsWith
                 * @publicName endsWith
                 * @type string
                 * @default "Ends with"
                 */
                endsWith: messageLocalization.format("dxFilterBuilder-filterOperationEndsWith"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_isBlank
                 * @publicName isBlank
                 * @type string
                 * @default "Is blank"
                 */
                isBlank: messageLocalization.format("dxFilterBuilder-filterOperationIsBlank"),
                /**
                 * @name dxFilterBuilderOptions_filterOperationDescriptions_isNotBlank
                 * @publicName isNotBlank
                 * @type string
                 * @default "Is not blank"
                 */
                isNotBlank: messageLocalization.format("dxFilterBuilder-filterOperationIsNotBlank")
            }
        });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "onEditorPreparing":
            case "onEditorPrepared":
                this._initActions();
                break;
            case "fields":
            case "defaultGroupOperation":
            case "value":
            case "allowHierarchicalFields":
            case "groupOperationDescriptions":
            case "filterOperationDescriptions":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _updateFilter: function() {
        var value = utils.copyGroup(this._model);
        this._options.value = utils.getNormalizedFilter(value);
    },

    _init: function() {
        this._model = null;
        this._initEditorFactory();
        this._initActions();
        this.callBase();
    },

    _initEditorFactory: function() {
        this._editorFactory = new EditorFactory();
    },

    _initActions: function() {
        var that = this;

        that._actions = {};

        ACTIONS.forEach(function(action) {
            that._actions[action] = that._createActionByOption(action, { excludeValidators: ["designMode", "disabled", "readOnly"], category: "rendering" });
        });
    },

    executeAction: function(actionName, options) {
        var action = this._actions[actionName];

        return action && action(options);
    },

    _render: function() {
        this.$element().addClass(FILTER_BUILDER_CLASS);
        this.callBase();
    },

    _renderContentImpl: function() {
        this._model = utils.convertToInnerStructure(this.option("value"));
        this._createGroupElementByCriteria(this._model)
            .appendTo(this.$element());
    },

    _createConditionElement: function(condition, parent) {
        return $("<div>")
            .addClass(FILTER_BUILDER_GROUP_CLASS)
            .append(this._createConditionItem(condition, parent));
    },

    _createGroupElementByCriteria: function(criteria, parent) {
        var $group = this._createGroupElement(criteria, parent),
            $groupContent = $group.find("." + FILTER_BUILDER_GROUP_CONTENT_CLASS),
            groupCriteria = utils.getGroupCriteria(criteria);

        for(var i = 0; i < groupCriteria.length; i++) {
            var innerCriteria = groupCriteria[i];
            if(utils.isGroup(innerCriteria)) {
                this._createGroupElementByCriteria(innerCriteria, groupCriteria)
                    .appendTo($groupContent);
            } else if(utils.isCondition(innerCriteria)) {
                this._createConditionElement(innerCriteria, groupCriteria)
                    .appendTo($groupContent);
            }
        }
        return $group;
    },

    _createGroupElement: function(criteria, parent) {
        var that = this,
            $groupItem = $("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            $groupContent = $("<div>").addClass(FILTER_BUILDER_GROUP_CONTENT_CLASS),
            $group = $("<div>").addClass(FILTER_BUILDER_GROUP_CLASS).append($groupItem).append($groupContent);

        if(parent != null) {
            this._createRemoveButton(function() {
                utils.removeItem(parent, criteria);
                $group.remove();
                that._updateFilter();
            }).appendTo($groupItem);
        }

        this._createGroupOperationButton(criteria).appendTo($groupItem);

        this._createAddButton(function() {
            var newGroup = utils.createEmptyGroup(that.option("defaultGroupOperation"));
            utils.addItem(newGroup, criteria);
            that._createGroupElement(newGroup, criteria).appendTo($groupContent);
        }, function() {
            var newCondition = utils.createCondition(that.option("fields")[0]);
            utils.addItem(newCondition, criteria);
            that._createConditionElement(newCondition, criteria).appendTo($groupContent);
            that._updateFilter();
        }).appendTo($groupItem);

        return $group;
    },

    _createGroupOperationButton: function(criteria) {
        var that = this,
            groupOperations = this._getGroupOperations(),
            groupMenuItem = utils.getGroupMenuItem(criteria, groupOperations),
            $operationButton = this._createButtonWithMenu({
                caption: groupMenuItem.text,
                menu: {
                    items: groupOperations,
                    displayExpr: "text",
                    keyExpr: "value",
                    onItemClick: function(e) {
                        utils.setGroupValue(criteria, e.itemData.value);
                        groupMenuItem = e.itemData;
                        $operationButton.html(e.itemData.text);
                        that._updateFilter();
                    },
                    onContentReady: function(e) {
                        e.component.selectItem(groupMenuItem);
                    }
                }
            }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
                .addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS)
                .attr("tabindex", 0);
        return $operationButton;
    },

    _createButtonWithMenu: function(options) {
        var that = this,
            removeMenu = function() {
                that.$element().find("." + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
                that.$element().find(".dx-has-context-menu").remove();
                that.$element().find(".dx-overlay .dx-treeview").remove();
                that.$element().find(".dx-overlay").remove();
            },
            rtlEnabled = this.option("rtlEnabled"),
            menuOnItemClickWrapper = function(handler) {
                return function(e) {
                    handler(e);
                    removeMenu();
                    if(e.jQueryEvent.type === "keydown") {
                        eventsEngine.trigger(options.menu.target, "focus");
                    }
                };
            },
            position = rtlEnabled ? "right" : "left",
            $button = $("<div>").text(options.caption);

        extend(options.menu, {
            focusStateEnabled: true,
            selectionMode: "single",
            onItemClick: menuOnItemClickWrapper(options.menu.onItemClick),
            onHiding: function(e) {
                $button.removeClass(ACTIVE_CLASS);
            },
            position: { my: position + " top", at: position + " bottom", offset: "0 1" },
            animation: { show: { type: 'fade', from: 1, to: 1, delay: 0 }, hide: { type: 'fade', from: 0, to: 0, delay: 0 } },
            onHidden: function() {
                removeMenu();
            },
            cssClass: FILTER_BUILDER_OVERLAY_CLASS,
            target: $button,
            rtlEnabled: rtlEnabled
        });
        this._subscribeOnClickAndEnterKey($button, function() {
            removeMenu();
            if(options.menu.treeViewEnabled) {
                that._createPopupWithTreeView(options, that.$element());
            } else {
                that._createContextMenu(options.menu)
                    .appendTo(that.$element())
                    .dxContextMenu("show");
            }
            $button.addClass(ACTIVE_CLASS);
        });
        return $button;
    },

    _createOperationButtonWithMenu: function(condition, field) {
        var that = this,
            availableOperations = utils.getAvailableOperations(field, this.option("filterOperationDescriptions")),
            currentOperation = utils.getOperationFromAvailable(utils.getOperationValue(condition), availableOperations),
            $operationButton = this._createButtonWithMenu({
                caption: currentOperation.text,
                menu: {
                    items: availableOperations,
                    displayExpr: "text",
                    onContentReady: function(e) {
                        e.component.selectItem(currentOperation);
                    },
                    onItemClick: function(e) {
                        currentOperation = e.itemData;
                        utils.updateConditionByOperation(condition, currentOperation.value);
                        if(condition[2] !== null) {
                            if($operationButton.siblings().filter("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length === 0) {
                                that._createValueButton(condition, field).appendTo($operationButton.parent());
                            }
                        } else {
                            $operationButton.siblings().filter("." + FILTER_BUILDER_ITEM_VALUE_CLASS).remove();
                        }
                        $operationButton.html(currentOperation.text);
                    }
                }
            }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
                .addClass(FILTER_BUILDER_ITEM_OPERATION_CLASS)
                .attr("tabindex", 0);

        return $operationButton;
    },

    _createOperationAndValueButtons: function(condition, field, $item) {
        this._createOperationButtonWithMenu(condition, field)
            .appendTo($item);

        if(condition[2] !== null) {
            this._createValueButton(condition, field)
                .appendTo($item);
        }
    },

    _createFieldButtonWithMenu: function(condition, field) {
        var that = this,
            fields = this.option("fields"),
            allowHierarchicalFields = this.option("allowHierarchicalFields"),
            items = utils.getItems(fields, allowHierarchicalFields),
            item = utils.getField(field.dataField, items),
            getFullCaption = function(item, items) {
                return allowHierarchicalFields ? utils.getCaptionWithParents(item, items) : item.caption;
            };

        var $fieldButton = this._createButtonWithMenu({
            caption: getFullCaption(item, items),
            menu: {
                items: items,
                dataStructure: "plain",
                keyExpr: "dataField",
                displayExpr: "caption",
                treeViewEnabled: allowHierarchicalFields,
                onItemClick: function(e) {
                    item = e.itemData;
                    condition[0] = item.dataField;
                    condition[2] = item.dataType === "object" ? null : "";
                    utils.updateConditionByOperation(condition, utils.getDefaultOperation(item));

                    $fieldButton.siblings().filter("." + FILTER_BUILDER_ITEM_TEXT_CLASS).remove();
                    that._createOperationAndValueButtons(condition, item, $fieldButton.parent());

                    var caption = getFullCaption(item, e.component.option("items"));
                    $fieldButton.html(caption);
                },
                onContentReady: function(e) {
                    e.component.selectItem(item);
                }
            }
        }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_ITEM_FIELD_CLASS)
            .attr("tabindex", 0);

        return $fieldButton;
    },

    _createConditionItem: function(condition, parent) {
        var that = this,
            $item = $("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            field = utils.getField(condition[0], this.option("fields"));

        this._createRemoveButton(function() {
            utils.removeItem(parent, condition);
            $item.remove();
            that._updateFilter();
        }).appendTo($item);
        this._createFieldButtonWithMenu(condition, field).appendTo($item);
        this._createOperationAndValueButtons(condition, field, $item);
        return $item;
    },

    _getGroupOperations: function() {
        var result = [],
            operatorDescription,
            groupOperationDescriptions = this.option("groupOperationDescriptions");

        for(operatorDescription in groupOperationDescriptions) {
            result.push({
                text: groupOperationDescriptions[operatorDescription],
                value: OPERATORS[operatorDescription]
            });
        }

        return result;
    },

    _createRemoveButton: function(handler) {
        var $removeButton = $("<div>")
                .addClass(FILTER_BUILDER_IMAGE_CLASS)
                .addClass(FILTER_BUILDER_IMAGE_REMOVE_CLASS)
                .addClass(FILTER_BUILDER_ACTION_CLASS)
                .attr("tabindex", 0);
        this._subscribeOnClickAndEnterKey($removeButton, handler);
        return $removeButton;
    },

    _createAddButton: function(addGroupHandler, addConditionHandler) {
        return this._createButtonWithMenu({
            menu: {
                items: [{
                    caption: messageLocalization.format("dxFilterBuilder-addGroup"),
                    click: addGroupHandler
                },
                {
                    caption: messageLocalization.format("dxFilterBuilder-addCondition"),
                    click: addConditionHandler
                }],
                displayExpr: "caption",
                onItemClick: function(e) {
                    e.itemData.click();
                }
            }
        }).addClass(FILTER_BUILDER_IMAGE_CLASS)
            .addClass(FILTER_BUILDER_IMAGE_ADD_CLASS)
            .addClass(FILTER_BUILDER_ACTION_CLASS)
            .attr("tabindex", 0);
    },

    _createValueText: function(item, field, $container) {
        var that = this,
            valueText = utils.getCurrentValueText(field, item[2]) || messageLocalization.format("dxFilterBuilder-enterValueText"),
            $text = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS)
                .attr("tabindex", 0)
                .text(valueText)
                .appendTo($container);

        that._subscribeOnClickAndEnterKey($text, function() {
            $container.empty();
            var value = item[2];
            var $editor = that._createValueEditor(item[2], field, function(data) {
                value = data;
            }).appendTo($container);
            eventsEngine.trigger($editor.find("input"), "focus");

            eventsEngine.on($editor, "focusout", function(e) {
                $container.empty();
                item[2] = value;
                that._createValueText(item, field, $container);
            });
            eventsEngine.on($editor, "keyup", function(e) {
                if(e.keyCode === 13 || e.keyCode === 27) {
                    eventsEngine.off($editor, "focusout");
                    $container.empty();
                    if(e.keyCode === 13) {
                        item[2] = value;
                    }
                    var $newTextElement = that._createValueText(item, field, $container);
                    eventsEngine.trigger($newTextElement, "focus");
                }
            });
        }, "keyup");

        return $text;
    },

    _createValueButton: function(item, field) {
        var $valueButton = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
                .addClass(FILTER_BUILDER_ITEM_VALUE_CLASS);

        this._createValueText(item, field, $valueButton);
        return $valueButton;
    },

    _createValueEditor: function(value, field, setValueHandler) {
        var $editor = $("<div>").attr("tabindex", 0);
        this._editorFactory.createEditor.call(this, $editor, extend({}, field, {
            value: value,
            parentType: "filterRow",
            setValue: setValueHandler,
            lookup: field.lookup
        }));
        return $editor;
    },

    _createPopupWithTreeView: function(options, $container) {
        var that = this,
            $popup = $("<div>")
                .addClass(options.menu.cssClass).appendTo($container);
        this._createComponent($popup, Popup, {
            target: options.menu.target,
            onHiding: options.menu.onHiding,
            onHidden: options.menu.onHidden,
            rtlEnabled: options.menu.rtlEnabled,
            position: options.menu.position,
            animation: options.menu.animation,
            contentTemplate: function(contentElement) {
                var $menuContainer = $("<div>");
                that._createComponent($menuContainer, TreeView, options.menu);
                return $menuContainer;
            },
            visible: true,
            focusStateEnabled: false,
            closeOnOutsideClick: true,
            shading: false,
            width: "auto",
            height: "auto",
            showTitle: false,
            deferRendering: false
        });
    },

    _createContextMenu: function(options) {
        var $container = $("<div>");
        this._createComponent($container, ContextMenu, options);
        return $container;
    },

    _subscribeOnClickAndEnterKey: function($button, handler, keyEvent) {
        eventsEngine.on($button, "click", handler);
        eventsEngine.on($button, keyEvent || "keydown", function(e) {
            if(e.keyCode === 13) {
                handler();
            }
        });
    }
});

registerComponent("dxFilterBuilder", FilterBuilder);

module.exports = FilterBuilder;
