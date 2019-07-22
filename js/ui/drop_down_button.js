import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import FunctionTemplate from "./widget/function_template";
import registerComponent from "../core/component_registrator";
import ButtonGroup from "./button_group";
import Popup from "./popup";
import List from "./list";
import { compileGetter } from "../core/utils/data";
import domUtils from "../core/utils/dom";
import { getImageContainer } from "../core/utils/icon";
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
const DX_BUTTON_CONTENT_CLASS = "dx-button-content";
const DX_ICON_RIGHT_CLASS = "dx-icon-right";

/**
 * @name dxDropDownButton
 * @inherits Widget, DataHelperMixin
 * @module ui/drop_down_button
 * @export default
 */
let DropDownButton = Widget.inherit({

    _getDefaultOptions() {
        return extend(this.callBase(), {

            /**
             * @name dxDropDownButtonItem
             * @inherits dxListItem
             * @type object
             */
            /**
             * @name dxDropDownButtonItem.key
             * @hidden
             */
            /**
             * @name dxDropDownButtonItem.showChevron
             * @hidden
             */

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

            /**
             * @name dxDropDownButtonOptions.keyExpr
             * @type string
             * @default 'this'
             */
            keyExpr: "this",

            /**
             * @name dxDropDownButtonOptions.displayExpr
             * @type string|function
             * @default 'this'
             * @type_function_param1 itemData:object
             * @type_function_return string
             */
            displayExpr: "this",

            /**
             * @name dxDropDownButtonOptions.selectedItem
             * @type string|integer|object
             * @default null
             * @readonly
             */
            selectedItem: null,

            /**
             * @name dxDropDownButtonOptions.selectedItemKey
             * @type string|integer
             * @default null
             */
            selectedItemKey: null,

            /**
             * @name dxDropDownButtonOptions.stylingMode
             * @type Enums.ButtonStylingMode
             * @default 'outlined'
             */
            stylingMode: "outlined",

            /**
             * @name dxDropDownButtonOptions.deferRendering
             * @type boolean
             * @default true
             */
            deferRendering: true,

            /**
             * @name dxDropDownButtonOptions.noDataText
             * @type string
             * @default 'No data to display'
             */
            noDataText: formatMessage("dxCollectionWidget-noDataText"),

            /**
             * @name dxDropDownButtonOptions.useSelectMode
             * @type boolean
             * @default false
             */
            useSelectMode: false,

            /**
             * @name dxDropDownButtonOptions.splitButton
             * @type boolean
             * @default false
             */
            splitButton: false,

            /**
             * @name dxDropDownButtonOptions.showArrowIcon
             * @type boolean
             * @default true
             */
            showArrowIcon: true,

            /**
             * @name dxDropDownButtonOptions.text
             * @type string
             * @default ""
             */
            text: "",

            /**
             * @name dxDropDownButtonOptions.icon
             * @type string
             * @default undefined
             */
            icon: undefined,

            /**
             * @name dxDropDownButtonOptions.onButtonClick
             * @type function(e)|string
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 selectedItem:object
             * @action
             */
            onButtonClick: null,

            /**
             * @name dxDropDownButtonOptions.onSelectionChanged
             * @type function(e)|string
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 item:object
             * @type_function_param1_field5 previousItem:object
             * @action
             */
            onSelectionChanged: null,

            /**
             * @name dxDropDownButtonOptions.onItemClick
             * @type function(e)|string
             * @extends Action
             * @type_function_param1 e:object
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 itemData:object
             * @type_function_param1_field6 itemElement:dxElement
             * @action
             */
            onItemClick: null,

            /**
             * @name dxDropDownButtonOptions.opened
             * @type boolean
             * @default false
             */
            opened: false,

            /**
             * @name dxDropDownButtonOptions.items
             * @type Array<dxDropDownButtonItem, object>
             * @default null
             */
            items: null,

            /**
             * @name dxDropDownButtonOptions.dataSource
             * @type string|Array<CollectionWidgetItem, object>|DataSource|DataSourceOptions
             * @default null
             */
            dataSource: null,

            /**
             * @name dxDropDownButtonOptions.focusStateEnabled
             * @type boolean
             * @default true
             */
            focusStateEnabled: true,

            /**
             * @name dxDropDownButtonOptions.hoverStateEnabled
             * @type boolean
             * @default true
             */
            hoverStateEnabled: true,

            /**
             * @name dxDropDownButtonOptions.dropDownOptions
             * @type dxPopupOptions
             * @default {}
             */
            dropDownOptions: {},

            /**
             * @name dxDropDownButtonOptions.dropDownContentTemplate
             * @type template|function
             * @default "content"
             * @type_function_param1 data:Array<string,number,Object>|DataSource
             * @type_function_param2 contentElement:dxElement
             * @type_function_return string|Node|jQuery
             */
            dropDownContentTemplate: "content",

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

    _initTemplates() {
        this.callBase();
        this._defaultTemplates["content"] = new FunctionTemplate((options) => {
            const $popupContent = $(options.container);
            const $listContainer = $("<div>").appendTo($popupContent);
            this._list = this._createComponent($listContainer, List, this._listOptions());

            this._list.registerKeyHandler("escape", this._escHandler.bind(this));
            this._list.registerKeyHandler("tab", this._escHandler.bind(this));
            this._list.registerKeyHandler("leftArrow", this._escHandler.bind(this));
            this._list.registerKeyHandler("rightArrow", this._escHandler.bind(this));
        });
    },

    _itemsToDataSource: function() {
        if(!this._dataSource) {
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
        this.callBase();
        this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
        this._renderButtonGroup();
        this._loadSelectedItem().done(this._updateActionButton.bind(this));
        if(!this.option("deferRendering") || this.option("opened")) {
            this._renderPopup();
        }
    },

    _loadSelectedItem() {
        const d = new Deferred();

        if(this._list) {
            return d.resolve(this._list.option("selectedItem"));
        }

        const selectedItemKey = this.option("selectedItemKey");
        this._loadSingle(this.option("keyExpr"), selectedItemKey)
            .done(d.resolve)
            .fail(() => {
                d.resolve(this.option("selectedItem"));
            });

        return d.promise();
    },

    _createActionClickAction() {
        this._actionClickAction = this._createActionByOption("onButtonClick");
    },

    _createSelectionChangedAction() {
        this._selectionChangedAction = this._createActionByOption("onSelectionChanged");
    },

    _createItemClickAction() {
        this._itemClickAction = this._createActionByOption("onItemClick");
    },

    _fireSelectionChangedAction({ previousValue, value }) {
        this._selectionChangedAction({
            item: value,
            previousItem: previousValue
        });
    },

    _fireItemClickAction({ event, itemElement, itemData }) {
        return this._itemClickAction({
            event,
            itemElement,
            itemData: this._actionItem || itemData
        });
    },

    _actionButtonConfig() {
        return {
            text: this.option("text"),
            icon: this.option("icon"),
            elementAttr: { class: DROP_DOWN_BUTTON_ACTION_CLASS }
        };
    },

    _getButtonGroupItems() {
        const items = [];
        items.push(this._actionButtonConfig());
        if(this.option("splitButton")) {
            items.push({
                icon: "spindown",
                width: 26,
                elementAttr: { class: DROP_DOWN_BUTTON_TOGGLE_CLASS }
            });
        }
        return items;
    },

    _buttonGroupItemClick({ event, itemData }) {
        const isActionButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_ACTION_CLASS;
        const isToggleButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_TOGGLE_CLASS;

        if(isToggleButton) {
            this.toggle();
        } else if(isActionButton) {
            this._actionClickAction({
                event,
                selectedItem: this.option("selectedItem")
            });

            if(!this.option("splitButton")) {
                this.toggle();
            }
        }
    },

    _buttonGroupOptions() {
        return extend({
            items: this._getButtonGroupItems(),
            focusStateEnabled: this.option("focusStateEnabled"),
            hoverStateEnabled: this.option("hoverStateEnabled"),
            onItemClick: this._buttonGroupItemClick.bind(this),
            width: this.option("width"),
            height: this.option("height"),
            stylingMode: this.option("stylingMode"),
            selectionMode: "none"
        }, this._getInnerOptionsCache("buttonGroupOptions"));
    },

    _renderPopupContent() {
        const $content = this._popup.$content();
        const template = this._getTemplateByOption("dropDownContentTemplate");

        $content.empty();

        return template.render({
            container: domUtils.getPublicElement($content),
            model: this.option("items") || this._dataSource
        });
    },

    _popupOptions() {
        return extend({
            dragEnabled: false,
            focusStateEnabled: false,
            deferRendering: this.option("deferRendering"),
            minWidth: () => {
                return this.$element().outerWidth();
            },
            closeOnOutsideClick: (e) => {
                const $element = this.$element();
                const $buttonClicked = $(e.target).closest(`.${DROP_DOWN_BUTTON_CLASS}`);
                return !$buttonClicked.is($element);
            },
            showTitle: false,
            animation: {
                show: { type: "fade", duration: 0, from: 0, to: 1 },
                hide: { type: "fade", duration: 400, from: 1, to: 0 }
            },
            width: "auto",
            height: "auto",
            shading: false,
            visible: this.option("opened"),
            position: {
                of: this.$element(),
                collision: "flipfit",
                my: "top left",
                at: "bottom left",
                offset: {
                    y: -1
                }
            }
        }, this._getInnerOptionsCache("dropDownOptions"));
    },

    _listOptions() {
        const selectedItemKey = this.option("selectedItemKey");
        return {
            selectionMode: "single",
            focusStateEnabled: this.option("focusStateEnabled"),
            hoverStateEnabled: this.option("hoverStateEnabled"),
            selectedItemKeys: selectedItemKey ? [selectedItemKey] : [],
            grouped: this.option("grouped"),
            keyExpr: this.option("keyExpr"),
            noDataText: this.option("noDataText"),
            displayExpr: this.option("displayExpr"),
            itemTemplate: this.option("itemTemplate"),
            items: this.option("items"),
            dataSource: this._dataSource,
            onItemClick: (e) => {
                this.option("selectedItemKey", this._keyGetter(e.itemData));
                const actionResult = this._fireItemClickAction(e);
                if(actionResult !== false) {
                    this.toggle(false);
                    this._buttonGroup.focus();
                }
            }
        };
    },

    _upDownKeyHandler() {
        if(this._popup && this._popup.option("visible") && this._list) {
            this._list.focus();
        } else {
            this.open();
        }
    },

    _escHandler() {
        this.close();
        this._buttonGroup.focus();
    },

    _renderPopup() {
        const $popup = $("<div>");
        this.$element().append($popup);
        this._popup = this._createComponent($popup, Popup, this._popupOptions());
        this._popup.$content().addClass(DROP_DOWN_BUTTON_CONTENT);
        this._popup.on("hiding", this._popupHidingHandler.bind(this));
        this._popup.on("showing", this._popupShowingHandler.bind(this));
        this._renderPopupContent();
        this._bindInnerWidgetOptions(this._popup, "dropDownOptions");
    },

    _popupHidingHandler() {
        this.option("opened", false);
    },

    _popupShowingHandler() {
        this.option("opened", true);
    },

    _renderAdditionalIcon() {
        if(this.option("splitButton") || !this.option("showArrowIcon")) {
            return;
        }

        const $firstButtonContent = this._buttonGroup.$element().find(`.${DX_BUTTON_CONTENT_CLASS}`).eq(0);
        const $iconElement = getImageContainer("spindown");

        $iconElement
            .addClass(DX_ICON_RIGHT_CLASS)
            .appendTo($firstButtonContent);
    },

    _renderButtonGroup() {
        let $buttonGroup = (this._buttonGroup && this._buttonGroup.$element()) || $("<div>");
        if(!this._buttonGroup) {
            this.$element().append($buttonGroup);
        }

        this._buttonGroup = this._createComponent($buttonGroup, ButtonGroup, this._buttonGroupOptions());

        this._buttonGroup.registerKeyHandler("downArrow", this._upDownKeyHandler.bind(this));
        this._buttonGroup.registerKeyHandler("tab", this.close.bind(this));
        this._buttonGroup.registerKeyHandler("upArrow", this._upDownKeyHandler.bind(this));
        this._buttonGroup.registerKeyHandler("escape", this._escHandler.bind(this));

        this._renderAdditionalIcon();

        this._bindInnerWidgetOptions(this._buttonGroup, "buttonGroupOptions");
    },

    /**
     * @name dxDropDownButton.toggle
     * @publicName toggle()
     * @return Promise<void>
     */
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

    _getDisplayValue(item) {
        const isPrimitiveItem = !isPlainObject(item);
        const displayValue = isPrimitiveItem ? item : this._displayGetter(item);
        return !isPlainObject(displayValue) ? String(ensureDefined(displayValue, "")) : "";
    },

    _updateActionButton(selectedItem) {
        if(this.option("useSelectMode")) {
            this.option({
                text: this._getDisplayValue(selectedItem),
                icon: isPlainObject(selectedItem) ? selectedItem.icon : undefined
            });
        }

        this._setOptionSilent("selectedItem", selectedItem);
    },

    _clean() {
        this._list && this._list.$element().remove();
        this._popup && this._popup.$element().remove();
    },

    _selectedItemKeyChanged(value) {
        this._setListOption("selectedItemKeys", value ? [value] : []);
        const previousItem = this.option("selectedItem");
        this._loadSelectedItem().done((selectedItem) => {
            this._updateActionButton(selectedItem);

            if(this._displayGetter(previousItem) !== this._displayGetter(selectedItem)) {
                this._fireSelectionChangedAction({
                    previousValue: previousItem,
                    value: selectedItem
                });
            }
        });
    },

    _optionChanged(args) {
        const { name, value } = args;
        switch(args.name) {
            case "useSelectMode":
                break;
            case "splitButton":
                this._renderButtonGroup();
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
            case "opened":
                this.toggle(value);
                break;
            case "focusStateEnabled":
            case "hoverStateEnabled":
                this._setListOption(name, value);
                this._buttonGroup.option(name, value);
                break;
            case "items":
                this._dataSource = null;
                this._itemsToDataSource();
                this._setListOption(name, value);
                this._setListOption("selectedItemKeys", []);
                this._loadSelectedItem().done(this._updateActionButton.bind(this));
                break;
            case "dataSource":
                this._initDataSource();
                this._setListOption(name, value);
                this._setListOption("selectedItemKeys", []);
                this._loadSelectedItem().done(this._updateActionButton.bind(this));
                break;
            case "icon":
                this._buttonGroup.option("items[0]", extend({}, this._actionButtonConfig(), {
                    icon: value
                }));
                this._renderAdditionalIcon();
                break;
            case "text":
                this._buttonGroup.option("items[0]", extend({}, this._actionButtonConfig(), {
                    text: value
                }));
                this._renderAdditionalIcon();
                break;
            case "showArrowIcon":
                if(!value) {
                    this._buttonGroup.$element().find(`.${DX_ICON_RIGHT_CLASS}`).remove();
                }
                this._renderAdditionalIcon();
                break;
            case "stylingMode":
            case "width":
            case "height":
                this._buttonGroup.option(name, value);
                break;
            case "itemTemplate":
            case "grouped":
            case "noDataText":
            case "groupTemplate":
                this._setListOption(name, value);
                break;
            case "dropDownContentTemplate":
                this._popup && this._renderPopupContent();
                break;
            case "selectedItemKey":
                this._selectedItemKeyChanged(value);
                break;
            case "selectedItem":
                break;
            case "onItemClick":
                this._createItemClickAction();
                break;
            case "onButtonClick":
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
