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

    _createGroupElement: function(criteria, parent) {
        var $groupItem = this._createGroupItem(criteria, parent),
            $groupContent = $("<div>").addClass(FILTER_BUILDER_GROUP_CONTENT_CLASS),
            $group = $("<div>").addClass(FILTER_BUILDER_GROUP_CLASS).append($groupItem).append($groupContent);

        if(parent != null) {
            this._createRemoveButton(parent, criteria, $groupItem, $group);
        }
        this._createAddButton(criteria, $group, $groupItem, $groupContent);

        return $group;
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

    _getAvailableFields: function() {
        return this.option("fields");
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

    _createConditionItem: function(condition, parent) {
        var that = this,
            $item = $("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            field = utils.getField(condition[0], this._getAvailableFields());

        var createOperationButtonWithMenu = function(condition, field) {
            var $operationButton = that._createButtonWithMenu({
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
                .attr("tabindex", 0)
                .appendTo($item);
        };

        var createOperationAndValueButtons = function(condition, field, $item) {
            createOperationButtonWithMenu(condition, field);
            that._createEditor(condition, field, $item);
        };

        var $fieldButton = this._createButtonWithMenu({
            caption: field.caption,
            contextMenu: {
                items: that._getAvailableFields(),
                displayExpr: "caption",
                onItemClick: function(e) {
                    if(field.dataType !== e.itemData.dataType
                        || e.itemData.lookup || field.lookup) {
                        condition[1] = utils.getDefaultOperation(e.itemData);
                        condition[2] = null;

                        $item.find("." + FILTER_BUILDER_ITEM_TEXT_CLASS + ":not(." + FILTER_BUILDER_ITEM_FIELD_CLASS + ")").remove();
                        createOperationAndValueButtons(condition, e.itemData, $item);
                    }
                    condition[0] = e.itemData.dataField;
                    $fieldButton.html(e.itemData.caption);
                }
            }
        }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_ITEM_FIELD_CLASS)
            .attr("tabindex", 0)
            .appendTo($item);

        createOperationAndValueButtons(condition, field, $item);

        this._createRemoveButton(parent, condition, $item, $item);

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

    _createRemoveButton: function(parent, item, $item, $group) {
        var $removeButton = $("<div>")
                .addClass(FILTER_BUILDER_IMAGE_CLASS)
                .addClass(FILTER_BUILDER_IMAGE_REMOVE_CLASS)
                .addClass(FILTER_BUILDER_ACTION_CLASS)
                .attr("tabindex", 0)
                .prependTo($item);
        var handler = function() {
            utils.removeItem(parent, item);
            $group.remove();
        };
        this._subscribeOnClickAndEnterKey($removeButton, handler);
    },

    _createAddButton: function(group, $group, $item, $groupContent) {
        var that = this;

        var availableValues = [
            {
                caption: messageLocalization.format("dxFilterBuilder-addGroup"),
                click: function() {
                    var newGroup = utils.createEmptyGroup(that.option("defaultGroupOperation"));
                    utils.addItem(newGroup, group);

                    that._createGroupElement(newGroup, group).appendTo($groupContent);
                }
            },
            {
                caption: messageLocalization.format("dxFilterBuilder-addCondition"),
                click: function() {
                    var firstField = that._getAvailableFields()[0];
                    var availableOperations = utils.getDefaultOperation(firstField);

                    var condition = utils.createCondition(firstField.dataField, availableOperations[0], "");
                    utils.addItem(condition, group);

                    // TODO: it is copy
                    $("<div>")
                        .addClass(FILTER_BUILDER_GROUP_CLASS)
                        .append(that._createConditionItem(condition, group))
                        .appendTo($groupContent);
                }
            }
        ];

        this._createButtonWithMenu({
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
            .attr("tabindex", 0)
            .appendTo($item);
    },

    _createEditor: function(item, field, $item) {
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
        $container.appendTo($item);
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
