import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import Button from "./button";
import CollectionWidget from "./collection/ui.collection_widget.edit";
import registerComponent from "../core/component_registrator";
import { extend } from "../core/utils/extend";
import { isDefined } from "../core/utils/type";
import { BindableTemplate } from "../core/templates/bindable_template";

const BUTTON_GROUP_CLASS = "dx-buttongroup",
    BUTTON_GROUP_WRAPPER_CLASS = BUTTON_GROUP_CLASS + "-wrapper",
    BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + "-item",
    BUTTON_GROUP_FIRST_ITEM_CLASS = BUTTON_GROUP_CLASS + "-first-item",
    BUTTON_GROUP_LAST_ITEM_CLASS = BUTTON_GROUP_CLASS + "-last-item",
    BUTTON_GROUP_ITEM_HAS_WIDTH = BUTTON_GROUP_ITEM_CLASS + "-has-width",
    SHAPE_STANDARD_CLASS = "dx-shape-standard";

const ButtonCollection = CollectionWidget.inherit({
    _initTemplates() {
        this.callBase();

        /**
         * @name dxButtonGroupItem
         * @inherits CollectionWidgetItem
         * @type object
         */
        /**
         * @name dxButtonGroupItem.hint
         * @type String
         */
        /**
         * @name dxButtonGroupItem.type
         * @type Enums.ButtonType
         * @default 'normal'
         */
        /**
         * @name dxButtonGroupItem.icon
         * @type String
         */
        /**
         * @name dxButtonGroupItem.html
         * @hidden
         */
        this._defaultTemplates["item"] = new BindableTemplate((($container, data, model) => {
            this._prepareItemStyles($container);
            this._createComponent($container, Button, extend({}, model, data, this._getBasicButtonOptions(), {
                _templateData: model,
                template: model.template || this.option("buttonTemplate")
            }));
        }), ["text", "type", "icon", "disabled", "visible", "hint"], this.option("integrationOptions.watchMethod"));
    },

    _getBasicButtonOptions() {
        return {
            focusStateEnabled: false,
            onClick: null,
            hoverStateEnabled: this.option("hoverStateEnabled"),
            activeStateEnabled: this.option("activeStateEnabled"),
            stylingMode: this.option("stylingMode")
        };
    },

    _getDefaultOptions: function _getDefaultOptions() {
        return extend(this.callBase(), {
            itemTemplateProperty: null
        });
    },

    _prepareItemStyles($item) {
        const itemIndex = $item.data("dxItemIndex");
        itemIndex === 0 && $item.addClass(BUTTON_GROUP_FIRST_ITEM_CLASS);

        const items = this.option("items");
        items && itemIndex === items.length - 1 && $item.addClass(BUTTON_GROUP_LAST_ITEM_CLASS);

        $item.addClass(SHAPE_STANDARD_CLASS);
    },

    _renderItemContent(options) {
        options.container = $(options.container).parent();
        this.callBase(options);
    },

    _focusTarget() {
        return this.$element().parent();
    },

    _keyboardEventBindingTarget() {
        return this._focusTarget();
    },

    _refreshContent() {
        this._prepareContent();
        this._renderContent();
    },

    _itemClass() {
        return BUTTON_GROUP_ITEM_CLASS;
    },

    _itemSelectHandler: function(e) {
        if(this.option("selectionMode") === "single" && this.isItemSelected(e.currentTarget)) {
            return;
        }

        this.callBase(e);
    }
});

/**
 * @name dxButtonGroup
 * @inherits Widget
 * @module ui/button_group
 * @export default
 */
const ButtonGroup = Widget.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            /**
             * @name dxButtonGroupOptions.hoverStateEnabled
             * @type boolean
             * @default true
             */
            hoverStateEnabled: true,

            /**
             * @name dxButtonGroupOptions.focusStateEnabled
             * @type boolean
             * @default true
             */
            focusStateEnabled: true,

            /**
            * @name dxButtonGroupOptions.selectionMode
            * @type Enums.ButtonGroupSelectionMode
            * @default 'single'
            */
            selectionMode: "single",

            /**
             * @name dxButtonGroupOptions.selectedItems
             * @type Array<any>
             * @fires dxButtonGroupOptions.onSelectionChanged
             */
            selectedItems: [],

            /**
             * @name dxButtonGroupOptions.selectedItemKeys
             * @type Array<any>
             * @fires dxButtonGroupOptions.onSelectionChanged
             */
            selectedItemKeys: [],

            /**
             * @name dxButtonGroupOptions.stylingMode
             * @type Enums.ButtonStylingMode
             * @default 'contained'
             */
            stylingMode: "contained",

            /**
             * @name dxButtonGroupOptions.keyExpr
             * @type string|function
             * @default 'text'
             */
            keyExpr: "text",

            /**
             * @name dxButtonGroupOptions.items
             * @type Array<dxButtonGroupItem>
             */
            items: [],

            /**
             * @name dxButtonGroupOptions.itemTemplate
             * @type template|function
             * @deprecated dxButtonGroupOptions.buttonTemplate
             */

            /**
             * @name dxButtonGroupOptions.buttonTemplate
             * @type template|function
             * @default "content"
             * @type_function_param1 buttonData:object
             * @type_function_param2 buttonContent:dxElement
             * @type_function_return string|Node|jQuery
             */
            buttonTemplate: "content",

            /**
             * @name dxButtonGroupOptions.onSelectionChanged
             * @extends Action
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 addedItems:array<any>
             * @type_function_param1_field5 removedItems:array<any>
             * @action
             */
            onSelectionChanged: null,

            /**
            * @name dxButtonGroupOptions.onItemClick
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:dxElement
            * @type_function_param1_field6 itemIndex:number
            * @type_function_param1_field7 event:event
            * @action
            */
            onItemClick: null
        });
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            "itemTemplate": { since: "19.2", alias: "buttonTemplate" }
        });
    },

    _init() {
        this.callBase();
        this._createItemClickAction();
    },

    _createItemClickAction() {
        this._itemClickAction = this._createActionByOption("onItemClick");
    },

    _initMarkup() {
        this.setAria("role", "group");
        this.$element().addClass(BUTTON_GROUP_CLASS);
        this._renderButtons();
        this._syncSelectionOptions();
        this.callBase();
    },

    _fireSelectionChangeEvent: function(addedItems, removedItems) {
        this._createActionByOption("onSelectionChanged", {
            excludeValidators: ["disabled", "readOnly"]
        })({ addedItems: addedItems, removedItems: removedItems });
    },

    _renderButtons() {
        const $buttons = $("<div>")
            .addClass(BUTTON_GROUP_WRAPPER_CLASS)
            .appendTo(this.$element());

        const selectedItems = this.option("selectedItems");

        const options = {
            selectionMode: this.option("selectionMode"),
            items: this.option("items"),
            keyExpr: this.option("keyExpr"),
            buttonTemplate: this.option("buttonTemplate"),
            scrollingEnabled: false,
            selectedItemKeys: this.option("selectedItemKeys"),
            focusStateEnabled: this.option("focusStateEnabled"),
            hoverStateEnabled: this.option("hoverStateEnabled"),
            activeStateEnabled: this.option("activeStateEnabled"),
            stylingMode: this.option("stylingMode"),
            accessKey: this.option("accessKey"),
            tabIndex: this.option("tabIndex"),
            noDataText: "",
            selectionRequired: false,
            onItemRendered: e => {
                const width = this.option("width");
                isDefined(width) && $(e.itemElement).addClass(BUTTON_GROUP_ITEM_HAS_WIDTH);
            },
            onSelectionChanged: e => {
                this._syncSelectionOptions();
                this._fireSelectionChangeEvent(e.addedItems, e.removedItems);
            },
            onItemClick: e => {
                this._itemClickAction(e);
            }
        };

        if(isDefined(selectedItems) && selectedItems.length) {
            options.selectedItems = selectedItems;
        }
        this._buttonsCollection = this._createComponent($buttons, ButtonCollection, options);
    },

    _syncSelectionOptions() {
        this._setOptionSilent("selectedItems", this._buttonsCollection.option("selectedItems"));
        this._setOptionSilent("selectedItemKeys", this._buttonsCollection.option("selectedItemKeys"));
    },

    _optionChanged(args) {
        switch(args.name) {
            case "stylingMode":
            case "selectionMode":
            case "keyExpr":
            case "buttonTemplate":
            case "items":
            case "activeStateEnabled":
            case "focusStateEnabled":
            case "hoverStateEnabled":
            case "tabIndex":
                this._invalidate();
                break;
            case "selectedItemKeys":
            case "selectedItems":
                this._buttonsCollection.option(args.name, args.value);
                break;
            case "onItemClick":
                this._createItemClickAction();
                break;
            case "onSelectionChanged":
                break;
            case "width":
                this.callBase(args);
                this
                    ._buttonsCollection
                    .itemElements()
                    .toggleClass(BUTTON_GROUP_ITEM_HAS_WIDTH, !!args.value);
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxButtonGroup", ButtonGroup);

module.exports = ButtonGroup;
