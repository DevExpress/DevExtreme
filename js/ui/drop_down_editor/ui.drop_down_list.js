"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    DropDownEditor = require("./ui.drop_down_editor"),
    List = require("../list"),
    errors = require("../widget/ui.errors"),
    eventUtils = require("../../events/utils"),
    devices = require("../../core/devices"),
    DataExpressionMixin = require("../editor/ui.data_expression"),
    messageLocalization = require("../../localization/message"),
    themes = require("../themes"),
    ChildDefaultTemplate = require("../widget/child_default_template"),
    Deferred = require("../../core/utils/deferred").Deferred;

var LIST_ITEM_SELECTOR = ".dx-list-item",
    LIST_ITEM_DATA_KEY = "dxListItemData",
    DROPDOWNLIST_POPUP_WRAPPER_CLASS = "dx-dropdownlist-popup-wrapper",

    SKIP_GESTURE_EVENT_CLASS = "dx-skip-gesture-event",

    SEARCH_MODES = ["startswith", "contains", "endwith", "notcontains"];

/**
* @name dxDropDownList
* @publicName dxDropDownList
* @inherits DataExpressionMixin, dxDropDownEditor
* @module ui/drop_down_editor/ui.drop_down_list
* @export default
* @hidden
*/
var DropDownList = DropDownEditor.inherit({

    _supportedKeys: function() {
        var parent = this.callBase();

        return extend({}, parent, {
            tab: function() {
                if(this.option("opened") && this.option("applyValueMode") === "instantly") {
                    var $focusedItem = $(this._list.option("focusedElement"));
                    $focusedItem.length && this._setSelectedElement($focusedItem);
                } else {
                    eventsEngine.trigger(this._focusTarget(), "focusout");
                }

                parent.tab.apply(this, arguments);
            },
            space: commonUtils.noop,
            home: commonUtils.noop,
            end: commonUtils.noop
        });
    },

    _setSelectedElement: function($element) {
        var value = this._valueGetter(this._list._getItemData($element));
        this._setValue(value);
    },

    _setValue: function(value) {
        this.option("value", value);
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
            * @name dxDropDownListOptions_pagingEnabled
            * @publicName pagingEnabled
            * @deprecated DataSourceOptions_paginate
            */
            "pagingEnabled": { since: "15.1", message: "Use the 'dataSource.paginate' option instead" }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), extend(DataExpressionMixin._dataExpressionDefaultOptions(), {
            /**
            * @name dxDropDownListOptions_displayValue
            * @publicName displayValue
            * @type string
            * @default undefined
            * @ref
            */
            displayValue: undefined,

            /**
            * @name dxDropDownListOptions_searchEnabled
            * @publicName searchEnabled
            * @type boolean
            * @default false
            */
            searchEnabled: false,

            /**
            * @name dxDropDownListOptions_searchMode
            * @publicName searchMode
            * @type string
            * @default "contains"
            * @acceptValues "contains"|"startswith"
            */
            searchMode: "contains",

            /**
            * @name dxDropDownListOptions_searchTimeout
            * @publicName searchTimeout
            * @type number
            * @default 500
            */
            searchTimeout: 500,

            /**
            * @name dxDropDownListOptions_minSearchLength
            * @publicName minSearchLength
            * @type number
            * @default 0
            */
            minSearchLength: 0,

            /**
            * @name dxDropDownListOptions_searchExpr
            * @publicName searchExpr
            * @type getter|Array<getter>
            * @default null
            */
            searchExpr: null,

            /**
            * @name dxDropDownListOptions_valueChangeEvent
            * @publicName valueChangeEvent
            * @type string
            * @default "input change keyup"
            */
            valueChangeEvent: "input change keyup",

            /**
            * @name dxDropDownListOptions_selectedItem
            * @publicName selectedItem
            * @type any
            * @readonly
            * @default null
            * @ref
            */
            selectedItem: null,

            /**
            * @name dxDropDownListOptions_pagingEnabled
            * @publicName pagingEnabled
            * @type boolean
            * @default undefined
            */
            pagingEnabled: undefined,

            /**
            * @name dxDropDownListOptions_noDataText
            * @publicName noDataText
            * @type string
            * @default "No data to display"
            */
            noDataText: messageLocalization.format("dxCollectionWidget-noDataText"),

            /**
            * @name dxDropDownListOptions_onSelectionChanged
            * @publicName onSelectionChanged
            * @extends Action
            * @type_function_param1_field4 selectedItem:object
            * @action
            */
            onSelectionChanged: null,

            /**
            * @name dxDropDownListOptions_onItemClick
            * @publicName onItemClick
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:object
            * @type_function_param1_field6 itemIndex:number | object
            * @action
            */
            onItemClick: commonUtils.noop,

            /**
            * @name dxDropDownListOptions_showDataBeforeSearch
            * @publicName showDataBeforeSearch
            * @type boolean
            * @default false
            */
            showDataBeforeSearch: false,

            /**
            * @name dxDropDownListOptions_grouped
            * @publicName grouped
            * @type boolean
            * @default false
            */
            grouped: false,

            /**
            * @name dxDropDownListOptions_groupTemplate
            * @publicName groupTemplate
            * @type template
            * @default "group"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:Element
            * @type_function_return string|Node|jQuery
            */
            groupTemplate: "group",

            popupPosition: {
                my: "left top",
                at: "left bottom",
                offset: { h: 0, v: 0 },
                collision: "flip"
            },

            /**
            * @name dxDropDownListOptions_onValueChanged
            * @publicName onValueChanged
            * @extends Action
            * @type_function_param1_field4 value:object
            * @type_function_param1_field5 previousValue:object
            * @type_function_param1_field6 jQueryEvent:jQueryEvent
            * @action
            */

            /**
            * @name dxDropDownListOptions_onContentReady
            * @publicName onContentReady
            * @extends Action
            * @hidden false
            * @action
            * @extend_doc
            */

            /**
            * @name dxDropDownListOptions_fieldTemplate
            * @publicName fieldTemplate
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxDropDownListOptions_fieldRender
            * @publicName fieldRender
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxDropDownListOptions_contentTemplate
            * @publicName contentTemplate
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxDropDownListOptions_contentRender
            * @publicName contentRender
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxDropDownListOptions_applyValueMode
            * @publicName applyValueMode
            * @hidden
            * @extend_doc
            */

            popupWidthExtension: 0
        }));
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function(device) {
                    return device.platform === "win" && device.version && device.version[0] === 8;
                },
                options: {
                    popupPosition: { offset: { v: -6 } }
                }
            },
            {
                device: function() {
                    return /android5/.test(themes.current());
                },
                options: {
                    popupWidthExtension: 32
                }
            },
            {
                device: { platform: "ios" },
                options: {
                    popupPosition: { offset: { v: -1 } }
                }
            },
            {
                device: { platform: "generic" },
                options: {
                    buttonsLocation: "bottom center"
                }
            }
        ]);
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            /**
            * @name dxDropDownListOptions_value
            * @publicName value
            * @ref
            * @extend_doc
            */
            value: true,
            selectedItem: true,
            displayValue: true
        });
    },

    _init: function() {
        this.callBase();

        this._initDataExpressions();
        this._initActions();
        this._setListDataSource();
        this._validateSearchMode();
        this._clearSelectedItem();
    },

    _initActions: function() {
        this._initContentReadyAction();
        this._initSelectionChangedAction();
        this._initItemClickAction();
    },

    _initContentReadyAction: function() {
        this._contentReadyAction = this._createActionByOption("onContentReady", {
            excludeValidators: ["disabled", "readOnly"]
        });
    },

    _initSelectionChangedAction: function() {
        this._selectionChangedAction = this._createActionByOption("onSelectionChanged", {
            excludeValidators: ["disabled", "readOnly"]
        });
    },

    _initItemClickAction: function() {
        this._itemClickAction = this._createActionByOption("onItemClick");
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["item"] = new ChildDefaultTemplate("item", this);
    },

    _renderField: function() {
        this.callBase();
        eventsEngine.on(this._input(), "input", this._setFocusPolicy.bind(this));
    },

    _preventFocusOnPopup: function(e) {
        if(this._list && this._list.initialOption("focusStateEnabled")) {
            e.preventDefault();
        }
    },

    _createPopup: function() {
        this.callBase();
        this._popup._wrapper().addClass(this._popupWrapperClass());

        var $popupContent = this._popup.$content();
        eventsEngine.off($popupContent, "mousedown");
        eventsEngine.on($popupContent, "mousedown", this._preventFocusOnPopup.bind(this));
    },

    _popupWrapperClass: function() {
        return DROPDOWNLIST_POPUP_WRAPPER_CLASS;
    },

    _renderInputValue: function() {
        var value = this._getCurrentValue();

        return this._loadInputValue(value, this._setSelectedItem.bind(this))
            .always(this.callBase.bind(this, value));
    },

    _loadInputValue: function(value, callback) {
        return this._loadItem(value).always(callback);
    },

    _loadItem: function(value) {
        var plainItems = this._getPlainItems(this.option("items")),
            selectedItem = commonUtils.grep(plainItems, (function(item) {
                return this._isValueEquals(this._valueGetter(item), value);
            }).bind(this))[0];

        return selectedItem !== undefined
            ? new Deferred().resolve(selectedItem).promise()
            : this._loadValue(value);
    },

    _getPlainItems: function(items) {
        var plainItems = [];

        items = items || [];

        for(var i = 0; i < items.length; i++) {
            if(items[i] && items[i].items) {
                plainItems = plainItems.concat(items[i].items);
            } else {
                plainItems.push(items[i]);
            }
        }

        return plainItems;
    },

    _setSelectedItem: function(item) {
        var displayValue = this._displayValue(item);
        this.option("selectedItem", commonUtils.ensureDefined(item, null));
        this.option("displayValue", displayValue);
    },

    _displayValue: function(item) {
        return this._displayGetter(item);
    },

    _refreshSelected: function() {
        this._listItemElements().each((function(_, itemElement) {
            var $itemElement = $(itemElement);
            var itemValue = this._valueGetter($itemElement.data(LIST_ITEM_DATA_KEY));

            var isItemSelected = this._isSelectedValue(itemValue);

            if(isItemSelected) {
                this._list.selectItem($itemElement);
            } else {
                this._list.unselectItem($itemElement);
            }
        }).bind(this));
    },

    _popupShownHandler: function() {
        this.callBase();
        this._setFocusPolicy();
    },

    _setFocusPolicy: function() {
        if(!this.option("focusStateEnabled") || !this._list) {
            return;
        }

        this._list.option("focusedElement", null);
    },

    _isSelectedValue: function(value) {
        return this._isValueEquals(value, this.option("value"));
    },

    _validateSearchMode: function() {
        var searchMode = this.option("searchMode"),
            normalizedSearchMode = searchMode.toLowerCase();

        if(inArray(normalizedSearchMode, SEARCH_MODES) < 0) {
            throw errors.Error("E1019", searchMode);
        }
    },

    _clearSelectedItem: function() {
        this.option("selectedItem", null);
    },

    _processDataSourceChanging: function() {
        this._setListDataSource();

        this._renderInputValue().fail((function() {
            if(this._isCustomValueAllowed()) {
                return;
            }
            this._clearSelectedItem();
        }).bind(this));
    },

    _isCustomValueAllowed: function() {
        return this.option("displayCustomValue");
    },

    reset: function() {
        this.callBase();

        this._clearFilter();
        this._clearSelectedItem();
    },

    _listItemElements: function() {
        return this._$list ? this._$list.find(LIST_ITEM_SELECTOR) : $();
    },

    _popupConfig: function() {
        var that = this;
        return extend(this.callBase(), {
            templatesRenderAsynchronously: false,
            width: this.option("width"),
            onShowing: function() {
                that.$element().addClass(SKIP_GESTURE_EVENT_CLASS);
            },
            onHidden: function() {
                that.$element().removeClass(SKIP_GESTURE_EVENT_CLASS);
            },
            height: "auto",
            maxHeight: this._getMaxHeight.bind(this)
        });
    },

    _renderPopupContent: function() {
        this._renderList();
    },

    _attachChildKeyboardEvents: function() {
        this._childKeyboardProcessor = this._keyboardProcessor.attachChildProcessor();
        this._setListOption("_keyboardProcessor", this._childKeyboardProcessor);
    },

    _fireContentReadyAction: commonUtils.noop,

    _setAriaTargetForList: function() {
        //TODO: make getAriaTarget option
        this._list._getAriaTarget = this._getAriaTarget.bind(this);
        this._list.setAria("role", "combobox");
    },

    _renderList: function() {
        this._listId = "dx-" + new Guid()._value;

        var $list = this._$list = $("<div>").attr("id", this._listId)
            .appendTo(this._popup.$content());

        this._list = this._createComponent($list, List, this._listConfig());

        this._refreshList();

        this._setAriaTargetForList();
    },

    _renderOpenedState: function() {
        this.callBase();

        var opened = this.option("opened") || undefined;

        this.setAria({
            "activedescendant": opened && this._list.getFocusedItemId(),
            "owns": opened && this._listId
        });
    },

    _refreshList: function() {
        if(this._list && this._shouldRefreshDataSource()) {
            this._setListDataSource();
        }
    },

    _shouldRefreshDataSource: function() {
        var dataSourceProvided = !!this._list.option("dataSource");
        return dataSourceProvided !== this._needPassDataSourceToList();
    },

    _isDesktopDevice: function() {
        return devices.real().deviceType === "desktop";
    },

    _getListKeyExpr: function() {
        var valueExpr = this.option("valueExpr"),
            isValueExprField = typeUtils.isString(valueExpr) && valueExpr !== "this";

        return isValueExprField ? valueExpr : null;
    },

    _listConfig: function() {
        var options = {
            selectionMode: "single",
            _templates: this.option("_templates"),
            templateProvider: this.option("templateProvider"),
            noDataText: this.option("noDataText"),
            grouped: this.option("grouped"),
            onContentReady: this._listContentReadyHandler.bind(this),
            itemTemplate: this._getTemplateByOption("itemTemplate"),
            indicateLoading: false,
            keyExpr: this._getListKeyExpr(),
            groupTemplate: this.option("groupTemplate"),
            tabIndex: -1,
            onItemClick: this._listItemClickAction.bind(this),
            dataSource: this._getDataSource(),
            _keyboardProcessor: this._childKeyboardProcessor,
            hoverStateEnabled: this._isDesktopDevice() ? this.option("hoverStateEnabled") : false,
            focusStateEnabled: this._isDesktopDevice() ? this.option("focusStateEnabled") : false
        };

        return options;
    },

    _getDataSource: function() {
        return this._needPassDataSourceToList() ? this._dataSource : null;
    },

    _dataSourceOptions: function() {
        this._suppressDeprecatedWarnings();
        var pagingEnabled = this.option("pagingEnabled");
        this._resumeDeprecatedWarnings();
        return {
            paginate: commonUtils.ensureDefined(pagingEnabled, false)
        };
    },

    _dataSourceFromUrlLoadMode: function() {
        return "raw";
    },

    _listContentReadyHandler: function() {
        this._list = this._list || this._$list.dxList("instance");

        this._dimensionChanged();
        this._contentReadyAction();
    },

    _setListOption: function(optionName, value) {
        this._setWidgetOption("_list", arguments);
    },

    _listItemClickAction: function(e) {
        this._listItemClickHandler(e);
        this._itemClickAction(e);
    },

    _listItemClickHandler: commonUtils.noop,

    _setListDataSource: function() {
        if(!this._list) {
            return;
        }

        this._setListOption("dataSource", this._getDataSource());

        if(!this._needPassDataSourceToList()) {
            this._setListOption("items", []);
        }
    },

    _needPassDataSourceToList: function() {
        return this.option("showDataBeforeSearch") || this._isMinSearchLengthExceeded();
    },

    _isMinSearchLengthExceeded: function() {
        return this._searchValue().toString().length >= this.option("minSearchLength");
    },

    _searchValue: function() {
        return this._input().val() || "";
    },

    _getSearchEvent: function() {
        return eventUtils.addNamespace("keyup", this.NAME + "Search");
    },

    _renderEvents: function() {
        this.callBase();

        if(this._shouldRenderSearchEvent()) {
            eventsEngine.on(this._input(), this._getSearchEvent(), this._searchHandler.bind(this));
        }
    },

    _shouldRenderSearchEvent: function() {
        return this.option("searchEnabled");
    },

    _refreshEvents: function() {
        eventsEngine.off(this._input(), this._getSearchEvent());
        this.callBase();
    },

    _searchHandler: function() {
        if(!this._isMinSearchLengthExceeded()) {
            this._searchCanceled();
            return;
        }

        var searchTimeout = this.option("searchTimeout");

        if(searchTimeout) {
            this._clearSearchTimer();
            this._searchTimer = setTimeout(this._searchDataSource.bind(this), searchTimeout);
        } else {
            this._searchDataSource();
        }
    },

    _searchCanceled: function() {
        this._clearSearchTimer();
        if(this._needPassDataSourceToList()) {
            this._filterDataSource(null);
        }
        this._refreshList();
    },

    _searchDataSource: function() {
        this._filterDataSource(this._searchValue());
    },

    _filterDataSource: function(searchValue) {
        this._clearSearchTimer();

        var dataSource = this._dataSource;

        dataSource.searchExpr(this.option("searchExpr") || this._displayGetterExpr());
        dataSource.searchOperation(this.option("searchMode"));
        dataSource.searchValue(searchValue);

        return dataSource.load().done(this._dataSourceFiltered.bind(this, searchValue));
    },

    _clearFilter: function() {
        var dataSource = this._dataSource;
        dataSource && dataSource.searchValue() && dataSource.searchValue(null);
    },

    _dataSourceFiltered: function() {
        this._refreshList();
        this._refreshPopupVisibility();
    },

    _refreshPopupVisibility: function() {
        if(this.option("readOnly")) {
            return;
        }

        this.option("opened", this._hasItemsToShow());
        if(this.option("opened")) {
            this._dimensionChanged();
        }
    },

    _dataSourceChangedHandler: function(newItems) {
        if(this._dataSource.pageIndex() === 0) {
            this.option().items = newItems;
        } else {
            this.option().items = this.option().items.concat(newItems);
        }
    },

    _hasItemsToShow: function() {
        var resultItems = this._dataSource && this._dataSource.items() || [];
        var resultAmount = resultItems.length;
        var isMinSearchLengthExceeded = this._needPassDataSourceToList();

        return isMinSearchLengthExceeded && resultAmount && this._hasFocusClass();
    },

    _clearSearchTimer: function() {
        clearTimeout(this._searchTimer);
        delete this._searchTimer;
    },

    _popupShowingHandler: function() {
        this._dimensionChanged();
    },

    _dimensionChanged: function() {
        this._popup && this._updatePopupDimensions();
    },

    _updatePopupDimensions: function() {
        this._updatePopupWidth();
        this._updatePopupHeight();
    },

    _updatePopupWidth: function() {
        this._setPopupOption("width", this.$element().outerWidth() + this.option("popupWidthExtension"));
    },

    _needPopupRepaint: function() {
        if(!this._dataSource) {
            return false;
        }

        var currentPageIndex = this._dataSource.pageIndex(),
            needRepaint = typeUtils.isDefined(this._pageIndex) && currentPageIndex <= this._pageIndex;

        this._pageIndex = currentPageIndex;

        return needRepaint;
    },

    _updatePopupHeight: function() {
        if(this._needPopupRepaint()) {
            this._popup.repaint();
        }

        this._list && this._list.updateDimensions();
    },

    _getMaxHeight: function() {
        var $element = this.$element(),
            offset = $element.offset(),
            windowHeight = $(window).height(),
            maxHeight = Math.max(offset.top, windowHeight - offset.top - $element.outerHeight());

        return Math.min(windowHeight * 0.5, maxHeight);
    },

    _clean: function() {
        if(this._list) {
            delete this._list;
        }
        this.callBase();
    },

    _dispose: function() {
        this._clearSearchTimer();
        this.callBase();
    },

    _setCollectionWidgetOption: function() {
        this._setListOption.apply(this, arguments);
    },

    _optionChanged: function(args) {
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case "hoverStateEnabled":
            case "focusStateEnabled":
                this._isDesktopDevice() && this._setListOption(args.name, args.value);
                this.callBase(args);
                break;
            case "items":
                if(!this.option("dataSource")) {
                    this._processDataSourceChanging();
                }
                break;
            case "dataSource":
                this._processDataSourceChanging();
                break;
            case "valueExpr":
                this._renderValue();
                this._setListOption("keyExpr", this._getListKeyExpr());
                break;
            case "displayExpr":
                this._renderValue();
                break;
            case "searchMode":
                this._validateSearchMode();
                break;
            case "minSearchLength":
                this._refreshList();
                break;
            case "searchEnabled":
            case "showDataBeforeSearch":
            case "searchExpr":
            case "pagingEnabled":
                this._invalidate();
                break;
            case "onContentReady":
                this._initContentReadyAction();
                break;
            case "onSelectionChanged":
                this._initSelectionChangedAction();
                break;
            case "onItemClick":
                this._initItemClickAction();
                break;
            case "grouped":
            case "groupTemplate":
            case "noDataText":
                this._setListOption(args.name);
                break;
            case "displayValue":
                this.option("text", args.value);
                break;
            case "itemTemplate":
            case "searchTimeout":
            case "popupWidthExtension":
                break;
            case "selectedItem":
                this._selectionChangedAction({ selectedItem: args.value });
                break;
            default:
                this.callBase(args);
        }
    }

}).include(DataExpressionMixin);

registerComponent("dxDropDownList", DropDownList);

module.exports = DropDownList;
