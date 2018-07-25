"use strict";

import $ from "../../core/renderer";
import domAdapter from "../../core/dom_adapter";
import Class from "../../core/class";
import eventsEngine from "../../events/core/events_engine";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import messageLocalization from "../../localization/message";
import utils from "./utils";
import deferredUtils from "../../core/utils/deferred";
import { isDefined } from "../../core/utils/type";
import TreeView from "../tree_view";
import Popup from "../popup";
import EditorFactoryMixin from "../shared/ui.editor_factory_mixin";

const FILTER_BUILDER_CLASS = "dx-filterbuilder",
    FILTER_BUILDER_GROUP_CLASS = FILTER_BUILDER_CLASS + "-group",
    FILTER_BUILDER_GROUP_ITEM_CLASS = FILTER_BUILDER_GROUP_CLASS + "-item",
    FILTER_BUILDER_GROUP_CONTENT_CLASS = FILTER_BUILDER_GROUP_CLASS + "-content",
    FILTER_BUILDER_GROUP_OPERATIONS_CLASS = FILTER_BUILDER_GROUP_CLASS + "-operations",
    FILTER_BUILDER_GROUP_OPERATION_CLASS = FILTER_BUILDER_GROUP_CLASS + "-operation",
    FILTER_BUILDER_ACTION_CLASS = FILTER_BUILDER_CLASS + "-action",
    FILTER_BUILDER_IMAGE_CLASS = FILTER_BUILDER_ACTION_CLASS + "-icon",
    FILTER_BUILDER_IMAGE_ADD_CLASS = "dx-icon-plus",
    FILTER_BUILDER_IMAGE_REMOVE_CLASS = "dx-icon-remove",
    FILTER_BUILDER_ITEM_TEXT_CLASS = FILTER_BUILDER_CLASS + "-text",
    FILTER_BUILDER_ITEM_TEXT_PART_CLASS = FILTER_BUILDER_ITEM_TEXT_CLASS + "-part",
    FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS = FILTER_BUILDER_ITEM_TEXT_CLASS + "-separator",
    FILTER_BUILDER_ITEM_TEXT_SEPARATOR_EMPTY_CLASS = FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS + "-empty",
    FILTER_BUILDER_ITEM_FIELD_CLASS = FILTER_BUILDER_CLASS + "-item-field",
    FILTER_BUILDER_ITEM_OPERATION_CLASS = FILTER_BUILDER_CLASS + "-item-operation",
    FILTER_BUILDER_ITEM_VALUE_CLASS = FILTER_BUILDER_CLASS + "-item-value",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = FILTER_BUILDER_CLASS + "-item-value-text",
    FILTER_BUILDER_OVERLAY_CLASS = FILTER_BUILDER_CLASS + "-overlay",
    FILTER_BUILDER_FILTER_OPERATIONS_CLASS = FILTER_BUILDER_CLASS + "-operations",
    FILTER_BUILDER_FIELDS_CLASS = FILTER_BUILDER_CLASS + "-fields",
    FILTER_BUILDER_ADD_CONDITION_CLASS = FILTER_BUILDER_CLASS + "-add-condition",
    ACTIVE_CLASS = "dx-state-active",
    FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS = FILTER_BUILDER_CLASS + "-menu-custom-operation",
    SOURCE = "filterBuilder",
    DISABLED_STATE_CLASS = "dx-state-disabled",

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

var renderValueText = function($container, value, customOperation) {
    if(Array.isArray(value)) {
        let lastItemIndex = value.length - 1;
        $container.empty();
        value.forEach((t, i) => {
            $("<span>")
                .addClass(FILTER_BUILDER_ITEM_TEXT_PART_CLASS)
                .text(t)
                .appendTo($container);
            if(i !== lastItemIndex) {
                $("<span>")
                    .addClass(FILTER_BUILDER_ITEM_TEXT_SEPARATOR_CLASS)
                    .text(customOperation && customOperation.valueSeparator ? customOperation.valueSeparator : "|")
                    .addClass(FILTER_BUILDER_ITEM_TEXT_SEPARATOR_EMPTY_CLASS).appendTo($container);
            }
        });
    } else if(value) {
        $container.text(value);
    } else {
        $container.text(messageLocalization.format("dxFilterBuilder-enterValueText"));
    }
};

var FilterBuilder = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
              * @name dxFilterBuilderOptions.onEditorPreparing
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field4 value:any
              * @type_function_param1_field5 setValue(newValue):any
              * @type_function_param1_field6 cancel:boolean
              * @type_function_param1_field7 editorElement:dxElement
              * @type_function_param1_field8 editorName:string
              * @type_function_param1_field9 editorOptions:object
              * @type_function_param1_field10 dataField:string
              * @type_function_param1_field11 filterOperation:string
              * @type_function_param1_field12 updateValueTimeout:number
              * @type_function_param1_field13 width:number
              * @type_function_param1_field14 readOnly:boolean
              * @type_function_param1_field15 disabled:boolean
              * @type_function_param1_field16 rtlEnabled:boolean
              * @extends Action
              * @action
             */
            onEditorPreparing: null,

            /**
              * @name dxFilterBuilderOptions.onEditorPrepared
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field4 value:any
              * @type_function_param1_field5 setValue(newValue):any
              * @type_function_param1_field6 editorElement:dxElement
              * @type_function_param1_field7 editorName:string
              * @type_function_param1_field8 dataField:string
              * @type_function_param1_field9 filterOperation:string
              * @type_function_param1_field10 updateValueTimeout:number
              * @type_function_param1_field11 width:number
              * @type_function_param1_field12 readOnly:boolean
              * @type_function_param1_field13 disabled:boolean
              * @type_function_param1_field14 rtlEnabled:boolean
              * @extends Action
              * @action
             */
            onEditorPrepared: null,

            /**
            * @name dxFilterBuilderOptions.onContentReady
            * @hidden true
            * @action
            */

            /**
            * @name dxFilterBuilderField
            * @type object
            */

            /**
            * @name dxFilterBuilderOptions.onValueChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 value:object
            * @type_function_param1_field5 previousValue:object
            * @action
            */
            onValueChanged: null,

            /**
            * @name dxFilterBuilderOptions.fields
            * @type Array<dxFilterBuilderField>
            * @default []
            */
            fields: [],
            /**
            * @name dxFilterBuilderField.caption
            * @type string
            * @default undefined
            */

            /**
             * @name dxFilterBuilderField.calculateFilterExpression
             * @type function(filterValue, selectedFilterOperation)
             * @type_function_param1 filterValue:any
             * @type_function_param2 selectedFilterOperation:string
             * @type_function_return Filter expression
             */

            /**
            * @name dxFilterBuilderField.dataField
            * @type string
            * @default undefined
            */

            /**
             * @name dxFilterBuilderField.dataType
             * @type Enums.FilterBuilderFieldDataType
             * @default "string"
             */

            /**
             * @name dxFilterBuilderField.editorOptions
             * @type object
             */

            /**
             * @name dxFilterBuilderField.format
             * @type format
             * @default ""
             */

            /**
             * @name dxFilterBuilderField.trueText
             * @type string
             * @default "true"
             */

            /**
             * @name dxFilterBuilderField.falseText
             * @type string
             * @default "false"
             */

            /**
             * @name dxFilterBuilderField.lookup
             * @type object
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField.lookup.dataSource
             * @type Array<any>|DataSourceOptions
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField.lookup.valueExpr
             * @type string|function(data)
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField.lookup.displayExpr
             * @type string|function(data)
             * @type_function_param1 data:object
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField.lookup.allowClearing
             * @type boolean
             * @default false
             */

            /**
             * @name dxFilterBuilderField.defaultFilterOperation
             * @type Enums.FilterBuilderFieldFilterOperations | string
             * @hidden
             */

            /**
             * @name dxFilterBuilderField.filterOperations
             * @type Array<Enums.FilterBuilderFieldFilterOperations, string>
             * @default undefined
             */

            /**
             * @name dxFilterBuilderField.customizeText
             * @type function(fieldInfo)
             * @type_function_param1 fieldInfo:object
             * @type_function_param1_field1 value:string|number|date
             * @type_function_param1_field2 valueText:string
             * @type_function_return string
             */

             /**
             * @name dxFilterBuilderField.editorTemplate
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
            * @name dxFilterBuilderOptions.defaultGroupOperation
            * @type string
            * @default "and"
            * @hidden
            */
            defaultGroupOperation: "and",

            /**
             * @name dxFilterBuilderOptions.groupOperations
             * @type Array<Enums.FilterBuilderGroupOperations>
             * @default ['and', 'or', 'notAnd', 'notOr']
             */
            groupOperations: ["and", "or", "notAnd", "notOr"],

            /**
             * @name dxFilterBuilderOptions.maxGroupLevel
             * @type number
             * @default undefined
             */
            maxGroupLevel: undefined,

            /**
             * @name dxFilterBuilderOptions.value
             * @type Filter expression
             * @default null
             * @fires dxFilterBuilderOptions.onValueChanged
             */
            value: null,

            /**
             * @name dxFilterBuilderOptions.allowHierarchicalFields
             * @type boolean
             * @default false
             */
            allowHierarchicalFields: false,

            /**
             * @name dxFilterBuilderOptions.groupOperationDescriptions
             * @type object
             */
            groupOperationDescriptions: {
                /**
                 * @name dxFilterBuilderOptions.groupOperationDescriptions.and
                 * @type string
                 * @default "And"
                 */
                and: messageLocalization.format("dxFilterBuilder-and"),
                /**
                 * @name dxFilterBuilderOptions.groupOperationDescriptions.or
                 * @type string
                 * @default "Or"
                 */
                or: messageLocalization.format("dxFilterBuilder-or"),
                /**
                 * @name dxFilterBuilderOptions.groupOperationDescriptions.notAnd
                 * @type string
                 * @default "Not And"
                 */
                notAnd: messageLocalization.format("dxFilterBuilder-notAnd"),
                /**
                 * @name dxFilterBuilderOptions.groupOperationDescriptions.notOr
                 * @type string
                 * @default "Not Or"
                 */
                notOr: messageLocalization.format("dxFilterBuilder-notOr"),
            },

            /**
             * @name dxFilterBuilderOptions.customOperations
             * @type Array<dxFilterBuilderCustomOperation>
             * @default []
             */
            customOperations: [],

            /**
             * @name dxFilterBuilderCustomOperation
             * @type object
             */

            /**
             * @name dxFilterBuilderCustomOperation.name
             * @type string
             * @default undefined
             */

            /**
             * @name dxFilterBuilderCustomOperation.caption
             * @type string
             * @default undefined
             */

            /**
             * @name dxFilterBuilderCustomOperation.icon
             * @type string
             * @default undefined
             */

            /**
             * @name dxFilterBuilderCustomOperation.dataTypes
             * @type Array<Enums.FilterBuilderFieldDataType>
             * @default undefined
             */

            /**
             * @name dxFilterBuilderCustomOperation.hasValue
             * @type boolean
             * @default true
             */

            /**
             * @name dxFilterBuilderCustomOperation.calculateFilterExpression
             * @type function(filterValue, field)
             * @type_function_param1 filterValue:any
             * @type_function_param2 field:dxFilterBuilderField
             * @type_function_return Filter expression
             */

            /**
             * @name dxFilterBuilderCustomOperation.editorTemplate
             * @type template|function
             * @type_function_param1 conditionInfo:object
             * @type_function_param1_field1 value:string|number|date
             * @type_function_param1_field2 field:dxFilterBuilderField
             * @type_function_param1_field3 setValue:function
             * @type_function_param2 container:dxElement
             * @type_function_return string|Node|jQuery
             */

            /**
             * @name dxFilterBuilderCustomOperation.customizeText
             * @type function(fieldInfo)
             * @type_function_param1 fieldInfo:object
             * @type_function_param1_field1 value:string|number|date
             * @type_function_param1_field2 valueText:string
             * @type_function_param1_field3 field:dxFilterBuilderField
             * @type_function_return string
             */

            /**
             * @name dxFilterBuilderOptions.filterOperationDescriptions
             * @type object
             */
            filterOperationDescriptions: {
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.between
                 * @type string
                 * @default "Between"
                 */
                between: messageLocalization.format("dxFilterBuilder-filterOperationBetween"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.equal
                 * @type string
                 * @default "Equals"
                 */
                equal: messageLocalization.format("dxFilterBuilder-filterOperationEquals"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.notEqual
                 * @type string
                 * @default "Does not equal"
                 */
                notEqual: messageLocalization.format("dxFilterBuilder-filterOperationNotEquals"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.lessThan
                 * @type string
                 * @default "Less than"
                 */
                lessThan: messageLocalization.format("dxFilterBuilder-filterOperationLess"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.lessThanOrEqual
                 * @type string
                 * @default "Less than or equal to"
                 */
                lessThanOrEqual: messageLocalization.format("dxFilterBuilder-filterOperationLessOrEquals"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.greaterThan
                 * @type string
                 * @default "Greater than"
                 */
                greaterThan: messageLocalization.format("dxFilterBuilder-filterOperationGreater"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.greaterThanOrEqual
                 * @type string
                 * @default "Greater than or equal to"
                 */
                greaterThanOrEqual: messageLocalization.format("dxFilterBuilder-filterOperationGreaterOrEquals"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.startsWith
                 * @type string
                 * @default "Starts with"
                 */
                startsWith: messageLocalization.format("dxFilterBuilder-filterOperationStartsWith"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.contains
                 * @type string
                 * @default "Contains"
                 */
                contains: messageLocalization.format("dxFilterBuilder-filterOperationContains"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.notContains
                 * @type string
                 * @default "Does not contain"
                 */
                notContains: messageLocalization.format("dxFilterBuilder-filterOperationNotContains"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.endsWith
                 * @type string
                 * @default "Ends with"
                 */
                endsWith: messageLocalization.format("dxFilterBuilder-filterOperationEndsWith"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.isBlank
                 * @type string
                 * @default "Is blank"
                 */
                isBlank: messageLocalization.format("dxFilterBuilder-filterOperationIsBlank"),
                /**
                 * @name dxFilterBuilderOptions.filterOperationDescriptions.isNotBlank
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
            case "customOperations":
                this._initCustomOperations();
                this._invalidate();
                break;
            case "fields":
            case "defaultGroupOperation":
            case "maxGroupLevel":
            case "groupOperations":
            case "allowHierarchicalFields":
            case "groupOperationDescriptions":
            case "filterOperationDescriptions":
                this._invalidate();
                break;
            case "value":
                if(!this._disableInvalidateForValue) {
                    this._initModel();
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

    /**
    * @name dxFilterBuilderMethods.getFilterExpression
    * @publicName getFilterExpression()
    * @return Filter expression
    */
    getFilterExpression: function() {
        var fields = this._getNormalizedFields(),
            value = extend(true, [], this._model);
        return utils.getFilterExpression(utils.getNormalizedFilter(value, fields), fields, this._customOperations, SOURCE);
    },

    _getNormalizedFields: function() {
        return utils.getNormalizedFields(this.option("fields"));
    },

    _updateFilter: function() {
        this._disableInvalidateForValue = true;
        var value = extend(true, [], this._model);
        this.option("value", utils.getNormalizedFilter(value, this._getNormalizedFields()));
        this._disableInvalidateForValue = false;
    },

    _init: function() {
        this._initCustomOperations();
        this._initModel();
        this._initEditorFactory();
        this._initActions();
        this.callBase();
    },

    _initEditorFactory: function() {
        this._editorFactory = new EditorFactory();
    },

    _initCustomOperations: function() {
        this._customOperations = utils.getMergedOperations(this.option("customOperations"), this.option("filterOperationDescriptions.between"));
    },

    _initModel: function() {
        this._model = utils.convertToInnerStructure(this.option("value"), this._customOperations);
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

    _initMarkup: function() {
        this.$element().addClass(FILTER_BUILDER_CLASS);
        this.callBase();
        this._createGroupElementByCriteria(this._model)
            .appendTo(this.$element());
    },

    _createConditionElement: function(condition, parent) {
        return $("<div>")
            .addClass(FILTER_BUILDER_GROUP_CLASS)
            .append(this._createConditionItem(condition, parent));
    },

    _createGroupElementByCriteria: function(criteria, parent, groupLevel = 0) {
        var $group = this._createGroupElement(criteria, parent, groupLevel),
            $groupContent = $group.find("." + FILTER_BUILDER_GROUP_CONTENT_CLASS),
            groupCriteria = utils.getGroupCriteria(criteria);

        for(var i = 0; i < groupCriteria.length; i++) {
            var innerCriteria = groupCriteria[i];
            if(utils.isGroup(innerCriteria)) {
                this._createGroupElementByCriteria(innerCriteria, groupCriteria, groupLevel + 1)
                    .appendTo($groupContent);
            } else if(utils.isCondition(innerCriteria)) {
                this._createConditionElement(innerCriteria, groupCriteria)
                    .appendTo($groupContent);
            }
        }
        return $group;
    },

    _createGroupElement: function(criteria, parent, groupLevel) {
        var $groupItem = $("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            $groupContent = $("<div>").addClass(FILTER_BUILDER_GROUP_CONTENT_CLASS),
            $group = $("<div>").addClass(FILTER_BUILDER_GROUP_CLASS).append($groupItem).append($groupContent);

        if(parent != null) {
            this._createRemoveButton(() => {
                utils.removeItem(parent, criteria);
                $group.remove();
                if(!utils.isEmptyGroup(criteria)) {
                    this._updateFilter();
                }
            }).appendTo($groupItem);
        }

        this._createGroupOperationButton(criteria).appendTo($groupItem);

        this._createAddButton(() => {
            var newGroup = utils.createEmptyGroup(this.option("defaultGroupOperation"));
            utils.addItem(newGroup, criteria);
            this._createGroupElement(newGroup, criteria, groupLevel + 1).appendTo($groupContent);
        }, () => {
            var field = this.option("fields")[0],
                newCondition = utils.createCondition(field, this._customOperations);
            utils.addItem(newCondition, criteria);
            this._createConditionElement(newCondition, criteria).appendTo($groupContent);
            if(utils.isValidCondition(newCondition, field)) {
                this._updateFilter();
            }
        }, groupLevel).appendTo($groupItem);

        return $group;
    },

    _createButton: function(caption) {
        return $("<div>").text(caption);
    },

    _createGroupOperationButton: function(criteria) {
        let groupOperations = this._getGroupOperations(criteria),
            groupMenuItem = utils.getGroupMenuItem(criteria, groupOperations),
            caption = groupMenuItem.text,
            $operationButton = groupOperations && groupOperations.length < 2
                ? this._createButton(caption).addClass(DISABLED_STATE_CLASS)
                : this._createButtonWithMenu({
                    caption: caption,
                    menu: {
                        items: groupOperations,
                        displayExpr: "text",
                        keyExpr: "value",
                        onItemClick: (e) => {
                            if(groupMenuItem !== e.itemData) {
                                utils.setGroupValue(criteria, e.itemData.value);
                                $operationButton.html(e.itemData.text);
                                groupMenuItem = e.itemData;
                                this._updateFilter();
                            }
                        },
                        onContentReady: function(e) {
                            e.component.selectItem(groupMenuItem);
                        },
                        cssClass: FILTER_BUILDER_GROUP_OPERATIONS_CLASS
                    }
                });
        return $operationButton.addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS)
            .attr("tabindex", 0);
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
            $button = this._createButton(options.caption);

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
        var customOperation = utils.getCustomOperation(this._customOperations, condition[1]);
        return customOperation ?
            customOperation.hasValue !== false
            : condition[2] !== null;
    },

    _createOperationButtonWithMenu: function(condition, field) {
        var that = this,
            availableOperations = utils.getAvailableOperations(field, this.option("filterOperationDescriptions"), this._customOperations),
            currentOperation = utils.getOperationFromAvailable(utils.getOperationValue(condition), availableOperations),
            $operationButton = this._createButtonWithMenu({
                caption: currentOperation.text,
                menu: {
                    items: availableOperations,
                    displayExpr: "text",
                    onItemRendered: function(e) {
                        e.itemData.isCustom && $(e.itemElement).addClass(FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS);
                    },
                    onContentReady: function(e) {
                        e.component.selectItem(currentOperation);
                    },
                    onItemClick: function(e) {
                        if(currentOperation !== e.itemData) {
                            currentOperation = e.itemData;
                            utils.updateConditionByOperation(condition, currentOperation.value, that._customOperations);
                            var $valueButton = $operationButton.siblings().filter("." + FILTER_BUILDER_ITEM_VALUE_CLASS);
                            if(that._hasValueButton(condition)) {
                                if($valueButton.length !== 0) {
                                    $valueButton.remove();
                                }
                                that._createValueButton(condition, field).appendTo($operationButton.parent());
                            } else {
                                $valueButton.remove();
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
                        utils.updateConditionByOperation(condition, utils.getDefaultOperation(item), that._customOperations);

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
            fields = this._getNormalizedFields(),
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

    _getGroupOperations: function(criteria) {
        let groupOperations = this.option("groupOperations"),
            groupOperationDescriptions = this.option("groupOperationDescriptions");

        if(!groupOperations || !groupOperations.length) {
            groupOperations = [utils.getGroupValue(criteria).replace("!", "not")];
        }

        return groupOperations.map(operation => ({
            text: groupOperationDescriptions[operation],
            value: OPERATORS[operation]
        }));
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

    _createAddButton: function(addGroupHandler, addConditionHandler, groupLevel) {
        let $button,
            maxGroupLevel = this.option("maxGroupLevel");
        if(isDefined(maxGroupLevel) && groupLevel >= maxGroupLevel) {
            $button = this._createButton();
            this._subscribeOnClickAndEnterKey($button, addConditionHandler);
        } else {
            $button = this._createButtonWithMenu({
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
            });
        }
        return $button.addClass(FILTER_BUILDER_IMAGE_CLASS)
            .addClass(FILTER_BUILDER_IMAGE_ADD_CLASS)
            .addClass(FILTER_BUILDER_ACTION_CLASS)
            .attr("tabindex", 0);
    },

    _createValueText: function(item, field, $container) {
        var that = this,
            $text = $("<div>")
                .html("&nbsp;")
                .addClass(FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS)
                .attr("tabindex", 0)
                .appendTo($container),
            value = item[2];

        var customOperation = utils.getCustomOperation(that._customOperations, item[1]);
        if(!customOperation && field.lookup) {
            utils.getCurrentLookupValueText(field, value, function(result) {
                renderValueText($text, result);
            });
        } else {
            deferredUtils.when(utils.getCurrentValueText(field, value, customOperation)).done(result => {
                renderValueText($text, result, customOperation);
            });
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
        var document = domAdapter.getDocument(),
            that = this,
            value = item[2],
            removeEvents = function() {
                eventsEngine.off(document, "keyup", documentKeyUpHandler);
                eventsEngine.off(document, "dxpointerdown", documentClickHandler);
            },
            isFocusOnEditorParts = function(target) {
                var activeElement = target || domAdapter.getActiveElement();
                return $(activeElement).closest($editor.children()).length
                    || $(activeElement).closest(".dx-dropdowneditor-overlay").length;
            },
            createValueText = function() {
                $container.empty();
                removeEvents();
                return that._createValueText(item, field, $container);
            },
            closeEditor = function() {
                that._updateConditionValue(item, value, function() {
                    createValueText();
                });
            };

        var options = {
            value: value === "" ? null : value,
            filterOperation: utils.getOperationValue(item),
            updateValueImmediately: true,
            setValue: function(data) {
                value = data === null ? "" : data;
            },
            closeEditor: closeEditor,
            text: $container.text()
        };

        $container.empty();

        var $editor = that._createValueEditor($container, field, options);

        eventsEngine.trigger($editor.find("input").not(':hidden').eq(0), "focus");

        var documentClickHandler = function(e) {
            if(!isFocusOnEditorParts(e.target)) {
                eventsEngine.trigger($editor.find("input"), "change");
                closeEditor();
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
        var $editor = $("<div>").attr("tabindex", 0).appendTo($container),
            customOperation = utils.getCustomOperation(this._customOperations, options.filterOperation),
            editorTemplate = customOperation && customOperation.editorTemplate ? customOperation.editorTemplate : field.editorTemplate;

        if(editorTemplate) {
            var template = this._getTemplate(editorTemplate);

            template.render({
                model: extend({ field: field }, options),
                container: $editor
            });
        } else {
            this._editorFactory.createEditor.call(this, $editor, extend({}, field, options, {
                parentType: SOURCE
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
module.exports.renderValueText = renderValueText;
