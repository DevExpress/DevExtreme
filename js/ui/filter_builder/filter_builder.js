"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    eventsEngine = require("../../events/core/events_engine"),
    Widget = require("../widget/ui.widget"),
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    messageLocalization = require("../../localization/message"),
    utils = require("./utils"),
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
    FILTER_BUILDER_FILTER_OPERATIONS_CLASS = "dx-filterbuilder-operations",
    FILTER_BUILDER_GROUP_OPERATIONS_CLASS = "dx-filterbuilder-group-operations",
    FILTER_BUILDER_FIELDS_CLASS = "dx-filterbuilder-fields",
    FILTER_BUILDER_ADD_CONDITION_CLASS = "dx-filterbuilder-add-condition",
    ACTIVE_CLASS = "dx-state-active",

    TAB_KEY = 9,
    ENTER_KEY = 13,
    ESCAPE_KEY = 27;

var ACTIONS = [{
        name: "onEditorPreparing",
        config: { excludeValidators: ["designMode", "disabled", "readOnly"], category: "rendering" }
    }, {
        name: "onEditorPrepared",
        config: { excludeValidators: ["designMode", "disabled", "readOnly"], category: "rendering" }
    }, {
        name: "onValueChanged",
        config: { excludeValidators: ["disabled", "readOnly"] }
    }],
    OPERATORS = {
        and: "and",
        or: "or",
        notAnd: "!and",
        notOr: "!or"
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
              * @type_function_param1_field7 editorElement:dxElement
              * @type_function_param1_field8 editorName:string
              * @type_function_param1_field9 editorOptions:object
              * @type_function_param1_field10 dataField:string
              * @type_function_param1_field11 updateValueTimeout:number
              * @type_function_param1_field12 width:number
              * @type_function_param1_field13 readOnly:boolean
              * @type_function_param1_field14 disabled:boolean
              * @type_function_param1_field15 rtlEnabled:boolean
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
              * @type_function_param1_field6 editorElement:dxElement
              * @type_function_param1_field7 editorName:string
              * @type_function_param1_field8 dataField:string
              * @type_function_param1_field9 updateValueTimeout:number
              * @type_function_param1_field10 width:number
              * @type_function_param1_field11 readOnly:boolean
              * @type_function_param1_field12 disabled:boolean
              * @type_function_param1_field13 rtlEnabled:boolean
              * @extends Action
              * @action
             */
            onEditorPrepared: null,

            /**
            * @name dxFilterBuilderOptions_onContentReady
            * @publicName onContentReady
            * @hidden true
            * @action
            */

            /**
            * @name dxFilterBuilderField
            * @publicName dxFilterBuilderField
            * @type object
            */

            /**
            * @name dxFilterBuilderOptions_onValueChanged
            * @publicName onValueChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 value:object
            * @type_function_param1_field5 previousValue:object
            * @action
            */
            onValueChanged: null,

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
             * @type Enums.FilterBuilderFieldDataType
             * @default "string"
             */

            /**
             * @name dxFilterBuilderField_editorOptions
             * @publicName editorOptions
             * @type object
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
             * @name dxFilterBuilderField_editorTemplate
             * @publicName editorTemplate
             * @type template|function
             * @type_function_param1 conditionInfo:object
             * @type_function_param1_field1 value:string|number|date
             * @type_function_param1_field2 filterOperation:string
             * @type_function_param1_field3 field:dxFilterBuilderField
             * @type_function_param1_field4 setValue:function
             * @type_function_param2 container:dxElement
             * @type_function_return string|Node|jQuery
             */

            /**
            * @name dxFilterBuilderOptions_defaultGroupOperation
            * @publicName defaultGroupOperation
            * @type string
            * @default "and"
            * @hidden
            */
            defaultGroupOperation: "and",

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
            case "onValueChanged":
                this._initActions();
                break;
            case "fields":
            case "defaultGroupOperation":
            case "allowHierarchicalFields":
            case "groupOperationDescriptions":
            case "filterOperationDescriptions":
                this._invalidate();
                break;
            case "value":
                if(!this._disableInvalidateForValue) {
                    this._invalidate();
                }
                this.executeAction("onValueChanged", {
                    value: args.value,
                    previousValue: args.previousValue
                });
                break;
            default:
                this.callBase(args);
        }
    },

    _updateFilter: function() {
        this._disableInvalidateForValue = true;
        var value = extend(true, [], this._model),
            normalizedFields = utils.getNormalizedFields(this.option("fields"));
        this.option("value", utils.getNormalizedFilter(value, normalizedFields));
        this._disableInvalidateForValue = false;
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
            that._actions[action.name] = that._createActionByOption(action.name, action.config);
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
                if(!utils.isEmptyGroup(criteria)) {
                    that._updateFilter();
                }
            }).appendTo($groupItem);
        }

        this._createGroupOperationButton(criteria).appendTo($groupItem);

        this._createAddButton(function() {
            var newGroup = utils.createEmptyGroup(that.option("defaultGroupOperation"));
            utils.addItem(newGroup, criteria);
            that._createGroupElement(newGroup, criteria).appendTo($groupContent);
        }, function() {
            var field = that.option("fields")[0],
                newCondition = utils.createCondition(field);
            utils.addItem(newCondition, criteria);
            that._createConditionElement(newCondition, criteria).appendTo($groupContent);
            if(utils.isValidCondition(newCondition, field)) {
                that._updateFilter();
            }
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
                        if(groupMenuItem !== e.itemData) {
                            utils.setGroupValue(criteria, e.itemData.value);
                            $operationButton.html(e.itemData.text);
                            groupMenuItem = e.itemData;
                            that._updateFilter();
                        }
                    },
                    onContentReady: function(e) {
                        e.component.selectItem(groupMenuItem);
                    },
                    cssClass: FILTER_BUILDER_GROUP_OPERATIONS_CLASS
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
                that.$element().find(".dx-overlay .dx-treeview").remove();
                that.$element().find(".dx-overlay").remove();
            },
            rtlEnabled = this.option("rtlEnabled"),
            menuOnItemClickWrapper = function(handler) {
                return function(e) {
                    handler(e);
                    if(e.event.type === "dxclick") {
                        removeMenu();
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
            position: { my: position + " top", at: position + " bottom", offset: "0 1", of: $button },
            animation: null,
            onHidden: function() {
                removeMenu();
            },
            cssClass: FILTER_BUILDER_OVERLAY_CLASS + " " + options.menu.cssClass,
            rtlEnabled: rtlEnabled
        });

        options.popup = {
            onShown: function(info) {
                var treeViewElement = $(info.component.content()).find(".dx-treeview"),
                    treeView = treeViewElement.dxTreeView("instance");
                eventsEngine.on(treeViewElement, "keyup keydown", function(e) {
                    if((e.type === "keydown" && e.keyCode === TAB_KEY)
                            || (e.type === "keyup" && (e.keyCode === ESCAPE_KEY || e.keyCode === ENTER_KEY))) {
                        info.component.hide();
                        eventsEngine.trigger(options.menu.position.of, "focus");
                    }
                });

                treeView.focus();
                treeView.option("focusedElement", null);
            }
        };

        this._subscribeOnClickAndEnterKey($button, function() {
            removeMenu();
            that._createPopupWithTreeView(options, that.$element());
            $button.addClass(ACTIVE_CLASS);
        });
        return $button;
    },

    _hasValueButton: function(condition) {
        return condition[2] !== null;
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
                        if(currentOperation !== e.itemData) {
                            currentOperation = e.itemData;
                            utils.updateConditionByOperation(condition, currentOperation.value);
                            if(that._hasValueButton(condition)) {
                                if($operationButton.siblings().filter("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length === 0) {
                                    that._createValueButton(condition, field).appendTo($operationButton.parent());
                                }
                            } else {
                                $operationButton.siblings().filter("." + FILTER_BUILDER_ITEM_VALUE_CLASS).remove();
                            }
                            $operationButton.html(currentOperation.text);
                            that._updateFilter();
                        }
                    },
                    cssClass: FILTER_BUILDER_FILTER_OPERATIONS_CLASS
                }
            }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
                .addClass(FILTER_BUILDER_ITEM_OPERATION_CLASS)
                .attr("tabindex", 0);

        return $operationButton;
    },

    _createOperationAndValueButtons: function(condition, field, $item) {
        this._createOperationButtonWithMenu(condition, field)
            .appendTo($item);

        if(this._hasValueButton(condition)) {
            this._createValueButton(condition, field)
                .appendTo($item);
        }
    },

    _createFieldButtonWithMenu: function(fields, condition, field) {
        var that = this,
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
                onItemClick: function(e) {
                    if(item !== e.itemData) {
                        item = e.itemData;
                        condition[0] = item.dataField;
                        condition[2] = item.dataType === "object" ? null : "";
                        utils.updateConditionByOperation(condition, utils.getDefaultOperation(item));

                        $fieldButton.siblings().filter("." + FILTER_BUILDER_ITEM_TEXT_CLASS).remove();
                        that._createOperationAndValueButtons(condition, item, $fieldButton.parent());

                        var caption = getFullCaption(item, e.component.option("items"));
                        $fieldButton.html(caption);
                        that._updateFilter();
                    }
                },
                onContentReady: function(e) {
                    e.component.selectItem(item);
                },
                cssClass: FILTER_BUILDER_FIELDS_CLASS
            }
        }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_ITEM_FIELD_CLASS)
            .attr("tabindex", 0);

        return $fieldButton;
    },

    _createConditionItem: function(condition, parent) {
        var that = this,
            $item = $("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            fields = utils.getNormalizedFields(this.option("fields")),
            field = utils.getField(condition[0], fields);

        this._createRemoveButton(function() {
            utils.removeItem(parent, condition);
            $item.remove();
            if(utils.isValidCondition(condition, field)) {
                that._updateFilter();
            }
        }).appendTo($item);
        this._createFieldButtonWithMenu(fields, condition, field).appendTo($item);
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
                    caption: messageLocalization.format("dxFilterBuilder-addCondition"),
                    click: addConditionHandler
                }, {
                    caption: messageLocalization.format("dxFilterBuilder-addGroup"),
                    click: addGroupHandler
                }],
                displayExpr: "caption",
                onItemClick: function(e) {
                    e.itemData.click();
                },
                cssClass: FILTER_BUILDER_ADD_CONDITION_CLASS
            }
        }).addClass(FILTER_BUILDER_IMAGE_CLASS)
            .addClass(FILTER_BUILDER_IMAGE_ADD_CLASS)
            .addClass(FILTER_BUILDER_ACTION_CLASS)
            .attr("tabindex", 0);
    },

    _createValueText: function(item, field, $container) {
        var that = this,
            $text = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS)
                .attr("tabindex", 0)
                .appendTo($container),
            value = item[2],
            setText = function(valueText) {
                $text.text(valueText || messageLocalization.format("dxFilterBuilder-enterValueText"));
            };

        if(field.lookup) {
            utils.getCurrentLookupValueText(field, value, function(valueText) {
                setText(valueText);
            });
        } else {
            setText(utils.getCurrentValueText(field, value));
        }

        that._subscribeOnClickAndEnterKey($text, function(e) {
            if(e.type === "keyup") {
                e.stopPropagation();
            }
            that._createValueEditorWithEvents(item, field, $container);
        });

        return $text;
    },

    _updateConditionValue: function(item, value, callback) {
        var areValuesDifferent = item[2] !== value;
        if(areValuesDifferent) {
            item[2] = value;
        }
        callback();
        if(areValuesDifferent) {
            this._updateFilter();
        }
    },

    _createValueEditorWithEvents: function(item, field, $container) {
        var that = this,
            value = item[2],
            removeEvents = function() {
                eventsEngine.off(document, "keyup", documentKeyUpHandler);
                eventsEngine.off(document, "dxpointerdown", documentClickHandler);
            },
            isFocusOnEditorParts = function(target) {
                var activeElement = target || document.activeElement;
                return $(activeElement).closest($editor.children()).length
                    || $(activeElement).closest(".dx-dropdowneditor-overlay").length;
            },
            createValueText = function() {
                $container.empty();
                removeEvents();
                return that._createValueText(item, field, $container);
            };

        $container.empty();

        var options = {
            value: value === "" ? null : value,
            filterOperation: utils.getOperationValue(item),
            updateValueImmediately: true,
            setValue: function(data) {
                value = data === null ? "" : data;
            }
        };

        var $editor = that._createValueEditor($container, field, options);

        eventsEngine.trigger($editor.find("input"), "focus");

        var documentClickHandler = function(e) {
            if(!isFocusOnEditorParts(e.target)) {
                eventsEngine.trigger($editor.find("input"), "change");
                that._updateConditionValue(item, value, function() {
                    createValueText();
                });
            }
        };
        eventsEngine.on(document, "dxpointerdown", documentClickHandler);

        var documentKeyUpHandler = function(e) {
            if(e.keyCode === TAB_KEY) {
                if(isFocusOnEditorParts()) {
                    return;
                }
                that._updateConditionValue(item, value, function() {
                    createValueText();
                    if(e.shiftKey) {
                        eventsEngine.trigger($container.prev(), "focus");
                    }
                });
            }
            if(e.keyCode === ESCAPE_KEY) {
                eventsEngine.trigger(createValueText(), "focus");
            }
            if(e.keyCode === ENTER_KEY) {
                that._updateConditionValue(item, value, function() {
                    eventsEngine.trigger(createValueText(), "focus");
                });
            }
        };
        eventsEngine.on(document, "keyup", documentKeyUpHandler);
    },

    _createValueButton: function(item, field) {
        var $valueButton = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
                .addClass(FILTER_BUILDER_ITEM_VALUE_CLASS);

        this._createValueText(item, field, $valueButton);
        return $valueButton;
    },

    _createValueEditor: function($container, field, options) {
        var $editor = $("<div>").attr("tabindex", 0).appendTo($container);
        if(field.editorTemplate) {
            var template = this._getTemplate(field.editorTemplate);

            template.render({
                model: extend({ field: field }, options),
                container: $editor
            });
        } else {
            this._editorFactory.createEditor.call(this, $editor, extend({}, field, options, {
                parentType: "filterBuilder"
            }));
        }
        return $editor;
    },

    _createPopupWithTreeView: function(options, $container) {
        var that = this,
            $popup = $("<div>")
                .addClass(options.menu.cssClass).appendTo($container);
        this._createComponent($popup, Popup, {
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
            onShown: options.popup.onShown,
            shading: false,
            width: "auto",
            height: "auto",
            showTitle: false
        });
    },

    _subscribeOnClickAndEnterKey: function($button, handler) {
        eventsEngine.on($button, "dxclick", handler);
        eventsEngine.on($button, "keyup", function(e) {
            if(e.keyCode === ENTER_KEY) {
                handler(e);
            }
        });
    }
});

registerComponent("dxFilterBuilder", FilterBuilder);

module.exports = FilterBuilder;
