import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import registerComponent from "../core/component_registrator";
import ButtonGroup from "./button_group";
import Popup from "./popup";
import List from "./list";
import DataExpressionMixin from "./editor/ui.data_expression";
import { extend } from "../core/utils/extend";
import messageLocalization from "../localization/message";

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
            noDataText: messageLocalization.format("dxCollectionWidget-noDataText"),
            itemTemplate: "item",
            groupTemplate: "group",
            displayExpr: undefined,
            valueExpr: "this"
        });
    },

    _init() {
        this.callBase();
        this._initDataExpressions();
    },

    _initMarkup() {
        this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
        this._renderButtonGroup();
        if(!this.option("deferRendering")) {
            this._renderPopup();
        }
    },

    _buttonGroupOptions() {
        return extend(true, {
            items: [
                {
                    icon: "default",
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

    _getListSelectionMode() {
        return this.option("showSelectedItem") ? "single" : "none";
    },

    _listOptions() {
        return {
            selectionMode: this._getListSelectionMode(),
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
                this.toggle(false);
            }
        };
    },

    _renderPopup() {
        this._popup = this._createComponent($("<div>"), Popup, this._popupOptions());
        this.$element().append(this._popup.$element());
    },

    _renderButtonGroup() {
        this._buttonGroup && this._buttonGroup.$element().remove();
        this._buttonGroup = this._createComponent($("<div>"), ButtonGroup, this._buttonGroupOptions());
        this.$element().append(this._buttonGroup.$element());
    },

    _getItemByKey(key) {
        return this._dataSource.store().byKey(key);
    },

    _setActionButton(key) {
        const actionButtonIndex = this.option("actionButtonIndex");
        this._getItemByKey(key).done((itemData) => {
            let optionObject = {};
            optionObject["items[" + actionButtonIndex + "].text"] = this._displayGetter(itemData);
            optionObject["items[" + actionButtonIndex + "].icon"] = itemData.icon;

            this._buttonGroup.option(optionObject);
        });
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
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case "items":
            case "dataSource":
            case "valueExpr":
            case "displayExpr":
            case "itemTemplate":
            case "showEvent":
            case "actionButtonIndex":
                break;
            case "grouped":
            case "noDataText":
            case "groupTemplate":
                this._setListOption(args.name, args.value);
                break;
            case "showSelectedItem":
                this._setListOption("selectionMode", this._getListSelectionMode());
                break;
            case "deferRendering":
                if(!args.value && !this._popup) {
                    this._renderPopup();
                }
                break;
            case "value":
                this._setListOption("selectedItemKeys", [args.value]);
                this.option("showSelectedItem") && this._setActionButton(args.value);
                break;
            default:
                this.callBase(args);
        }
    }
}).include(DataExpressionMixin);

registerComponent("dxDropDownButton", DropDownButton);
module.exports = DropDownButton;
