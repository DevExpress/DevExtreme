import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import registerComponent from "../core/component_registrator";
import ButtonGroup from "./button_group";
import Popup from "./popup";
import List from "./list";
import { compileGetter } from "../core/utils/data";
import DataHelperMixin from "../data_helper";
import { DataSource } from "../data/data_source/data_source";
import ArrayStore from "../data/array_store";
import { Deferred } from "../core/utils/deferred";
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
 * @inherits Widget
 * @module ui/drop_down_button
 * @export default
 */
let DropDownButton = Widget.inherit({

    _getDefaultOptions() {
        return extend(this.callBase(), {

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

            /**
             * @name dxDropDownButtonOptions.onActionButtonClick
             * @type function(e)|string
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 selectedItem:object
             * @action
             */
            onActionButtonClick: null,

            /**
             * @name dxDropDownButtonOptions.onSelectionChanged
             * @type function(e)|string
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 oldSelectedItem:object
             * @type_function_param1_field5 selectedItem:object
             * @action
             */
            onSelectionChanged: null,

            /**
             * @name dxDropDownButtonOptions.items
             * @type Array<CollectionWidgetItem, object>
             * @default []
             */
            items: [],

            /**
             * @name dxDropDownButtonOptions.dataSource
             * @type string|Array<CollectionWidgetItem, object>|DataSource|DataSourceOptions
             * @default null
             */
            dataSource: null,

            /**
             * @name dxDropDownButtonOptions.dropDownOptions
             * @type dxPopupOptions
             * @default {}
             */
            dropDownOptions: {},

            grouped: false,
            groupTemplate: "group",
            buttonGroupOptions: {},
        });
    },

    _setOptionsByReference() {
        this.callBase();

        extend(this._optionsByReference, {
            selectedItem: true
        });
    },

    _init() {
        this.callBase();
        this._createItemClickAction();
        this._createActionClickAction();
        this._createSelectionChangedAction();
        this._compileKeyGetter();
        this._compileDisplayGetter();
        this._initDataSource();
        this._itemsToDataSource();
        this._initInnerOptionCache("buttonGroupOptions");
        this._initInnerOptionCache("dropDownOptions");
    },

    _itemsToDataSource: function() {
        if(!this.option("dataSource")) {
            this._dataSource = new DataSource({
                store: new ArrayStore(this.option("items")),
                pageSize: 0
            });
        }
    },

    _compileKeyGetter() {
        this._keyGetter = compileGetter(this.option("keyExpr"));
    },

    _compileDisplayGetter() {
        this._displayGetter = compileGetter(this.option("displayExpr"));
    },

    _initMarkup() {
        this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
        this._renderButtonGroup();
        this._loadSelectedItem().done((selectedItem) => {
            this.option("selectedItem", selectedItem);
        });
        if(!this.option("deferRendering")) {
            this._renderPopup();
        }
    },

    _loadSelectedItem() {
        const d = new Deferred();

        if(this._list) {
            return d.resolve(this._list.option("selectedItem"));
        }

        const selectedItem = this.option("selectedItem");
        const selectedItemKey = this._keyGetter(selectedItem);
        this._loadSingle(this.option("keyExpr"), selectedItemKey)
            .done(d.resolve)
            .fail(() => {
                d.resolve(selectedItem);
            });

        return d.promise();
    },

    _createActionClickAction() {
        this._actionClickAction = this._createActionByOption("onActionButtonClick");
    },

    _createSelectionChangedAction() {
        this._selectionChangedAction = this._createActionByOption("onSelectionChanged");
    },

    _createItemClickAction() {
        this._itemClickAction = this._createActionByOption("onItemClick");
    },

    _fireSelectionChangedAction({ previousValue, value }) {
        if(this._keyGetter(previousValue) !== this._keyGetter(value)) {
            this._selectionChangedAction({
                oldSelectedItem: previousValue,
                selectedItem: value
            });
        }
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
            onClick: (e) => {
                this._actionClickAction({
                    event: e.event,
                    selectedItem: this.option("selectedItem")
                });
            },
            elementAttr: { class: DROP_DOWN_BUTTON_ACTION_CLASS }
        };

        let selectedItem = this.option("selectedItem");

        if(isPlainObject(selectedItem)) {
            const displayValue = this._displayGetter(selectedItem);
            if(!isPlainObject(displayValue)) {
                selectedItem.text = String(ensureDefined(displayValue, ""));
            }
        } else {
            selectedItem = { text: String(ensureDefined(selectedItem, "")) };
        }

        return extend({}, selectedItem, defaultConfig);
    },

    _buttonGroupOptions() {
        return extend({
            items: [
                this._actionButtonConfig(),
                {
                    icon: "spindown",
                    width: 24,
                    elementAttr: { class: DROP_DOWN_BUTTON_TOGGLE_CLASS },
                    onClick: this.toggle.bind(this, undefined)
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
            contentTemplate: (content) => {
                const $content = $(content);
                $content.addClass(DROP_DOWN_BUTTON_CONTENT);
                this._list = this._createComponent($("<div>"), List, this._listOptions());
                $content.append(this._list.$element());
            }
        }, this._getInnerOptionsCache("dropDownOptions"));
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
        const $popup = $("<div>");
        this.$element().append($popup);
        this._popup = this._createComponent($popup, Popup, this._popupOptions());
        this._bindInnerWidgetOptions(this._popup, "dropDownOptions");
    },

    _renderButtonGroup() {
        let $buttonGroup = (this._buttonGroup && this._buttonGroup.$element()) || $("<div>");
        if(!this._buttonGroup) {
            this.$element().append($buttonGroup);
        }
        this._buttonGroup = this._createComponent($buttonGroup, ButtonGroup, this._buttonGroupOptions());
        this._bindInnerWidgetOptions(this._buttonGroup, "buttonGroupOptions");
    },

    /**
     * @name dxDropDownButton.toggle
     * @publicName toggle(visibility)
     * @param1 visibility:boolean
     * @return Promise<void>
     */
    toggle(visible) {
        this._popup || this._renderPopup();
        return this._popup.toggle(visible);
    },

    /**
     * @name dxDropDownButton.open
     * @publicName open()
     * @return Promise<void>
     */
    open() {
        return this.toggle(true);
    },

    /**
     * @name dxDropDownButton.close
     * @publicName close()
     * @return Promise<void>
     */
    close() {
        return this.toggle(false);
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
            case "showSelectedItem":
                break;
            case "displayExpr":
                this._compileDisplayGetter();
                break;
            case "keyExpr":
                this._compileKeyGetter();
                break;
            case "buttonGroupOptions":
                this._innerOptionChanged(this._buttonGroup, args);
                break;
            case "dropDownOptions":
                this._innerOptionChanged(this._popup, args);
                break;
            case "grouped":
            case "noDataText":
            case "groupTemplate":
                this._setListOption(name, value);
                break;
            case "selectedItem":
                this._selectItem(value);
                this._fireSelectionChangedAction(args);
                break;
            case "onItemClick":
                this._createItemClickAction();
                break;
            case "onActionButtonClick":
                this._createActionClickAction();
                break;
            case "onSelectionChanged":
                this._createSelectionChangedAction();
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
}).include(DataHelperMixin);

registerComponent("dxDropDownButton", DropDownButton);
module.exports = DropDownButton;
