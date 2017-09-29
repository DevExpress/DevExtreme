"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    Widget = require("../widget/ui.widget"),
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    messageLocalization = require("../../localization/message"),
    EditorFactoryController = require("../grid_core/ui.grid_core.editor_factory").controllers.editorFactory,
    utils = require("./utils"),
    ContextMenu = require("../context_menu");

var FILTER_BUILDER_CLASS = "dx-filterbuilder",
    FILTER_BUILDER_GROUP_CLASS = "dx-filterbuilder-group",
    FILTER_BUILDER_GROUP_ITEM_CLASS = "dx-filterbuilder-group-item",
    FILTER_BUILDER_GROUP_CONTENT_CLASS = "dx-filterbuilder-group-content",
    FILTER_BUILDER_GROUP_OPERATION_CLASS = "dx-filterbuilder-group-operation",
    FILTER_BUILDER_ACTION_CLASS = "dx-filterbuilder-action",
    FILTER_BUILDER_IMAGE_CLASS = "dx-filterbuilder-action-icon",
    FILTER_BUILDER_ITEM_TEXT_CLASS = "dx-filterbuilder-text",
    FILTER_BUILDER_IMAGE_ADD_CLASS = "dx-icon-plus",
    FILTER_BUILDER_IMAGE_REMOVE_CLASS = "dx-icon-remove",
    FILTER_BUILDER_ITEM_FIELD_CLASS = "dx-filterbuilder-item-field",
    FILTER_BUILDER_ITEM_VALUE_CLASS = "dx-filterbuilder-item-value",
    FILTER_BUILDER_ITEM_OPERATOR_CLASS = "dx-filterbuilder-item-operator",
    ACTIVE_CLASS = "dx-state-active",

    ACTIONS = [
        "onEditorPreparing", "onEditorPrepared"
    ];

var editorFactoryController = new EditorFactoryController();

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
             * @name dxFilterBuilderOptions_height
             * @publicName height
             * @default 300
             */
            height: 300,

            /**
             * @name dxFilterBuilderOptions_width
             * @publicName width
             * @default 400
             */
            width: 400
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
    // TODO
    _initActions: function() {
        var that = this;
        this._actions = {};

        ACTIONS.forEach(function(action) {
            that._actions[action] = that._createActionByOption(action);
        });
    },
    // TODO: from ui.grid_core.modules
    executeAction: function(actionName, options) {
        var action = this._actions[actionName];

        return action && action(options);
    },

    _render: function() {
        this.element().addClass(FILTER_BUILDER_CLASS);
        this.callBase();
    },

    _renderContentImpl: function() {
        this._createGroupElementByCriteria(this.option("filter"))
            .appendTo(this.element());
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
            var condition = groupCriteria[i];
            if(utils.isGroup(condition)) {
                this._createGroupElementByCriteria(condition, groupCriteria)
                    .appendTo($groupContent);
            } else if(utils.isCondition(condition)) {
                this._createConditionElement(condition, groupCriteria)
                    .appendTo($groupContent);
            }
        }
        return $group;
    },

    _createGroupElement: function(criteria, parent) {
        var $groupItem = this._createGroupItem(criteria, parent),
            $groupContent = $("<div>").addClass(FILTER_BUILDER_GROUP_CONTENT_CLASS),
            $group = $("<div>").addClass(FILTER_BUILDER_GROUP_CLASS).append($groupItem).append($groupContent);

        if(parent != null) {
            this._createRemoveButton(function() {
                utils.removeItem(parent, criteria);
                $group.remove();
            }).prependTo($groupItem);
        }
        this._createAddButton(criteria, $groupContent)
            .appendTo($groupItem);

        return $group;
    },

    _createGroupItem: function(group, parent) {
        var that = this,
            $item = $("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS);

        var $operationButton = this._createButtonWithMenu({
            caption: utils.getGroupText(group, that._getGroupOperations()),
            contextMenu: {
                items: that._getGroupOperations(),
                displayExpr: "text",
                onItemClick: function(e) {
                    utils.setGroupValue(group, e.itemData.value);
                    $operationButton.html(utils.getGroupText(group, that._getGroupOperations()));
                }
            }
        }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS)
            .attr("tabindex", 0)
            .appendTo($item);

        return $item;
    },

    _createButtonWithMenu: function(options) {
        var that = this,
            $button = $("<div>")
            .text(options.caption);

        var removeContextMenu = function() {
            that.element().find("." + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
            that.element().find(".dx-has-context-menu").remove();
        };

        var extendedMenuOptions = extend({
            onHidden: function(e) {
                $button.removeClass(ACTIVE_CLASS);
                removeContextMenu();
            },
            target: $button
        }, options.contextMenu);

        extendedMenuOptions.onItemClick = function(e) {
            options.contextMenu.onItemClick(e);

            if(e.jQueryEvent.type === "keydown") {
                eventsEngine.trigger($button, "focus");
            }
        };

        var changeContextMenuState = function() {
            removeContextMenu();
            $button.addClass(ACTIVE_CLASS);
            that._createContextMenu(that.element(), extendedMenuOptions);
        };

        this._subscribeOnClickAndEnterKey($button, changeContextMenuState);

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
            .addClass(FILTER_BUILDER_ITEM_OPERATOR_CLASS)
            .attr("tabindex", 0);

        return $operationButton;
    },

    _createOperationAndValueButtons: function(condition, field, $item) {
        this._createOperationButtonWithMenu(condition, field)
            .appendTo($item);
        this._createEditor(condition, field)
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

        this._createFieldButtonWithMenu(condition, field)
            .appendTo($item);

        this._createOperationAndValueButtons(condition, field, $item);

        this._createRemoveButton(function() {
            utils.removeItem(parent, condition);
            $item.remove();
        }).prependTo($item);

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

    _createAddButton: function(groupCriteria, $groupContent) {
        var that = this;

        var availableValues = [
            {
                caption: messageLocalization.format("dxFilterBuilder-addGroup"),
                click: function() {
                    var newGroup = utils.createEmptyGroup(that.option("defaultGroupOperation"));
                    utils.addItem(newGroup, groupCriteria);

                    that._createGroupElement(newGroup, groupCriteria).appendTo($groupContent);
                }
            },
            {
                caption: messageLocalization.format("dxFilterBuilder-addCondition"),
                click: function() {
                    var firstField = that.option("fields")[0];
                    var availableOperations = utils.getDefaultOperation(firstField);

                    var condition = utils.createCondition(firstField.dataField, availableOperations[0], "");
                    utils.addItem(condition, groupCriteria);

                    that._createConditionElement(condition, groupCriteria)
                        .appendTo($groupContent);
                }
            }
        ];

        return this._createButtonWithMenu({
            contextMenu: {
                items: availableValues,
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

    _createEditor: function(item, field) {
        var that = this,
            $container = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS);

        var setText = function(item, field, $container, focus) {
            var valueText = utils.getCurrentValueText(field, item[2]) || messageLocalization.format("dxFilterBuilder-enterValueText");

            var $text = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_VALUE_CLASS)
                .attr("tabindex", 0)
                .text(valueText);

            that._subscribeOnClickAndEnterKey($text, function() {
                $container.empty();
                createEditor(item, field, $container);
            }, "keyup");
            $text.attr("tabindex", 0)
                .appendTo($container);

            if(focus) {
                eventsEngine.trigger($text, "focus");
            }
        };

        var createEditor = function(item, field, $container) {
            var $editor = $("<div>");
            $editor.attr("tabindex", 0);
            // TODO: it have to be in shared file
            var value = item[2];
            editorFactoryController.createEditor.call(that, $editor, extend({}, field, {
                value: value,
                parentType: "filterRow",
                setValue: function(data) {
                    value = data;
                },
                lookup: field.lookup
            }));
            $editor.appendTo($container);

            eventsEngine.on($editor, "focusout", function() {
                $container.empty();
                item[2] = value;
                setText(item, field, $container);
            });

            eventsEngine.on($editor, "keyup", function(e) {
                if(e.keyCode === 13 || e.keyCode === 27) {
                    eventsEngine.off($editor, "focusout");
                    $container.empty();
                    if(e.keyCode === 13) {
                        item[2] = value;
                    }
                    setText(item, field, $container, true);
                }
            });

            eventsEngine.trigger($editor.find("input"), "focus");
        };

        setText(item, field, $container);
        return $container;
    },

    _createContextMenu: function($container, options) {
        var $contextMenuElement = $("<div>").appendTo($container),
            position;
        if(this.option("rtlEnabled")) {
            position = "right";
        } else {
            position = "left";
        }
        this._createComponent($contextMenuElement, ContextMenu, extend({
            visible: false,
            focusStateEnabled: true,
            position: { my: position + " top", at: position + " bottom", offset: "0 1" }
        }, options)).show();
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
