import $ from '../core/renderer';
import { noop, ensureDefined } from '../core/utils/common';
import { isDefined, isPromise } from '../core/utils/type';
import { extend } from '../core/utils/extend';
import { inArray } from '../core/utils/array';
import { each } from '../core/utils/iterator';
import { Deferred, fromPromise } from '../core/utils/deferred';
import { getPublicElement } from '../core/element';
import errors from '../core/errors';
import domAdapter from '../core/dom_adapter';
import { render } from './widget/utils.ink_ripple';
import messageLocalization from '../localization/message';
import registerComponent from '../core/component_registrator';
import DropDownList from './drop_down_editor/ui.drop_down_list';
import { normalizeKeyName } from '../events/utils/index';

// STYLE selectBox

const DISABLED_STATE_SELECTOR = '.dx-state-disabled';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_CLASS = 'dx-selectbox-popup';
const SELECTBOX_CONTAINER_CLASS = 'dx-selectbox-container';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';

const SelectBox = DropDownList.inherit({

    _supportedKeys: function() {
        const that = this;
        const parent = this.callBase();
        const clearSelectBox = function(e) {
            const isEditable = this._isEditable();

            if(!isEditable) {
                if(this.option('showClearButton')) {
                    e.preventDefault();
                    this.reset();
                }
            } else if(this._valueSubstituted()) {
                this._preventFiltering = true;
            }
            this._savedTextRemoveEvent = e;
            this._preventSubstitution = true;
        };

        const searchIfNeeded = function() {
            if(that.option('searchEnabled') && that._valueSubstituted()) {
                that._searchHandler();
            }
        };

        return extend({}, parent, {
            tab: function() {
                if(this.option('opened') && this.option('applyValueMode') === 'instantly') {
                    this._cleanInputSelection();
                }

                if(this._wasSearch()) {
                    this._clearFilter();
                }

                parent.tab && parent.tab.apply(this, arguments);
            },
            upArrow: function(e) {
                if(parent.upArrow && parent.upArrow.apply(this, arguments)) {
                    if(!this.option('opened')) {
                        this._setNextValue(e);
                    }
                    return true;
                }
            },
            downArrow: function(e) {
                if(parent.downArrow && parent.downArrow.apply(this, arguments)) {
                    if(!this.option('opened')) {
                        this._setNextValue(e);
                    }
                    return true;
                }
            },
            leftArrow: function() {
                searchIfNeeded();
                parent.leftArrow && parent.leftArrow.apply(this, arguments);
            },
            rightArrow: function() {
                searchIfNeeded();
                parent.rightArrow && parent.rightArrow.apply(this, arguments);
            },
            home: function() {
                searchIfNeeded();
                parent.home && parent.home.apply(this, arguments);
            },
            end: function() {
                searchIfNeeded();
                parent.end && parent.end.apply(this, arguments);
            },
            escape: function() {
                const result = parent.escape && parent.escape.apply(this, arguments);
                this._cancelEditing();

                return isDefined(result) ? result : true;
            },
            enter: function(e) {
                const isOpened = this.option('opened');
                const inputText = this._input().val().trim();
                const isCustomText = inputText && this._list && !this._list.option('focusedElement');

                if(!inputText && isDefined(this.option('value')) && this.option('allowClearing')) {
                    this.option({
                        selectedItem: null,
                        value: null
                    });

                    this.close();
                } else {
                    if(this.option('acceptCustomValue')) {
                        e.preventDefault();

                        if(isCustomText) {
                            this._valueChangeEventHandler(e);
                            if(isOpened) this._toggleOpenState();
                        }

                        return isOpened;
                    }

                    if(parent.enter && parent.enter.apply(this, arguments)) {
                        return isOpened;
                    }
                }
            },
            space: function(e) {
                const isOpened = this.option('opened');
                const isSearchEnabled = this.option('searchEnabled');
                const acceptCustomValue = this.option('acceptCustomValue');
                if(!isOpened || isSearchEnabled || acceptCustomValue) {
                    return;
                }

                e.preventDefault();
                this._valueChangeEventHandler(e);
                return true;
            },
            backspace: clearSelectBox,
            del: clearSelectBox
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            placeholder: messageLocalization.format('Select'),

            fieldTemplate: null,

            valueChangeEvent: 'change',

            acceptCustomValue: false,

            onCustomItemCreating: function(e) {
                if(!isDefined(e.customItem)) {
                    e.customItem = e.text;
                }
            },

            showSelectionControls: false,

            /**
            * @name dxSelectBoxOptions.allowClearing
            * @type boolean
            * @default true
            * @hidden
            */
            allowClearing: true,

            tooltipEnabled: false,

            openOnFieldClick: true,

            showDropDownButton: true,

            displayCustomValue: false,

            useInkRipple: false,
            useHiddenSubmitElement: true
        });
    },

    _init: function() {
        this.callBase();
        this._initCustomItemCreatingAction();
    },

    _initMarkup: function() {
        this.$element().addClass(SELECTBOX_CLASS);
        this._renderTooltip();
        this.option('useInkRipple') && this._renderInkRipple();

        this.callBase();
        this._$container.addClass(SELECTBOX_CONTAINER_CLASS);
    },

    _renderInkRipple: function() {
        this._inkRipple = render();
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple || this._isEditable()) {
            return;
        }

        const config = {
            element: this._inputWrapper(),
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _createPopup: function() {
        this.callBase();
        this._popup.$element().addClass(SELECTBOX_POPUP_CLASS);
        this._popup.overlayContent().attr('tabindex', -1);
    },

    _popupWrapperClass: function() {
        return this.callBase() + ' ' + SELECTBOX_POPUP_WRAPPER_CLASS;
    },

    _cancelEditing: function() {
        if(!this.option('searchEnabled') && this._list) {
            this._focusListElement(null);
            this._updateField(this.option('selectedItem'));
        }
    },

    _renderOpenedState: function() {
        this.callBase();

        if(this.option('opened')) {
            this._scrollToSelectedItem();
            this._focusSelectedElement();
        }
    },

    _focusSelectedElement: function() {
        const searchValue = this._searchValue();

        if(!searchValue) {
            this._focusListElement(null);
            return;
        }

        const $listItems = this._list._itemElements();
        const index = inArray(this.option('selectedItem'), this.option('items'));
        const focusedElement = index >= 0 && !this._isCustomItemSelected() ? $listItems.eq(index) : null;

        this._focusListElement(focusedElement);
    },

    _renderFocusedElement: function() {
        if(!this._list) {
            return;
        }

        const searchValue = this._searchValue();

        if(!searchValue || this.option('acceptCustomValue')) {
            this._focusListElement(null);
            return;
        }

        const $listItems = this._list._itemElements();
        const focusedElement = $listItems.not(DISABLED_STATE_SELECTOR).eq(0);

        this._focusListElement(focusedElement);
    },

    _focusListElement: function(element) {
        this._preventInputValueRender = true;
        this._list.option('focusedElement', getPublicElement(element));
        delete this._preventInputValueRender;
    },

    _scrollToSelectedItem: function() {
        this._list && this._list.scrollToItem(this._list.option('selectedItem'));
    },

    _listContentReadyHandler: function() {
        this.callBase();

        const isPaginate = this._dataSource && this._dataSource.paginate();

        if(isPaginate && this._needPopupRepaint()) {
            return;
        }

        this._scrollToSelectedItem();
    },

    _renderValue: function() {
        this._renderInputValue();
        this._setSubmitValue();

        return new Deferred().resolve();
    },

    _renderInputValue: function() {
        return this.callBase().always(function() {
            this._renderInputValueAsync();
        }.bind(this));
    },

    _renderInputValueAsync: function() {
        this._renderTooltip();
        this._renderInputValueImpl().always(function() {
            this._refreshSelected();
        }.bind(this));
    },

    _renderInputValueImpl: function() {
        this._renderField();

        return new Deferred().resolve();
    },

    _setNextItem: function(step) {
        const item = this._calcNextItem(step);
        const value = this._valueGetter(item);

        this._setValue(value);
    },

    _setNextValue: function(e) {
        const dataSourceIsLoaded = this._dataSource.isLoaded()
            ? new Deferred().resolve()
            : this._dataSource.load();

        dataSourceIsLoaded.done((function() {
            const selectedIndex = this._getSelectedIndex();
            const hasPages = this._dataSource.pageSize();
            const isLastPage = this._dataSource.isLastPage();
            const isLastItem = selectedIndex === this._items().length - 1;

            this._saveValueChangeEvent(e);
            const step = normalizeKeyName(e) === 'downArrow' ? 1 : -1;

            if(hasPages && !isLastPage && isLastItem && step > 0) {
                if(!this._popup) {
                    this._createPopup();
                }

                if(!this._dataSource.isLoading()) {
                    this._list._loadNextPage().done(this._setNextItem.bind(this, step));
                }
            } else {
                this._setNextItem(step);
            }
        }).bind(this));
    },

    _setSelectedItem: function(item) {
        const isUnknownItem = !this._isCustomValueAllowed() && (item === undefined);

        this.callBase(isUnknownItem ? null : item);

        if(!isUnknownItem && (!this._isEditable() || this._isCustomItemSelected())) {
            this._setListOption('selectedItem', this.option('selectedItem'));
        }
    },

    _isCustomValueAllowed: function() {
        return this.option('acceptCustomValue') || this.callBase();
    },

    _displayValue: function(item) {
        item = (!isDefined(item) && this._isCustomValueAllowed()) ? this.option('value') : item;
        return this.callBase(item);
    },

    _listConfig: function() {
        const result = extend(this.callBase(), {
            pageLoadMode: 'scrollBottom',
            onSelectionChanged: this._getSelectionChangeHandler(),
            selectedItem: this.option('selectedItem'),
            onFocusedItemChanged: this._listFocusedItemChangeHandler.bind(this)
        });

        if(this.option('showSelectionControls')) {
            extend(result, {
                showSelectionControls: true,
                selectionByClick: true
            });
        }

        return result;
    },

    _listFocusedItemChangeHandler: function(e) {
        if(this._preventInputValueRender) {
            return;
        }

        const list = e.component;
        const focusedElement = $(list.option('focusedElement'));
        const focusedItem = list._getItemData(focusedElement);

        this._updateField(focusedItem);
    },

    _updateField: function(item) {
        const fieldTemplate = this._getTemplateByOption('fieldTemplate');

        if(!(fieldTemplate && this.option('fieldTemplate'))) {
            const text = this._displayGetter(item);

            this.option('text', text);
            this._renderDisplayText(text);
            return;
        }

        this._renderField();
    },

    _getSelectionChangeHandler: function() {
        return this.option('showSelectionControls') ? this._selectionChangeHandler.bind(this) : noop;
    },

    _selectionChangeHandler: function(e) {
        each(e.addedItems || [], (function(_, addedItem) {
            this._setValue(this._valueGetter(addedItem));
        }).bind(this));
    },

    _getActualSearchValue: function() {
        return this._dataSource.searchValue();
    },

    _toggleOpenState: function(isVisible) {
        if(this.option('disabled')) {
            return;
        }

        isVisible = arguments.length ? isVisible : !this.option('opened');

        if(!isVisible) {
            this._restoreInputText(true);
        }

        if(this._wasSearch() && isVisible) {
            this._wasSearch(false);
            const showDataImmediately = this.option('showDataBeforeSearch') || this.option('minSearchLength') === 0;

            if(showDataImmediately && this._dataSource) {
                if(this._searchTimer) return;

                const searchValue = this._getActualSearchValue();
                searchValue && this._wasSearch(true);
                this._filterDataSource(searchValue || null);
            } else {
                this._setListOption('items', []);
            }
        }

        if(isVisible) {
            this._scrollToSelectedItem();
        }

        this.callBase(isVisible);
    },

    _renderTooltip: function() {
        if(this.option('tooltipEnabled')) {
            this.$element().attr('title', this.option('displayValue'));
        }
    },

    _renderDimensions: function() {
        this.callBase();
        this._dimensionChanged();
    },

    _isValueEqualInputText: function() {
        const initialSelectedItem = this.option('selectedItem');
        const value = this._displayGetter(initialSelectedItem);
        const displayValue = value ? String(value) : '';
        const inputText = this._searchValue();

        return displayValue === inputText;
    },

    _popupHidingHandler: function() {
        if(this._isValueEqualInputText()) {
            this._cancelEditing();
        }
        this.callBase();
    },

    _restoreInputText: function(saveEditingValue) {
        if(this.option('readOnly')) {
            return;
        }

        this._loadItemDeferred && this._loadItemDeferred.always((function() {
            const initialSelectedItem = this.option('selectedItem');

            if(this.option('acceptCustomValue')) {
                if(!saveEditingValue) {
                    this._updateField(initialSelectedItem);
                    this._clearFilter();
                }
                return;
            }

            if(this.option('searchEnabled')) {
                if(!this._searchValue() && this.option('allowClearing')) {
                    this._clearTextValue();
                    return;
                }
            }

            if(this._isValueEqualInputText()) {
                return;
            }

            this._renderInputValue().always((function(selectedItem) {
                const newSelectedItem = ensureDefined(selectedItem, initialSelectedItem);
                this._setSelectedItem(newSelectedItem);
                this._updateField(newSelectedItem);
                this._clearFilter();
            }).bind(this));
        }).bind(this));
    },

    _focusOutHandler: function(e) {
        if(!this._preventNestedFocusEvent(e)) {
            const isOverlayTarget = this._isOverlayNestedTarget(e.relatedTarget);
            if(!isOverlayTarget) {
                this._restoreInputText();
                this._clearSearchTimer();
            }

            const shouldCancelSearch = this._wasSearch() &&
                !this.option('acceptCustomValue') &&
                this.option('searchEnabled') &&
                this.option('opened') &&
                !isOverlayTarget;

            if(shouldCancelSearch) {
                this._searchCanceled();
            }
        }

        this.callBase(e);
    },

    _isOverlayNestedTarget: function(target) {
        return !!$(target).closest(`.${SELECTBOX_POPUP_WRAPPER_CLASS}`).length;
    },

    _clearTextValue: function() {
        if(this.option('selectedItem')) {
            if(this._savedTextRemoveEvent) {
                this._saveValueChangeEvent(this._savedTextRemoveEvent);
            }
            this.option('value', null);
        }
        delete this._savedTextRemoveEvent;
    },

    _shouldOpenPopup: function() {
        return this._needPassDataSourceToList();
    },

    _isFocused: function() {
        const activeElement = domAdapter.getActiveElement();
        return this.callBase() && $(activeElement).closest(this._input()).length > 0;
    },

    _renderValueChangeEvent: function() {
        if(this._isEditable()) {
            this.callBase();
        }
    },

    _isEditable: function() {
        return this.option('acceptCustomValue') || this.option('searchEnabled');
    },

    _fieldRenderData: function() {
        const $listFocused = this._list && this.option('opened') && $(this._list.option('focusedElement'));

        if($listFocused && $listFocused.length) {
            return this._list._getItemData($listFocused);
        }

        return this.option('selectedItem');
    },

    _readOnlyPropValue: function() {
        return !this._isEditable() || this.option('readOnly');
    },

    _isSelectedValue: function(value) {
        return this._isValueEquals(value, this.option('value'));
    },

    _shouldCloseOnItemClick: function() {
        return !(this.option('showSelectionControls') && this.option('selectionMode') !== 'single');
    },

    _listItemClickHandler: function(e) {
        const previousValue = this._getCurrentValue();
        this._focusListElement($(e.itemElement));

        this._saveValueChangeEvent(e.event);

        if(this._shouldClearFilter()) {
            this._clearFilter();
        }

        this._completeSelection(this._valueGetter(e.itemData));

        if(this._shouldCloseOnItemClick()) {
            this.option('opened', false);
        }

        if(this.option('searchEnabled') && previousValue === this._valueGetter(e.itemData)) {
            this._updateField(e.itemData);
        }
    },

    _shouldClearFilter: function() {
        return this._wasSearch();
    },

    _completeSelection: function(value) {
        this._setValue(value);
    },

    _loadItem: function(value, cache) {
        const that = this;
        const deferred = new Deferred();

        this.callBase(value, cache)
            .done((function(item) {
                deferred.resolve(item);
            }).bind(this))
            .fail((function() {
                const selectedItem = that.option('selectedItem');
                if(that.option('acceptCustomValue') && value === that._valueGetter(selectedItem)) {
                    deferred.resolve(selectedItem);
                } else {
                    deferred.reject();
                }
            }).bind(this));

        return deferred.promise();
    },

    _loadInputValue: function(value, callback) {
        this._loadItemDeferred = this._loadItem(value).always(callback);

        return this._loadItemDeferred;
    },

    _isCustomItemSelected: function() {
        const selectedItem = this.option('selectedItem');
        const searchValue = this._searchValue();
        const selectedItemText = this._displayGetter(selectedItem);

        return !selectedItemText || searchValue !== selectedItemText.toString();
    },

    _valueChangeEventHandler: function(e) {
        if(this.option('acceptCustomValue') && this._isCustomItemSelected() && !this._isValueChanging) {
            this._isValueChanging = true;
            this._customItemAddedHandler(e);
            this._isValueChanging = false;
        }
    },

    _initCustomItemCreatingAction: function() {
        this._customItemCreatingAction = this._createActionByOption('onCustomItemCreating');
    },

    _createCustomItem: function(text) {
        const params = {
            text: text
        };
        const actionResult = this._customItemCreatingAction(params);
        const item = ensureDefined(actionResult, params.customItem);

        if(isDefined(actionResult)) {
            errors.log('W0015', 'onCustomItemCreating', 'customItem');
        }

        return item;
    },

    _customItemAddedHandler: function(e) {
        const searchValue = this._searchValue();
        const item = this._createCustomItem(searchValue);

        this._saveValueChangeEvent(e);

        if(item === undefined) {
            this._renderValue();
            throw errors.Error('E0121');
        }

        if(isPromise(item)) {
            fromPromise(item)
                .done(this._setCustomItem.bind(this))
                .fail(this._setCustomItem.bind(this, null));
        } else {
            this._setCustomItem(item);
        }
    },

    _setCustomItem: function(item) {
        if(this._disposed) {
            return;
        }

        item = item || null;
        this.option('selectedItem', item);
        if(this._shouldClearFilter()) {
            this._filterDataSource(null);
        }
        this._setValue(this._valueGetter(item));
        this._renderDisplayText(this._displayGetter(item));
    },

    _clearValueHandler: function(e) {
        this.callBase(e);

        return false;
    },

    _wasSearch: function(value) {
        if(!arguments.length) {
            return this._wasSearchValue;
        }
        this._wasSearchValue = value;
    },

    _searchHandler: function(e) {
        if(this._preventFiltering) {
            delete this._preventFiltering;
            return;
        }

        if(this._needPassDataSourceToList()) {
            this._wasSearch(true);
        }

        this.callBase(e);
    },

    _dataSourceFiltered: function(searchValue) {
        this.callBase();

        if(searchValue !== null) {
            this._renderInputSubstitution();
            this._renderFocusedElement();
        }
    },

    _valueSubstituted: function() {
        const input = this._input().get(0);
        const isAllSelected = input.selectionStart === 0 && input.selectionEnd === this._searchValue().length;
        const inputHasSelection = input.selectionStart !== input.selectionEnd;

        return this._wasSearch() && inputHasSelection && !isAllSelected;
    },

    _shouldSubstitutionBeRendered: function() {
        return !this._preventSubstitution
            && this.option('searchEnabled')
            && !this.option('acceptCustomValue')
            && this.option('searchMode') === 'startswith';
    },

    _renderInputSubstitution: function() {
        if(!this._shouldSubstitutionBeRendered()) {
            delete this._preventSubstitution;
            return;
        }

        const item = this._list && this._getPlainItems(this._list.option('items'))[0];

        if(!item) {
            return;
        }

        const $input = this._input();
        const valueLength = $input.val().length;

        if(valueLength === 0) {
            return;
        }

        const inputElement = $input.get(0);
        const displayValue = this._displayGetter(item).toString();

        inputElement.value = displayValue;
        this._caret({ start: valueLength, end: displayValue.length });
    },

    _cleanInputSelection: function() {
        const inputElement = this._input().get(0);
        const endPosition = inputElement.value.length;
        inputElement.selectionStart = endPosition;
        inputElement.selectionEnd = endPosition;
    },

    _dispose: function() {
        this._renderInputValueAsync = noop;
        delete this._loadItemDeferred;
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onCustomItemCreating':
                this._initCustomItemCreatingAction();
                break;
            case 'tooltipEnabled':
                this._renderTooltip();
                break;
            case 'displayCustomValue':
            case 'acceptCustomValue':
            case 'showSelectionControls':
            case 'useInkRipple':
                this._invalidate();
                break;
            case 'allowClearing':
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        delete this._inkRipple;
        this.callBase();
    }
});

registerComponent('dxSelectBox', SelectBox);

export default SelectBox;
