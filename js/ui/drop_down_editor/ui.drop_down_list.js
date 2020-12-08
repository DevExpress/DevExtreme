import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
const window = getWindow();
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import registerComponent from '../../core/component_registrator';
import { noop, ensureDefined, grep } from '../../core/utils/common';
import { isWindow, isDefined, isObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import DropDownEditor from './ui.drop_down_editor';
import List from '../list';
import errors from '../widget/ui.errors';
import { addNamespace } from '../../events/utils/index';
import devices from '../../core/devices';
import dataQuery from '../../data/query';
import { each } from '../../core/utils/iterator';
import DataExpressionMixin from '../editor/ui.data_expression';
import messageLocalization from '../../localization/message';
import { ChildDefaultTemplate } from '../../core/templates/child_default_template';
import { Deferred } from '../../core/utils/deferred';
import DataConverterMixin from '../shared/grouped_data_converter_mixin';

const LIST_ITEM_SELECTOR = '.dx-list-item';
const LIST_ITEM_DATA_KEY = 'dxListItemData';
const DROPDOWNLIST_POPUP_WRAPPER_CLASS = 'dx-dropdownlist-popup-wrapper';

const SKIP_GESTURE_EVENT_CLASS = 'dx-skip-gesture-event';
const SEARCH_EVENT = 'input';

const SEARCH_MODES = ['startswith', 'contains', 'endwith', 'notcontains'];

const DropDownList = DropDownEditor.inherit({

    _supportedKeys: function() {
        const parent = this.callBase();

        return extend({}, parent, {
            tab: function(e) {
                if(this._allowSelectItemByTab()) {
                    this._saveValueChangeEvent(e);
                    const $focusedItem = $(this._list.option('focusedElement'));
                    $focusedItem.length && this._setSelectedElement($focusedItem);
                }

                parent.tab.apply(this, arguments);
            },
            space: noop,
            home: noop,
            end: noop
        });
    },

    _allowSelectItemByTab: function() {
        return this.option('opened') && this.option('applyValueMode') === 'instantly';
    },

    _setSelectedElement: function($element) {
        const value = this._valueGetter(this._list._getItemData($element));
        this._setValue(value);
    },

    _setValue: function(value) {
        this.option('value', value);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), extend(DataExpressionMixin._dataExpressionDefaultOptions(), {
            displayValue: undefined,

            searchEnabled: false,

            searchMode: 'contains',

            searchTimeout: 500,

            minSearchLength: 0,

            searchExpr: null,

            valueChangeEvent: 'input change keyup',

            selectedItem: null,

            noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),

            onSelectionChanged: null,

            onItemClick: noop,

            showDataBeforeSearch: false,

            grouped: false,

            groupTemplate: 'group',

            popupPosition: {
                my: 'left top',
                at: 'left bottom',
                offset: { h: 0, v: 0 },
                collision: 'flip'
            },

            wrapItemText: false,


            /**
            * @name dxDropDownListOptions.fieldTemplate
            * @hidden
            */
            /**
            * @name dxDropDownListOptions.fieldRender
            * @hidden
            */
            /**
            * @name dxDropDownListOptions.contentRender
            * @hidden
            */
            /**
            * @name dxDropDownListOptions.applyValueMode
            * @hidden
            */
        }));
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: 'ios' },
                options: {
                    popupPosition: { offset: { v: -1 } }
                }
            },
            {
                device: { platform: 'generic' },
                options: {
                    buttonsLocation: 'bottom center'
                }
            }
        ]);
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
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
        this._initItems();
    },

    _setListFocusedElementOptionChange: function() {
        this._list._updateParentActiveDescendant = this._updateActiveDescendant.bind(this);
    },

    _initItems: function() {
        const items = this.option().items;
        if(items && !items.length && this._dataSource) {
            this.option().items = this._dataSource.items();
        }
    },

    _initActions: function() {
        this._initContentReadyAction();
        this._initSelectionChangedAction();
        this._initItemClickAction();
    },

    _initContentReadyAction: function() {
        this._contentReadyAction = this._createActionByOption('onContentReady', {
            excludeValidators: ['disabled', 'readOnly']
        });
    },

    _initSelectionChangedAction: function() {
        this._selectionChangedAction = this._createActionByOption('onSelectionChanged', {
            excludeValidators: ['disabled', 'readOnly']
        });
    },

    _initItemClickAction: function() {
        this._itemClickAction = this._createActionByOption('onItemClick');
    },

    _initTemplates: function() {
        this.callBase();
        this._templateManager.addDefaultTemplates({
            item: new ChildDefaultTemplate('item')
        });
    },

    _saveFocusOnWidget: function(e) {
        if(this._list && this._list.initialOption('focusStateEnabled')) {
            this._focusInput();
        }
    },

    _fitIntoRange: function(value, start, end) {
        if(value > end) {
            return start;
        }
        if(value < start) {
            return end;
        }
        return value;
    },

    _items: function() {
        const items = this._getPlainItems(!this._list && this._dataSource.items());

        const availableItems = new dataQuery(items).filter('disabled', '<>', true).toArray();

        return availableItems;
    },

    _calcNextItem: function(step) {
        const items = this._items();
        const nextIndex = this._fitIntoRange(this._getSelectedIndex() + step, 0, items.length - 1);
        return items[nextIndex];
    },

    _getSelectedIndex: function() {
        const items = this._items();
        const selectedItem = this.option('selectedItem');
        let result = -1;
        each(items, (function(index, item) {
            if(this._isValueEquals(item, selectedItem)) {
                result = index;
                return false;
            }
        }).bind(this));

        return result;
    },

    _createPopup: function() {
        this.callBase();
        this._updateCustomBoundaryContainer();
        this._popup._wrapper().addClass(this._popupWrapperClass());

        const $popupContent = this._popup.$content();
        eventsEngine.off($popupContent, 'mouseup');
        eventsEngine.on($popupContent, 'mouseup', this._saveFocusOnWidget.bind(this));

        const that = this;
        this._popup.on({
            'shown': function() {
                that.$element().addClass(SKIP_GESTURE_EVENT_CLASS);
            },
            'hidden': function() {
                that.$element().removeClass(SKIP_GESTURE_EVENT_CLASS);
            }
        });
    },

    _updateCustomBoundaryContainer: function() {
        const customContainer = this.option('dropDownOptions.container');
        const $container = customContainer && $(customContainer);

        if($container && $container.length && !isWindow($container.get(0))) {
            const $containerWithParents = [].slice.call($container.parents());
            $containerWithParents.unshift($container.get(0));

            each($containerWithParents, function(i, parent) {
                if(parent === $('body').get(0)) {
                    return false;
                } else if(window.getComputedStyle(parent).overflowY === 'hidden') {
                    this._$customBoundaryContainer = $(parent);
                    return false;
                }
            }.bind(this));
        }
    },

    _popupWrapperClass: function() {
        return DROPDOWNLIST_POPUP_WRAPPER_CLASS;
    },

    _renderInputValue: function() {
        const value = this._getCurrentValue();

        return this._loadInputValue(value, this._setSelectedItem.bind(this))
            .always(this.callBase.bind(this, value));
    },

    _loadInputValue: function(value, callback) {
        return this._loadItem(value).always(callback);
    },

    _getItemFromPlain: function(value, cache) {
        let plainItems;
        let selectedItem;

        if(cache && typeof value !== 'object') {
            if(!cache.itemByValue) {
                cache.itemByValue = {};
                plainItems = this._getPlainItems();
                plainItems.forEach(function(item) {
                    cache.itemByValue[this._valueGetter(item)] = item;
                }, this);
            }
            selectedItem = cache.itemByValue[value];
        }

        if(!selectedItem) {
            plainItems = this._getPlainItems();
            selectedItem = grep(plainItems, (function(item) {
                return this._isValueEquals(this._valueGetter(item), value);
            }).bind(this))[0];
        }

        return selectedItem;
    },

    _loadItem: function(value, cache) {
        const selectedItem = this._getItemFromPlain(value, cache);

        return selectedItem !== undefined
            ? new Deferred().resolve(selectedItem).promise()
            : this._loadValue(value);
    },

    _getPlainItems: function(items) {
        let plainItems = [];

        items = items || this.option('items') || this._dataSource.items() || [];

        for(let i = 0; i < items.length; i++) {
            if(items[i] && items[i].items) {
                plainItems = plainItems.concat(items[i].items);
            } else {
                plainItems.push(items[i]);
            }
        }

        return plainItems;
    },

    _updateActiveDescendant() {
        const opened = this.option('opened');
        const listFocusedItemId = this._list?.getFocusedItemId();
        const isElementOnDom = $(`#${listFocusedItemId}`).length > 0;
        const activedescendant = opened && isElementOnDom && listFocusedItemId;

        this.setAria({
            'activedescendant': activedescendant || null
        });
    },

    _setSelectedItem: function(item) {
        const displayValue = this._displayValue(item);
        this.option('selectedItem', ensureDefined(item, null));
        this.option('displayValue', displayValue);
    },

    _displayValue: function(item) {
        return this._displayGetter(item);
    },

    _refreshSelected: function() {
        const cache = {};
        this._listItemElements().each((function(_, itemElement) {
            const $itemElement = $(itemElement);
            const itemValue = this._valueGetter($itemElement.data(LIST_ITEM_DATA_KEY));

            const isItemSelected = this._isSelectedValue(itemValue, cache);

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
        if(!this.option('focusStateEnabled') || !this._list) {
            return;
        }

        this._list.option('focusedElement', null);
    },

    _isSelectedValue: function(value) {
        return this._isValueEquals(value, this.option('value'));
    },

    _validateSearchMode: function() {
        const searchMode = this.option('searchMode');
        const normalizedSearchMode = searchMode.toLowerCase();

        if(inArray(normalizedSearchMode, SEARCH_MODES) < 0) {
            throw errors.Error('E1019', searchMode);
        }
    },

    _clearSelectedItem: function() {
        this.option('selectedItem', null);
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
        return this.option('displayCustomValue');
    },

    reset: function() {
        this.callBase();

        this._clearFilter();
        this._clearSelectedItem();
        this._preventFiltering = true;
    },

    _listItemElements: function() {
        return this._$list ? this._$list.find(LIST_ITEM_SELECTOR) : $();
    },

    _popupConfig: function() {
        return extend(this.callBase(), {
            templatesRenderAsynchronously: false,
            autoResizeEnabled: false,
            maxHeight: this._getMaxHeight.bind(this),
        });
    },

    _renderPopupContent: function() {
        this.callBase();
        this._renderList();
    },

    _getKeyboardListeners() {
        const canListHaveFocus = this._canListHaveFocus();

        return this.callBase().concat([!canListHaveFocus && this._list]);
    },

    _fireContentReadyAction: noop,

    _setAriaTargetForList: function() {
        this._list._getAriaTarget = this._getAriaTarget.bind(this);
    },

    _renderList: function() {
        this._listId = 'dx-' + new Guid()._value;

        const $list = this._$list = $('<div>').attr('id', this._listId)
            .appendTo(this._popup.$content());

        this._list = this._createComponent($list, List, this._listConfig());
        this._refreshList();

        this._setAriaTargetForList();
        this._list.option('_listAttributes', { 'role': 'combobox' });

        this._renderPreventBlur(this._$list);
        this._setListFocusedElementOptionChange();
    },

    _renderPreventBlur: function($target) {
        const eventName = addNamespace('mousedown', 'dxDropDownList');

        eventsEngine.off($target, eventName);
        eventsEngine.on($target, eventName, function(e) {
            e.preventDefault();
        }.bind(this));
    },

    _renderOpenedState: function() {
        this.callBase();

        this._list && this._updateActiveDescendant();
        this.setAria({
            'controls': this._list && this._listId,
            'owns': this._popup && this._popupContentId
        });
    },

    _setDefaultAria: function() {
        this.setAria({
            'haspopup': 'listbox',
            'autocomplete': 'list'
        });
    },

    _refreshList: function() {
        if(this._list && this._shouldRefreshDataSource()) {
            this._setListDataSource();
        }
    },

    _shouldRefreshDataSource: function() {
        const dataSourceProvided = !!this._list.option('dataSource');

        return dataSourceProvided !== this._needPassDataSourceToList();
    },

    _isDesktopDevice: function() {
        return devices.real().deviceType === 'desktop';
    },

    _listConfig: function() {
        const options = {
            selectionMode: 'single',
            _templates: this.option('_templates'),
            templateProvider: this.option('templateProvider'),
            noDataText: this.option('noDataText'),
            grouped: this.option('grouped'),
            wrapItemText: this.option('wrapItemText'),
            onContentReady: this._listContentReadyHandler.bind(this),
            itemTemplate: this.option('itemTemplate'),
            indicateLoading: false,
            keyExpr: this._getCollectionKeyExpr(),
            displayExpr: this._displayGetterExpr(),
            groupTemplate: this.option('groupTemplate'),
            onItemClick: this._listItemClickAction.bind(this),
            dataSource: this._getDataSource(),
            _revertPageOnEmptyLoad: true,
            hoverStateEnabled: this._isDesktopDevice() ? this.option('hoverStateEnabled') : false,
            focusStateEnabled: this._isDesktopDevice() ? this.option('focusStateEnabled') : false
        };

        if(!this._canListHaveFocus()) {
            options.tabIndex = null;
        }

        return options;
    },

    _canListHaveFocus: () => false,

    _getDataSource: function() {
        return this._needPassDataSourceToList() ? this._dataSource : null;
    },

    _dataSourceOptions: function() {
        return {
            paginate: false
        };
    },

    _getGroupedOption: function() {
        return this.option('grouped');
    },

    _dataSourceFromUrlLoadMode: function() {
        return 'raw';
    },

    _listContentReadyHandler: function() {
        this._list = this._list || this._$list.dxList('instance');

        if(!this.option('deferRendering')) {
            this._refreshSelected();
        }

        this._dimensionChanged();
        this._contentReadyAction();
    },

    _setListOption: function(optionName, value) {
        this._setWidgetOption('_list', arguments);
    },

    _listItemClickAction: function(e) {
        this._listItemClickHandler(e);
        this._itemClickAction(e);
    },

    _listItemClickHandler: noop,

    _setListDataSource: function() {
        if(!this._list) {
            return;
        }

        this._setListOption('dataSource', this._getDataSource());

        if(!this._needPassDataSourceToList()) {
            this._setListOption('items', []);
        }
    },

    _needPassDataSourceToList: function() {
        return this.option('showDataBeforeSearch') || this._isMinSearchLengthExceeded();
    },

    _isMinSearchLengthExceeded: function() {
        return this._searchValue().toString().length >= this.option('minSearchLength');
    },

    _needClearFilter: function() {
        return this._canKeepDataSource() ? false : this._needPassDataSourceToList();
    },

    _canKeepDataSource: function() {
        const isMinSearchLengthExceeded = this._isMinSearchLengthExceeded();
        return this._dataSource?.isLoaded() &&
            this.option('showDataBeforeSearch') &&
            this.option('minSearchLength') &&
            !isMinSearchLengthExceeded &&
            !this._isLastMinSearchLengthExceeded;
    },

    _searchValue: function() {
        return this._input().val() || '';
    },

    _getSearchEvent: function() {
        return addNamespace(SEARCH_EVENT, this.NAME + 'Search');
    },

    _getSetFocusPolicyEvent: function() {
        return addNamespace('input', this.NAME + 'FocusPolicy');
    },

    _renderEvents: function() {
        this.callBase();
        eventsEngine.on(this._input(), this._getSetFocusPolicyEvent(), this._setFocusPolicy.bind(this));

        if(this._shouldRenderSearchEvent()) {
            eventsEngine.on(this._input(), this._getSearchEvent(), this._searchHandler.bind(this));
        }
    },

    _shouldRenderSearchEvent: function() {
        return this.option('searchEnabled');
    },

    _refreshEvents: function() {
        eventsEngine.off(this._input(), this._getSearchEvent());
        eventsEngine.off(this._input(), this._getSetFocusPolicyEvent());

        this.callBase();
    },

    _searchHandler: function() {
        if(!this._isMinSearchLengthExceeded()) {
            this._searchCanceled();
            return;
        }

        const searchTimeout = this.option('searchTimeout');

        if(searchTimeout) {
            this._clearSearchTimer();
            this._searchTimer = setTimeout(this._searchDataSource.bind(this), searchTimeout);
        } else {
            this._searchDataSource();
        }
    },

    _searchCanceled: function() {
        this._clearSearchTimer();
        if(this._needClearFilter()) {
            this._filterDataSource(null);
        }
        this._refreshList();
    },

    _searchDataSource: function() {
        this._filterDataSource(this._searchValue());
    },

    _filterDataSource: function(searchValue) {
        this._clearSearchTimer();

        const dataSource = this._dataSource;
        if(dataSource) {
            dataSource.searchExpr(this.option('searchExpr') || this._displayGetterExpr());
            dataSource.searchOperation(this.option('searchMode'));
            dataSource.searchValue(searchValue);
            dataSource.load().done(this._dataSourceFiltered.bind(this, searchValue));
        }
    },

    _clearFilter: function() {
        const dataSource = this._dataSource;
        dataSource && dataSource.searchValue() && dataSource.searchValue(null);
    },

    _dataSourceFiltered: function() {
        this._isLastMinSearchLengthExceeded = this._isMinSearchLengthExceeded();
        this._refreshList();
        this._refreshPopupVisibility();
    },

    _shouldOpenPopup: function() {
        return this._hasItemsToShow();
    },

    _refreshPopupVisibility: function() {
        if(this.option('readOnly') || !this._searchValue()) {
            return;
        }

        const shouldOpenPopup = this._shouldOpenPopup();

        if(shouldOpenPopup && !this._isFocused()) {
            return;
        }

        this.option('opened', shouldOpenPopup);

        if(shouldOpenPopup) {
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
        const resultItems = this._dataSource && this._dataSource.items() || [];
        const resultAmount = resultItems.length;
        const isMinSearchLengthExceeded = this._needPassDataSourceToList();

        return !!(isMinSearchLengthExceeded && resultAmount);
    },

    _clearSearchTimer: function() {
        clearTimeout(this._searchTimer);
        delete this._searchTimer;
    },

    _popupShowingHandler: function() {
        this._dimensionChanged();
    },

    _dimensionChanged: function() {
        this.callBase(arguments);

        this._popup && this._updatePopupDimensions();
    },

    _needPopupRepaint: function() {
        if(!this._dataSource) {
            return false;
        }

        const currentPageIndex = this._dataSource.pageIndex();
        const needRepaint = isDefined(this._pageIndex) && currentPageIndex <= this._pageIndex;

        this._pageIndex = currentPageIndex;

        return needRepaint;
    },

    _updatePopupDimensions: function() {
        if(this._needPopupRepaint()) {
            this._popup.repaint();
        }

        this._list && this._list.updateDimensions();
    },

    _getMaxHeight: function() {
        const $element = this.$element();
        const $customBoundaryContainer = this._$customBoundaryContainer;
        const offsetTop = $element.offset().top - ($customBoundaryContainer ? $customBoundaryContainer.offset().top : 0);
        const windowHeight = $(window).outerHeight();
        const containerHeight = $customBoundaryContainer ? Math.min($customBoundaryContainer.outerHeight(), windowHeight) : windowHeight;
        const maxHeight = Math.max(offsetTop, containerHeight - offsetTop - $element.outerHeight());

        return Math.min(containerHeight * 0.5, maxHeight);
    },

    _clean: function() {
        if(this._list) {
            delete this._list;
        }
        delete this._isLastMinSearchLengthExceeded;
        this.callBase();
    },

    _dispose: function() {
        this._clearSearchTimer();
        this.callBase();
    },

    _setCollectionWidgetOption: function() {
        this._setListOption.apply(this, arguments);
    },

    _setSubmitValue: function() {
        const value = this.option('value');
        const submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;

        this._getSubmitElement().val(submitValue);
    },

    _shouldUseDisplayValue: function(value) {
        return this.option('valueExpr') === 'this' && isObject(value);
    },

    _optionChanged: function(args) {
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case 'hoverStateEnabled':
            case 'focusStateEnabled':
                this._isDesktopDevice() && this._setListOption(args.name, args.value);
                this.callBase(args);
                break;
            case 'items':
                if(!this.option('dataSource')) {
                    this._processDataSourceChanging();
                }
                break;
            case 'dataSource':
                this._processDataSourceChanging();
                break;
            case 'valueExpr':
                this._renderValue();
                this._setListOption('keyExpr', this._getCollectionKeyExpr());
                break;
            case 'displayExpr':
                this._renderValue();
                this._setListOption('displayExpr', this._displayGetterExpr());
                break;
            case 'searchMode':
                this._validateSearchMode();
                break;
            case 'minSearchLength':
                this._refreshList();
                break;
            case 'searchEnabled':
            case 'showDataBeforeSearch':
            case 'searchExpr':
                this._invalidate();
                break;
            case 'onContentReady':
                this._initContentReadyAction();
                break;
            case 'onSelectionChanged':
                this._initSelectionChangedAction();
                break;
            case 'onItemClick':
                this._initItemClickAction();
                break;
            case 'grouped':
            case 'groupTemplate':
            case 'wrapItemText':
            case 'noDataText':
                this._setListOption(args.name);
                break;
            case 'displayValue':
                this.option('text', args.value);
                break;
            case 'itemTemplate':
            case 'searchTimeout':
                break;
            case 'selectedItem':
                if(args.previousValue !== args.value) {
                    this._selectionChangedAction({ selectedItem: args.value });
                }
                break;
            default:
                this.callBase(args);
        }
    }

}).include(DataExpressionMixin, DataConverterMixin);

registerComponent('dxDropDownList', DropDownList);

export default DropDownList;
