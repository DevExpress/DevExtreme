import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import Button from "./button";
import CollectionWidget from "./collection/ui.collection_widget.edit";
import registerComponent from "../core/component_registrator";
import { extend } from "../core/utils/extend";
import BindableTemplate from "./widget/bindable_template";
import { isPlainObject } from "../core/utils/type";

const BUTTON_GROUP_CLASS = "dx-buttongroup",
    BUTTON_GROUP_WRAPPER_CLASS = "dx-buttongroup-wrapper",
    BUTTON_GROUP_ITEM_CLASS = "dx-buttongroup-item";

var ButtonCollection = CollectionWidget.inherit({
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
             * @name dxButtonGroupOptions.buttonType
             * @type Enums.ButtonType
             * @default 'normal'
             */
            buttonType: "normal",

            /**
             * @name dxButtonGroupOptions.hoverStateEnabled
             * @type boolean
             * @default false
             */
            hoverStateEnabled: true,

            /**
             * @name dxButtonGroupOptions.focusStateEnabled
             * @type boolean
             * @default true
             * @inheritdoc
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
             * @name dxButtonGroupOptions.keyExpr
             * @type string|function
             * @default 'text'
             */
            keyExpr: "text",

            /**
             * @name dxButtonGroupOptions.items
             * @type Array<any>
             */
            items: [],

            /**
             * @name dxButtonGroupOptions.itemTemplate
             * @type template|function
             * @default "item"
             * @type_function_param1 itemData:object
             * @type_function_param2 itemIndex:number
             * @type_function_param3 itemElement:dxElement
             * @type_function_return string|Node|jQuery
             */
            itemTemplate: "item",

            /**
             * @name dxButtonGroupOptions.onSelectionChanged
             * @extends Action
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 addedItems:array<any>
             * @type_function_param1_field5 removedItems:array<any>
             * @action
             */
            onSelectionChanged: null
        });
    },

    _initTemplates() {
        this.callBase();

        this._defaultTemplates["item"] = new BindableTemplate((($container, data) => {
            const buttonOptions = !isPlainObject(data) ? { text: String(data) } : data;
            this._createComponent($container, Button, extend({}, buttonOptions, this._getBasicButtonOptions()));
        }), ["text", "type", "icon"], this.option("integrationOptions.watchMethod"));
    },

    _initMarkup() {
        this.setAria("role", "buttongroup");
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

    _getBasicButtonOptions() {
        return {
            type: this.option("buttonType"),
            focusStateEnabled: false,
            hoverStateEnabled: this.option("hoverStateEnabled"),
            activeStateEnabled: this.option("activeStateEnabled")
        };
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
            itemTemplate: this._getTemplateByOption("itemTemplate"),
            scrollingEnabled: false,
            selectedItemKeys: this.option("selectedItemKeys"),
            focusStateEnabled: this.option("focusStateEnabled"),
            accessKey: this.option("accessKey"),
            tabIndex: this.option("tabIndex"),
            noDataText: "",
            selectionRequired: this.option("selectionMode") === "single",
            onSelectionChanged: (e) => {
                this._syncSelectionOptions();
                this._fireSelectionChangeEvent(e.addedItems, e.removedItems);
            }
        };

        if(selectedItems.length) {
            options.selectedItems = selectedItems;
        }
        this._buttonsCollection = this._createComponent($buttons, ButtonCollection, options);
    },

    _syncSelectionOptions() {
        this._setOptionSilent("selectedItems", this._buttonsCollection.option("selectedItems"));
        this._setOptionSilent("selectedItemKeys", this._buttonsCollection.option("selectedItemKeys"));
    },

    _setOptionSilent: function(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false;
    },

    _optionChanged(args) {
        if(this._cancelOptionChange === args.name) {
            return;
        }

        switch(args.name) {
            case "buttonType":
            case "selectionMode":
            case "keyExpr":
            case "itemTemplate":
            case "items":
            case "activeStateEnabled":
            case "focusStateEnabled":
            case "hoverStateEnabled":
            case "onSelectionChanged":
            case "tabIndex":
                this._invalidate();
                break;
            case "selectedItemKeys":
            case "selectedItems":
                this._buttonsCollection.option(args.name, args.value);
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxButtonGroup", ButtonGroup);

module.exports = ButtonGroup;
