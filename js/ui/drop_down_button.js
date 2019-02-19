import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import registerComponent from "../core/component_registrator";
import ButtonGroup from "./button_group";
import Popover from "./popover";
import List from "./list";
import DataExpressionMixin from "./editor/ui.data_expression";
import { extend } from "../core/utils/extend";
import messageLocalization from "../localization/message";

const DROP_DOWN_BUTTON_CLASS = "dx-dropdown-button";
const DROP_DOWN_BUTTON_CONTENT = "dx-dropdown-button-content";

let DropDownButton = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), DataExpressionMixin._dataExpressionDefaultOptions(), {
            deferRendering: true,
            showEvent: "click",
            actionButtonIndex: 0,
            showSelectedItem: true,
            grouped: false,
            noDataText: messageLocalization.format("dxCollectionWidget-noDataText"),
            itemTemplate: "item",
            groupTemplate: "group",
            displayExpr: "this",
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
        return extend({
            items: [
                { icon: "default" },
                {
                    icon: "chevrondown",
                    onClick: () => {
                        this.toggle();
                    }
                }
            ],
            stylingMode: "outlined",
            selectionMode: "none"
        }, this.option("buttonGroupOptions"));
    },

    _popupOptions() {
        return extend({
            deferRendering: this.option("deferRendering"),
            target: this._buttonGroup.element(),
            minWidth: 130,
            closeOnOutsideClick: true,
            position: {
                collision: "flipfit",
                my: "top right",
                at: "bottom right"
            },
            arrowPosition: "end",
            contentTemplate: (content) => {
                $(content).addClass(DROP_DOWN_BUTTON_CONTENT);
                this._list && this._list.$element().remove();
                this._list = this._createComponent($("<div>"), List, this._listOptions());
                $(content).append(this._list.$element());
            }
        }, this.option("dropDownOptions"));
    },

    _listOptions() {
        return {
            selectionMode: this.option("showSelectedItem") ? "single" : "none",
            selectedItemKeys: [this.option("value")],
            grouped: this.option("grouped"),
            keyExpr: this._getCollectionKeyExpr(),
            noDataText: this.option("noDataText"),
            itemTemplate: this._getTemplateByOption("itemTemplate"),
            tabIndex: null,
            dataSource: this._dataSource,
            onItemClick: (e) => {
                this.option("value", this._valueGetter(e.itemData));
                this.toggle(false);
            }
        };
    },

    _renderPopup() {
        this._popup && this._popup.$element().remove();
        this._popup = this._createComponent($("<div>"), Popover, this._popupOptions());
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

    _optionChanged: function(args) {
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case "value":
                this._setListOption("selectedItemKeys", args.value);
                this.option("showSelectedItem") && this._setActionButton(args.value);
                break;
            default:
                this.callBase(args);
        }
    }
}).include(DataExpressionMixin);

registerComponent("dxDropDownButton", DropDownButton);
module.exports = DropDownButton;
