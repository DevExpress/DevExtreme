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
    FILTER_BUILDER_POPUP_CLASS = "dx-filterbuilder-popup",
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
              * @type_function_param1_field1 value:any
              * @type_function_param1_field2 setValue(newValue):any
              * @type_function_param1_field3 cancel:boolean
              * @type_function_param1_field4 editorElement:jQuery
              * @type_function_param1_field6 editorName:string
              * @type_function_param1_field7 editorOptions:object
              * @type_function_param1_field8 dataField:string
              * @extends Action
              * @action
             */
            onEditorPreparing: null,

            /**
              * @name dxFilterBuilderOptions_onEditorPrepared
              * @publicName onEditorPrepared
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field1 value:any
              * @type_function_param1_field2 setValue(newValue):any
              * @type_function_param1_field3 cancel:boolean
              * @type_function_param1_field4 editorElement:jQuery
              * @type_function_param1_field6 editorName:string
              * @type_function_param1_field7 editorOptions:object
              * @type_function_param1_field8 dataField:string
              * @extends Action
              * @action
             */
            onEditorPrepared: null,

            /**
            * @name dxFilterBuilderOptions_fields
            * @publicName fields
            * @default []
            */
            fields: [],

            /**
            * @name dxFilterBuilderOptions_defaultGroupOperation
            * @publicName defaultGroupOperation
            * @default "And"
            */
            defaultGroupOperation: "And",

            /**
             * @name dxFilterBuilderOptions_filter
             * @publicName filter
             * @default []
             */
            filter: [],

            /**
             * @name dxFilterBuilderOptions_allowHierarchicalFields
             * @publicName allowHierarchicalFields
             * @default false
             */
            allowHierarchicalFields: false,

            /**
             * @name dxFilterBuilderOptions_groupOperatorDescriptions
             * @publicName groupOperatorDescriptions
             * @type object
             */
            groupOperatorDescriptions: {
                /**
                 * @name dxFilterBuilderOptions_groupOperatorDescriptions_and
                 * @publicName and
                 * @type string
                 * @default "And"
                 */
                and: messageLocalization.format("dxFilterBuilder-and"),
                /**
                 * @name dxFilterBuilderOptions_groupOperatorDescriptions_or
                 * @publicName or
                 * @type string
                 * @default "Or"
                 */
                or: messageLocalization.format("dxFilterBuilder-or"),
                /**
                 * @name dxFilterBuilderOptions_groupOperatorDescriptions_notAnd
                 * @publicName notAnd
                 * @type string
                 * @default "Not And"
                 */
                notAnd: messageLocalization.format("dxFilterBuilder-notAnd"),
                /**
                 * @name dxFilterBuilderOptions_groupOperatorDescriptions_notOr
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
            case "filter":
            case "allowHierarchicalFields":
            case "groupOperatorDescriptions":
            case "filterOperationDescriptions":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    getNormalizedFilter: function() {
        var normalizedFilter = extend(true, [], this.option("filter"));
        return utils.getNormalizedFilter(normalizedFilter);
    },

    _init: function() {
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
        this._createGroupElementByCriteria(this.option("filter"))
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
        }).appendTo($groupItem);

        return $group;
    },

    _createGroupOperationButton: function(criteria) {
        var groupOperations = this._getGroupOperations(),
            groupMenuItem = utils.getGroupMenuItem(criteria, groupOperations),
            updateGroupMenuItem = function(component, groupMenuItem) {
                component.unselectAll();
                component.selectItem(groupMenuItem);
            };
        var $operationButton = this._createButtonWithMenu({
            caption: groupMenuItem.text,
            menu: {
                items: groupOperations,
                displayExpr: "text",
                keyExpr: "value",
                onItemClick: function(e) {
                    utils.setGroupValue(criteria, e.itemData.value);
                    groupMenuItem = e.itemData;
                    updateGroupMenuItem(e.component, groupMenuItem);
                    $operationButton.html(e.itemData.text);
                    // EVENT: groupValueChanged(e = {newValue, ?oldValue?})
                },
                onContentReady: function(e) {
                    updateGroupMenuItem(e.component, groupMenuItem);
                }
            }
        }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS)
            .attr("tabindex", 0);
        return $operationButton;
    },

    _createButtonWithMenu: function(options) {
        var that = this,
            $button = $("<div>").text(options.caption),
            removeMenu = function() {
                that.$element().find("." + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
                that.$element().find(".dx-has-context-menu").remove();
                that.$element().find(".dx-overlay").remove();
            },
            menuOnItemClickWrapper = function(handler) {
                return function(e) {
                    handler(e);
                    removeMenu();
                    if(e.jQueryEvent.type === "keydown") {
                        eventsEngine.trigger($button, "focus");
                    }
                };
            },
            treeViewOptions = extend(options.menu, {
                focusStateEnabled: true,
                selectionMode: "single",
                onItemClick: menuOnItemClickWrapper(options.menu.onItemClick),
                rtlEnabled: this.option("rtlEnabled")
            }),
            showPopup = function() {
                var popupOptions = {
                    target: $button,
                    onHiding: function(e) {
                        $button.removeClass(ACTIVE_CLASS);
                    },
                    onHidden: function() {
                        removeMenu();
                    },
                    rtlEnabled: treeViewOptions.rtlEnabled,
                    contentTemplate: function(contentElement) {
                        var $treeView = $("<div>");
                        that._createComponent($treeView, TreeView, treeViewOptions);
                        return $treeView;
                    }
                };

                removeMenu();
                $button.addClass(ACTIVE_CLASS);
                that._createPopup(popupOptions, $button);
            };
        this._subscribeOnClickAndEnterKey($button, showPopup);
        return $button;
    },

    _createOperationButtonWithMenu: function(condition, field) {
        var filterOperationDescriptions = this.option("filterOperationDescriptions"),
            $operationButton = this._createButtonWithMenu({
                caption: utils.getCaptionByOperation(utils.getOperatorValue(condition), filterOperationDescriptions),
                menu: {
                    items: utils.getAvailableOperations(field, filterOperationDescriptions),
                    displayExpr: "text",
                    onItemClick: function(e) {
                        utils.updateConditionByOperator(condition, e.itemData.text);
                        var hasValueButton = $operationButton.siblings().filter("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length > 0;
                        if(condition[2] !== null) {
                            if(!hasValueButton) {
                                that._createValueButton(condition, field)
                                .appendTo($operationButton.parent());
                            }
                        } else {
                            $operationButton.siblings().filter("." + FILTER_BUILDER_ITEM_VALUE_CLASS).remove();
                        }
                        $operationButton.html(e.itemData.text);
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
            },
            updateFieldMenuItem = function(component, field) {
                component.unselectAll();
                component.selectItem(item);
            };

        var $fieldButton = this._createButtonWithMenu({
            caption: getFullCaption(item, items),
            menu: {
                items: items,
                dataStructure: "plain",
                keyExpr: "dataField",
                displayExpr: "caption",
                onItemClick: function(e) {
                    item = e.itemData;
                    condition[0] = item.dataField;
                    if(item.dataType === "object") {
                        condition[2] = null;
                    }
                    utils.updateConditionByOperator(condition, utils.getDefaultOperation(item));

                    $fieldButton.siblings().filter("." + FILTER_BUILDER_ITEM_TEXT_CLASS).remove();
                    that._createOperationAndValueButtons(condition, item, $fieldButton.parent());

                    updateFieldMenuItem(e.component, item);
                    var caption = getFullCaption(item, e.component.option("items"));
                    $fieldButton.html(caption);
                },
                onContentReady: function(e) {
                    updateFieldMenuItem(e.component, item);
                }
            }
        }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_ITEM_FIELD_CLASS)
            .attr("tabindex", 0);

        return $fieldButton;
    },

    _createConditionItem: function(condition, parent) {
        var $item = $("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            field = utils.getField(condition[0], this.option("fields"));

        this._createRemoveButton(function() {
            utils.removeItem(parent, condition);
            $item.remove();
        }).appendTo($item);
        this._createFieldButtonWithMenu(condition, field).appendTo($item);
        this._createOperationAndValueButtons(condition, field, $item);
        return $item;
    },

    _getGroupOperations: function() {
        var result = [],
            operatorDescription,
            groupOperatorDescriptions = this.option("groupOperatorDescriptions");

        for(operatorDescription in groupOperatorDescriptions) {
            result.push({
                text: groupOperatorDescriptions[operatorDescription],
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

    _createValueButton: function(item, field) {
        var that = this,
            $valueButton = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
                .addClass(FILTER_BUILDER_ITEM_VALUE_CLASS);

        var createValueText = function(item, field, $container) {
            var valueText = utils.getCurrentValueText(field, item[2]) || messageLocalization.format("dxFilterBuilder-enterValueText");

            var $text = $("<div>")
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
                    createValueText(item, field, $container);
                });
                eventsEngine.on($editor, "keyup", function(e) {
                    if(e.keyCode === 13 || e.keyCode === 27) {
                        eventsEngine.off($editor, "focusout");
                        $container.empty();
                        if(e.keyCode === 13) {
                            item[2] = value;
                        }
                        var $newTextElement = createValueText(item, field, $container);
                        eventsEngine.trigger($newTextElement, "focus");
                    }
                });
            }, "keyup");

            return $text;
        };

        createValueText(item, field, $valueButton);
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

    _createPopup: function(options, $button) {
        var $popup = $("<div>")
                .addClass(FILTER_BUILDER_POPUP_CLASS)
                .insertAfter($button),
            position = options.rtlEnabled ? "right" : "left";

        this._createComponent($popup, Popup, extend({
            visible: true,
            focusStateEnabled: false,
            closeOnOutsideClick: true,
            rtlEnabled: this.option("rtlEnabled"),
            shading: false,
            width: "auto",
            height: "auto",
            showTitle: false,
            deferRendering: false,
            position: { my: position + " top", at: position + " bottom", offset: "0 1" },
            animation: { show: { type: 'fade', from: 1, to: 1, delay: 0 }, hide: { type: 'fade', from: 0, to: 0, delay: 0 } }
        }, options));

        return $popup;
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
