import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import registerComponent from "../core/component_registrator";
import ButtonGroup from "./button_group";
import Popup from "./popup";
import List from "./list";
import DataExpressionMixin from "./editor/ui.data_expression";
import { extend } from "../core/utils/extend";
import { Deferred } from "../core/utils/deferred";
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
            deferRendering: true,
            showEvent: "click",
            showSelectedItem: true,
            grouped: false,
            noDataText: formatMessage("dxCollectionWidget-noDataText"),

            /**
             * @name dxDropDownButtonOptions.itemTemplate
             * @type template|function
             * @default "item"
             * @type_function_param1 itemData:object
             * @type_function_param2 itemIndex:number
             * @type_function_param3 itemElement:dxElement
             * @type_function_return string|Node|jQuery
             */
            itemTemplate: "item",
            groupTemplate: "group",
            displayExpr: undefined,
            valueExpr: "this"
        });
    },

    _init() {
        this.callBase();
        this._initDataExpressions();
        this._createItemClickAction();
    },

    _initMarkup() {
        this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
        this._renderButtonGroup();
        if(!this.option("deferRendering")) {
            this._renderPopup();
        }
        this._renderValue();
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

    _buttonGroupOptions() {
        return extend(true, {
            items: [
                {
                    icon: "default",
                    onClick: this._fireItemClickAction.bind(this),
                    elementAttr: { class: DROP_DOWN_BUTTON_ACTION_CLASS }
                },
                {
                    icon: "spindown",
                    width: 24,
                    elementAttr: { class: DROP_DOWN_BUTTON_TOGGLE_CLASS },
                    onClick: this.toggle.bind(this)
                }
            ],
            stylingMode: "outlined",
            selectionMode: "none"
        }, this.option("buttonGroupOptions"));
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
            selectedItemKeys: [this.option("value")],
            grouped: this.option("grouped"),
            keyExpr: this._getCollectionKeyExpr(),
            noDataText: this.option("noDataText"),
            displayExpr: this.option("displayExpr"),
            itemTemplate: this.option("itemTemplate"),
            tabIndex: null,
            dataSource: this._dataSource,
            onItemClick: (e) => {
                this.option("value", this._valueGetter(e.itemData));
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

    },

    _renderValue(value = this.option("value")) {
        this._loadItemByKey(value)
            .done((itemData) => {
                this._actionItem = itemData;
                if(this.option("showSelectedItem")) {
                    this._setActionButton(itemData);
                }
            })
            .fail(() => {
                this._actionItem = value;
                if(this.option("showSelectedItem")) {
                    this._setActionButton(value);
                }
            });
    },

    _loadItemByKey(key) {
        if(isPlainObject(key)) {
            return new Deferred().resolve(key).promise();
        }

        if(this._list) {
            this._setListOption("selectedItemKeys", [key]);
            return new Deferred().resolve(this._list.option("selectedItem")).promise();
        } else {
            return this._loadValue(key);
        }
    },

    _setActionButton(itemData) {
        const displayedValue = String(ensureDefined(this._displayGetter(itemData), ""));

        this._buttonGroup.option("items[0].text", displayedValue);
        this._buttonGroup.option("items[0].icon", itemData && itemData.icon);
    },

    toggle(visible) {
        this._popup || this._renderPopup();
        this._popup.toggle(visible);
    },

    _setListOption(name, value) {
        this._list && this._list.option(name, value);
    },

    _setCollectionWidgetOption() {
        this._setListOption.apply(this, arguments);
    },

    _clean() {
        this._list && this._list.$element().remove();
        this._popup && this._popup.$element().remove();
    },

    _optionChanged(args) {
        const { name, value } = args;
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case "items":
            case "dataSource":
            case "valueExpr":
            case "displayExpr":
            case "itemTemplate":
            case "showEvent":
            case "showSelectedItem":
                break;
            case "grouped":
            case "noDataText":
            case "groupTemplate":
                this._setListOption(name, value);
                break;
            case "onItemClick":
                this._createItemClickAction();
                break;
            case "deferRendering":
                if(!value && !this._popup) {
                    this._renderPopup();
                }
                break;
            case "value":
                this._renderValue(value);
                break;
            default:
                this.callBase(args);
        }
    }
}).include(DataExpressionMixin);

registerComponent("dxDropDownButton", DropDownButton);
module.exports = DropDownButton;
