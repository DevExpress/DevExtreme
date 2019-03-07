import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import registerComponent from "../core/component_registrator";
import ButtonGroup from "./button_group";
import Popup from "./popup";
import List from "./list";
import dataCoreUtils from "../core/utils/data";
import DataExpressionMixin from "./editor/ui.data_expression";
import { extend } from "../core/utils/extend";
import { isPlainObject } from "../core/utils/type";
import { ensureDefined } from "../core/utils/common";
import { format as formatMessage } from "../localization/message";

const DROP_DOWN_BUTTON_CLASS = "dx-dropdownbutton";
const DROP_DOWN_BUTTON_CONTENT = "dx-dropdownbutton-content";
const DROP_DOWN_BUTTON_ACTION_CLASS = "dx-dropdownbutton-action";
const DROP_DOWN_BUTTON_TOGGLE_CLASS = "dx-dropdownbutton-toggle";

/**
 * @name dxDropDownButton
 * @inherits Widget, DataExpressionMixin
 * @module ui/drop_down_button
 * @export default
 */

let DropDownButton = Widget.inherit({

    _getDefaultOptions() {
        return extend(this.callBase(), DataExpressionMixin._dataExpressionDefaultOptions(), {

            /**
             * @name dxDropDownButtonOptions.itemTemplate
             * @type template|function
             * @default "item"
             * @type_function_param1 itemData:object
             * @type_function_param2 itemElement:dxElement
             * @type_function_return string|Node|jQuery
             */
            itemTemplate: "item",

            /**
             * @name dxDropDownButtonOptions.keyExpr
             * @type string|function
             * @default 'this'
             * @type_function_param1 itemData:object
             */
            keyExpr: "this",

            /**
             * @name dxDropDownButtonOptions.displayExpr
             * @type string|function
             * @default 'this'
             * @type_function_param1 itemData:object
             */
            displayExpr: "this",

            /**
             * @name dxDropDownButtonOptions.selectedItem
             * @type string|object
             * @default null
             */
            selectedItem: null,

            /**
             * @name dxDropDownButtonOptions.deferRendering
             * @inheritDoc
             */
            deferRendering: true,

            /**
             * @name dxDropDownButtonOptions.noDataText
             * @type string
             * @default 'No data to display'
             */
            noDataText: formatMessage("dxCollectionWidget-noDataText"),

            /**
             * @name dxDropDownButtonOptions.showSelectedItem
             * @type boolean
             * @default true
             */
            showSelectedItem: true,

            grouped: false,
            groupTemplate: "group",
            buttonGroupOptions: {}
        });
    },

    _init() {
        this.callBase();
        this._createItemClickAction();
        this._compileKeyGetter();
        this._compileDisplayGetter();
        this._initInnerOptionCache("buttonGroupOptions");
    },

    _compileKeyGetter() {
        this._keyGetter = dataCoreUtils.compileGetter(this.option("keyExpr"));
    },

    _compileDisplayGetter() {
        this._displayGetter = dataCoreUtils.compileGetter(this.option("displayExpr"));
    },

    _initMarkup() {
        this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
        this._renderButtonGroup();
        if(!this.option("deferRendering")) {
            this._renderPopup();
        }
    },

    _createItemClickAction() {
        this._itemClickAction = this._createActionByOption("onItemClick");
    },

    _fireItemClickAction({ event, itemElement, itemData }) {
        return this._itemClickAction({
            event,
            itemElement,
            itemData: this._actionItem || itemData
        });
    },

    _actionButtonConfig() {
        const defaultConfig = {
            onClick: this._fireItemClickAction.bind(this),
            elementAttr: { class: DROP_DOWN_BUTTON_ACTION_CLASS }
        };

        let selectedItem = this.option("selectedItem");

        if(isPlainObject(selectedItem)) {
            selectedItem.text = String(ensureDefined(this._displayGetter(selectedItem), ""));
        } else {
            selectedItem = { text: String(ensureDefined(selectedItem, "")) };
        }

        return extend(selectedItem, defaultConfig);
    },

    _buttonGroupOptions() {
        return extend({
            items: [
                this._actionButtonConfig(),
                {
                    icon: "spindown",
                    width: 24,
                    elementAttr: { class: DROP_DOWN_BUTTON_TOGGLE_CLASS },
                    onClick: this.toggle.bind(this)
                }
            ],
            stylingMode: "outlined",
            selectionMode: "none"
        }, this._getInnerOptionsCache("buttonGroupOptions"));
    },

    _popupOptions() {
        return extend({
            deferRendering: this.option("deferRendering"),
            minWidth: 130,
            closeOnOutsideClick: true,
            showTitle: false,
            animation: {
                show: { type: "fade", duration: 0, from: 0, to: 1 },
                hide: { type: "fade", duration: 400, from: 1, to: 0 }
            },
            width: "auto",
            height: "auto",
            shading: false,
            position: {
                of: this._buttonGroup.element(),
                collision: "flipfit",
                my: "top right",
                at: "bottom right",
                offset: {
                    y: -1
                }
            },
            arrowPosition: "end",
            contentTemplate: (content) => {
                const $content = $(content);
                $content.addClass(DROP_DOWN_BUTTON_CONTENT);
                this._list = this._createComponent($("<div>"), List, this._listOptions());
                $content.append(this._list.$element());
            }
        }, this.option("dropDownOptions"));
    },

    _listOptions() {
        return {
            selectionMode: "single",
            selectedItemKeys: [this._keyGetter(this.option("selectedItem"))],
            grouped: this.option("grouped"),
            keyExpr: this.option("keyExpr"),
            noDataText: this.option("noDataText"),
            displayExpr: this.option("displayExpr"),
            itemTemplate: this.option("itemTemplate"),
            tabIndex: null,
            items: this.option("items"),
            dataSource: this.option("dataSource"),
            onItemClick: (e) => {
                this.option("selectedItem", e.itemData);
                const actionResult = this._fireItemClickAction(e);
                if(actionResult !== false) {
                    this.toggle(false);
                }
            }
        };
    },

    _renderPopup() {
        this._popup = this._createComponent($("<div>"), Popup, this._popupOptions());
        this.$element().append(this._popup.$element());
    },

    _renderButtonGroup() {
        let $buttonGroup = (this._buttonGroup && this._buttonGroup.$element()) || $("<div>");
        if(!this._buttonGroup) {
            this.$element().append($buttonGroup);
        }
        this._buttonGroup = this._createComponent($buttonGroup, ButtonGroup, this._buttonGroupOptions());
        this._bindInnerWidgetOptions(this._buttonGroup, "buttonGroupOptions");
    },

    toggle(visible) {
        this._popup || this._renderPopup();
        this._popup.toggle(visible);
    },

    _setListOption(name, value) {
        this._list && this._list.option(name, value);
    },

    _selectItem(itemData) {
        this._setListOption("selectedItemKeys", [this._keyGetter(itemData)]);
        if(this.option("showSelectedItem")) {
            this._buttonGroup.option("items[0]", this._actionButtonConfig());
        }
    },

    _clean() {
        this._list && this._list.$element().remove();
        this._popup && this._popup.$element().remove();
    },

    _optionChanged(args) {
        const { name, value } = args;
        switch(args.name) {
            case "items":
            case "dataSource":
            case "itemTemplate":
            case "showEvent":
            case "showSelectedItem":
                break;
            case "displayExpr":
                this._compileDisplayGetter();
                break;
            case "keyExpr":
                this._compileKeyGetter();
                break;
            case "buttonGroupOptions":
                this._buttonGroup.option(value);
                this._cacheInnerOptions("buttonGroupOptions", value);
                break;
            case "grouped":
            case "noDataText":
            case "groupTemplate":
                this._setListOption(name, value);
                break;
            case "selectedItem":
                this._selectItem(value);
                break;
            case "onItemClick":
                this._createItemClickAction();
                break;
            case "deferRendering":
                if(!value && !this._popup) {
                    this._renderPopup();
                }
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxDropDownButton", DropDownButton);
module.exports = DropDownButton;
