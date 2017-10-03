"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    Widget = require("../widget/ui.widget"),
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    messageLocalization = require("../../localization/message"),
    utils = require("./utils"),
    ContextMenu = require("../context_menu"),
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
    ACTIVE_CLASS = "dx-state-active",

    ACTIONS = [
        "onEditorPreparing", "onEditorPrepared"
    ];

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
        this._initActions();
        this.callBase();
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

        var $operationButton = this._createButtonWithMenu({
            caption: utils.getGroupText(criteria, this._getGroupOperations()),
            contextMenu: {
                items: this._getGroupOperations(),
                displayExpr: "text",
                onItemClick: function(e) {
                    utils.setGroupValue(criteria, e.itemData.value);
                    $operationButton.html(e.itemData.text);
                    // EVENT: groupValueChanged(e = {newValue, ?oldValue?})
                }
            }
        }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS)
            .attr("tabindex", 0)
            .appendTo($groupItem);

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

    _createButtonWithMenu: function(options) {
        var that = this,
            $button = $("<div>").text(options.caption),
            removeAllAvailableMenu = function() {
                that.$element().find("." + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
                that.$element().find(".dx-has-context-menu").remove();
            },
            contextMenuOnItemClickWrapper = function(handler) {
                return function(e) {
                    handler(e);

                    if(e.jQueryEvent.type === "keydown") {
                        eventsEngine.trigger($button, "focus");
                    }
                };
            },
            extendedMenuOptions = extend(options.contextMenu, {
                target: $button,
                rtlEnabled: this.option("rtlEnabled"),
                onHidden: function(e) {
                    $button.removeClass(ACTIVE_CLASS);
                    removeAllAvailableMenu();
                },
                onItemClick: contextMenuOnItemClickWrapper(options.contextMenu.onItemClick)
            }),
            showContextMenu = function() {
                removeAllAvailableMenu();
                $button.addClass(ACTIVE_CLASS);
                that._createContextMenu(extendedMenuOptions)
                    .appendTo(that.$element())
                    .dxContextMenu("show");
            };

        this._subscribeOnClickAndEnterKey($button, showContextMenu);

        return $button;
    },

    _createOperationButtonWithMenu: function(condition, field) {
        var $operationButton = this._createButtonWithMenu({
            caption: condition[1],
            contextMenu: {
                items: utils.getAvailableOperations(field.filterOperations),
                displayExpr: "text",
                onItemClick: function(e) {
                    condition[1] = e.itemData.text;
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
        this._createValueButton(condition, field)
            .appendTo($item);
    },

    _createFieldButtonWithMenu: function(condition, field) {
        var that = this;
        var $fieldButton = this._createButtonWithMenu({
            caption: field.caption,
            contextMenu: {
                items: this.option("fields"),
                displayExpr: "caption",
                onItemClick: function(e) {
                    if(field.dataType !== e.itemData.dataType
                        || e.itemData.lookup || field.lookup) {
                        condition[1] = utils.getDefaultOperation(e.itemData);
                        condition[2] = null;

                        $fieldButton.siblings("." + FILTER_BUILDER_ITEM_TEXT_CLASS).remove();
                        that._createOperationAndValueButtons(condition, e.itemData, $fieldButton.parent());
                    }
                    condition[0] = e.itemData.dataField;
                    field = e.itemData;
                    $fieldButton.html(e.itemData.caption);
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
        return [{
            text: messageLocalization.format("dxFilterBuilder-and"),
            value: "And"
        }, {
            text: messageLocalization.format("dxFilterBuilder-or"),
            value: "Or"
        }, {
            text: messageLocalization.format("dxFilterBuilder-notAnd"),
            value: "!And"
        }, {
            text: messageLocalization.format("dxFilterBuilder-notOr"),
            value: "!Or"
        }];
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
            contextMenu: {
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
        // TODO: it have to be in shared file
        this.createEditor($editor, extend({}, field, {
            value: value,
            parentType: "filterRow",
            setValue: setValueHandler,
            lookup: field.lookup
        }));
        return $editor;
    },

    _createContextMenu: function(options) {
        var $contextMenuElement = $("<div>"),
            position = options.rtlEnabled ? "right" : "left";

        this._createComponent($contextMenuElement, ContextMenu, extend({
            visible: false,
            focusStateEnabled: true,
            position: { my: position + " top", at: position + " bottom", offset: "0 1" }
        }, options));
        return $contextMenuElement;
    },

    _subscribeOnClickAndEnterKey: function($button, handler, keyEvent) {
        eventsEngine.on($button, "click", handler);
        eventsEngine.on($button, keyEvent || "keydown", function(e) {
            if(e.keyCode === 13) {
                handler();
            }
        });
    }
}).include(EditorFactoryMixin);

registerComponent("dxFilterBuilder", FilterBuilder);

module.exports = FilterBuilder;
