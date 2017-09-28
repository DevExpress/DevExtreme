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
        var that = this,
            $element = this.element();

        //this._createContextMenu($element);
        this._renderItemsByFilter(this.option("filter"), $element);
        eventsEngine.off($element, "focusin");
        eventsEngine.on($element, "focusin", "[tabindex]", function(e) {
            that._focusedIndex = $element.find("[tabindex]").toArray().indexOf(e.target);
        });
        if(that._focusedIndex >= 0) {
            setTimeout(function() {
                $element.find("[tabindex]").eq(that._focusedIndex).focus();
            }, 0);
        }
    },

    _renderItemsByFilter: function(group, $content, parent) {
        var that = this,
            $groupItem = that._createGroupItem(group, parent),
            $groupContent = $("<div>").addClass(FILTER_BUILDER_GROUP_CONTENT_CLASS),
            $group = $("<div>").addClass(FILTER_BUILDER_GROUP_CLASS).append($groupItem).append($groupContent);

        var criteria = utils.getGroupCriteria(group);
        for(var i = 0; i < criteria.length; i++) {
            var item = criteria[i];
            if(utils.isGroup(item)) {
                that._renderItemsByFilter(item, $groupContent, criteria);
            } else if(utils.isCondition(item)) {
                $("<div>")
                    .addClass(FILTER_BUILDER_GROUP_CLASS)
                    .append(that._createConditionItem(item, criteria))
                    .appendTo($groupContent);
            }
        }
        $group.appendTo($content);
    },

    _getAvailableFields: function() {
        return this.option("fields");
    },

    _wrapOnItemClick: function(onItemClickHandler) {
        var that = this;
        return function(e) {
            if(e.jQueryEvent.type !== "keydown") {
                that._focusedIndex = -1;
            }
            onItemClickHandler(e);
        }
    },

    _createConditionItem: function(condition, parent) {
        var that = this,
            $item = $("<div>").addClass(FILTER_BUILDER_GROUP_ITEM_CLASS),
            field = utils.getField(condition[0], this._getAvailableFields());

        var $fieldButton = $("<div>")
            .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_ITEM_FIELD_CLASS)
            .text(field.caption)
            .appendTo($item);

        this._addContextMenuSubscription($fieldButton, {
            items: that._getAvailableFields(),
            displayExpr: "caption",
            onItemClick: that._wrapOnItemClick(function(e) {
                if(field.dataType !== e.itemData.dataType
                    || e.itemData.lookup) {
                    condition[1] = utils.getDefaultOperation(e.itemData);
                    condition[2] = null;
                }
                condition[0] = e.itemData.dataField;
            })
        });

        var $operationButton = $("<div>")
            .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_ITEM_OPERATOR_CLASS)
            .text(condition[1])
            .appendTo($item);

        this._addContextMenuSubscription($operationButton, {
            items: utils.getAvailableOperations(field),
            displayExpr: "text",
            onItemClick: that._wrapOnItemClick(function(e) {
                condition[1] = e.itemData.text;
            })
        });

        this._createEditor(condition, field, $item);
        this._createRemoveButton(parent, condition, $item);
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

        var $operationButton = $("<div>")
            .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS)
            .addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS)
            .text(utils.getGroupText(group, this._getGroupOperations()))
            .appendTo($item);

        this._addContextMenuSubscription($operationButton, {
            items: that._getGroupOperations(),
            displayExpr: "text",
            onItemClick: that._wrapOnItemClick(function(e) {
                utils.setGroupValue(group, e.itemData.value);
            })
        });

        if(parent != null) {
            this._createRemoveButton(parent, group, $item);
        }
        this._createAddButton(group, $item);

        return $item;
    },

    _createRemoveButton: function(parent, item, $item) {
        var that = this,
            $removeButton = $("<div>")
                .addClass(FILTER_BUILDER_IMAGE_CLASS)
                .addClass(FILTER_BUILDER_IMAGE_REMOVE_CLASS)
                .addClass(FILTER_BUILDER_ACTION_CLASS);
        var remove = function() {
            utils.removeItem(parent, item);
            that._refresh();
        };
        this._subscribeOnClickAndEnterKey($removeButton, remove);
        $removeButton.prependTo($item);
    },

    _createAddButton: function(group, $item) {
        var that = this,
            $addButton = $("<div>")
                .addClass(FILTER_BUILDER_IMAGE_CLASS)
                .addClass(FILTER_BUILDER_IMAGE_ADD_CLASS)
                .addClass(FILTER_BUILDER_ACTION_CLASS);

        $addButton.appendTo($item);
        var availableValues = [
            {
                caption: messageLocalization.format("dxFilterBuilder-addGroup"),
                click: function() {
                    var newGroup = utils.createEmptyGroup(that.option("defaultGroupOperation"));
                    utils.addItem(newGroup, group);
                }
            },
            {
                caption: messageLocalization.format("dxFilterBuilder-addCondition"),
                click: function() {
                    var firstField = that._getAvailableFields()[0];
                    var availableOperations = utils.getDefaultOperation(firstField);

                    var condition = utils.createCondition(firstField.dataField, availableOperations[0], "");
                    utils.addItem(condition, group);
                }
            }
        ];
        this._addContextMenuSubscription($addButton, {
            items: availableValues,
            displayExpr: "caption",
            onItemClick: that._wrapOnItemClick(function(e) {
                e.itemData.click();
            })
        });
    },

    _createEditor: function(item, field, $item) {
        var that = this,
            $container = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_TEXT_CLASS);

        var setText = function(item, field, $container) {
            var valueText = utils.getCurrentValueText(field, item[2]) || messageLocalization.format("dxFilterBuilder-enterValueText");

            var $text = $("<div>")
                .addClass(FILTER_BUILDER_ITEM_VALUE_CLASS)
                .attr("tabindex", 0)
                .text(valueText);

            that._subscribeOnClickAndEnterKey($text, function() {
                $container.empty();
                createEditor(item, field, $container);
            }, "keyup");
            $text.appendTo($container);
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

            var handler = function(applyValue) {
                $container.empty();
                if(applyValue) {
                    item[2] = value;
                }
                setText(item, field, $container);
            }
            eventsEngine.on($editor, "focusout", function() {
                handler(true);
            });
            eventsEngine.on($editor, "keyup", function(e) {
                if(e.keyCode === 13 || e.keyCode === 27) {
                    handler(e.keyCode === 13);
                }
            });

            eventsEngine.trigger($editor.find("input"), "focus");
        };

        setText(item, field, $container);
        $container.appendTo($item);
    },

    /*_contextMenu: null,

    _createContextMenu: function($container) {
        if(this._contextMenu) {
            return;
        }
        var position;
        if(this.option("rtlEnabled")) {
            position = "right";
        } else {
            position = "left";
        }
        this._createComponent($container, ContextMenu, {
            visible: false,
            showEvent: null,
            focusStateEnabled: true,
            position: { my: position + " top", at: position + " bottom", offset: "0 1" }
        });

        this._contextMenu = $container.dxContextMenu("instance");
    },

    _subscribeOnClickAndEnterKey: function($button, handler) {
        eventsEngine.on($button, "click", handler);
        eventsEngine.on($button, "keypress", function(e) {
            if(e.keyCode === 13) {
                handler();
            }
        });
        $button.attr("tabindex", 0);
    },

    _addContextMenuSubscription: function($button, contextMenuSettings) {
        var that = this,
            contextMenu = that._contextMenu;

        var changeContextMenuState = function() {
            contextMenu.hide();
            $button.addClass(ACTIVE_CLASS);
            contextMenuSettings.onHiding = function() {
                $button.removeClass(ACTIVE_CLASS);
            };
            contextMenuSettings.target = $button;
            contextMenu.option(contextMenuSettings);
            contextMenu.show();
        };

        this._subscribeOnClickAndEnterKey($button, changeContextMenuState);
    }*/

    _createContextMenu: function($container, options) {
        if(this._contextMenu) {
            return;
        }
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
        return $contextMenuElement;
    },

    _subscribeOnClickAndEnterKey: function($button, handler, keyEvent) {
        eventsEngine.on($button, "click", handler);
        eventsEngine.on($button, keyEvent || "keydown", function(e) {
            if(e.keyCode === 13) {
                handler();
            }
        });
        $button.attr("tabindex", 0);
    },

    _addContextMenuSubscription: function($button, contextMenuSettings) {
        var that = this;

        var changeContextMenuState = function() {
            $button.addClass(ACTIVE_CLASS);
            contextMenuSettings.onHiding = function() {
                //$button.removeClass(ACTIVE_CLASS);
                //$contextMenuElement.remove();
                that._refresh();
            };
            contextMenuSettings.target = $button;
            var $contextMenuElement = that._createContextMenu(that.element(), contextMenuSettings);
            //contextMenu.option(contextMenuSettings);
            //contextMenu.show();
        };

        this._subscribeOnClickAndEnterKey($button, changeContextMenuState);
    }
});

registerComponent("dxFilterBuilder", FilterBuilder);

module.exports = FilterBuilder;
