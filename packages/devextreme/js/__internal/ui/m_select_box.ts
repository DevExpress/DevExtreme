import '@ts/ui/list/modules/m_selection';

import { normalizeKeyName } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import errors from '@js/core/errors';
import $ from '@js/core/renderer';
import { ensureDefined, noop } from '@js/core/utils/common';
// @ts-expect-error
import { Deferred, fromPromise } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isPromise } from '@js/core/utils/type';
import DropDownList from '@js/ui/drop_down_editor/ui.drop_down_list';

const DISABLED_STATE_SELECTOR = '.dx-state-disabled';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_CLASS = 'dx-selectbox-popup';
const SELECTBOX_CONTAINER_CLASS = 'dx-selectbox-container';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';

const SelectBox = (DropDownList as any).inherit({

  _supportedKeys() {
    const that = this;
    const parent = this.callBase();
    const clearSelectBox = function (e) {
      const isEditable = this._isEditable();

      if (!isEditable) {
        if (this.option('showClearButton')) {
          e.preventDefault();
          this.clear();
        }
      } else if (this._valueSubstituted()) {
        this._preventFiltering = true;
      }
      this._savedTextRemoveEvent = e;
      this._preventSubstitution = true;
    };

    const searchIfNeeded = function () {
      if (that.option('searchEnabled') && that._valueSubstituted()) {
        that._searchHandler();
      }
    };

    return extend({}, parent, {
      tab() {
        if (this.option('opened') && !this._popup.getFocusableElements().length) {
          this._resetCaretPosition(true);
        }

        parent.tab && parent.tab.apply(this, arguments);

        this._cancelSearchIfNeed();
      },
      upArrow(e) {
        if (parent.upArrow.apply(this, arguments)) {
          if (!this.option('opened')) {
            this._setNextValue(e);
          }
          return true;
        }
        return undefined;
      },
      downArrow(e) {
        if (parent.downArrow.apply(this, arguments)) {
          if (!this.option('opened')) {
            this._setNextValue(e);
          }
          return true;
        }
        return undefined;
      },
      leftArrow() {
        searchIfNeeded();
        parent.leftArrow?.apply(this, arguments);
      },
      rightArrow() {
        searchIfNeeded();
        parent.rightArrow && parent.rightArrow.apply(this, arguments);
      },
      home() {
        searchIfNeeded();
        parent.home && parent.home.apply(this, arguments);
      },
      end() {
        searchIfNeeded();
        parent.end && parent.end.apply(this, arguments);
      },
      escape() {
        const result = parent.escape && parent.escape.apply(this, arguments);
        this._cancelEditing();

        return result ?? true;
      },
      enter(e) {
        const isOpened = this.option('opened');
        const inputText = this._input().val().trim();
        const isCustomText = inputText && this._list && !this._list.option('focusedElement');

        if (!inputText && isDefined(this.option('value')) && this.option('allowClearing')) {
          this._saveValueChangeEvent(e);
          this.option({
            selectedItem: null,
            value: null,
          });

          this.close();
        } else {
          if (this.option('acceptCustomValue')) {
            e.preventDefault();

            if (isCustomText) {
              if (isOpened) this._toggleOpenState();
              this._valueChangeEventHandler(e);
            }

            return isOpened;
          }

          if (parent.enter && parent.enter.apply(this, arguments)) {
            return isOpened;
          }
        }
      },
      space(e) {
        const isOpened = this.option('opened');
        const isSearchEnabled = this.option('searchEnabled');
        const acceptCustomValue = this.option('acceptCustomValue');
        if (!isOpened || isSearchEnabled || acceptCustomValue) {
          return;
        }

        e.preventDefault();
        this._valueChangeEventHandler(e);
        return true;
      },
      backspace: clearSelectBox,
      del: clearSelectBox,
    });
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
      placeholder: messageLocalization.format('Select'),

      fieldTemplate: null,

      customItemCreateEvent: 'change',

      valueChangeEvent: 'change',

      acceptCustomValue: false,

      onCustomItemCreating(e) {
        if (!isDefined(e.customItem)) {
          e.customItem = e.text;
        }
      },

      showSelectionControls: false,

      allowClearing: true,

      tooltipEnabled: false,

      openOnFieldClick: true,

      showDropDownButton: true,

      displayCustomValue: false,

      useHiddenSubmitElement: true,
    });
  },

  _init() {
    this.callBase();
    this._initCustomItemCreatingAction();
  },

  _initMarkup() {
    this.$element().addClass(SELECTBOX_CLASS);
    this._renderTooltip();

    this.callBase();
    this._$container.addClass(SELECTBOX_CONTAINER_CLASS);
  },

  _createPopup() {
    this.callBase();
    this._popup.$element().addClass(SELECTBOX_POPUP_CLASS);
    this._popup.$overlayContent().attr('tabindex', -1);
  },

  _popupWrapperClass() {
    return `${this.callBase()} ${SELECTBOX_POPUP_WRAPPER_CLASS}`;
  },

  _setDeprecatedOptions() {
    this.callBase();
    extend(this._deprecatedOptions, {
      valueChangeEvent: { since: '22.2', alias: 'customItemCreateEvent' },
    });
  },

  _cancelEditing() {
    if (!this.option('searchEnabled') && this._list) {
      this._focusListElement(null);
      this._updateField(this.option('selectedItem'));
    }
  },

  _renderOpenedState() {
    this.callBase();

    if (this.option('opened')) {
      this._scrollToSelectedItem();
      this._focusSelectedElement();
    }
  },

  _focusSelectedElement() {
    const searchValue = this._searchValue();

    if (!searchValue) {
      this._focusListElement(null);
      return;
    }

    const { items, selectedItem } = this.option();
    const $listItems = this._list._itemElements();
    const index = items?.indexOf(selectedItem) ?? -1;
    const focusedElement = index !== -1 && !this._isCustomItemSelected() ? $listItems.eq(index) : null;

    this._focusListElement(focusedElement);
  },

  _renderFocusedElement() {
    if (!this._list) {
      return;
    }

    const searchValue = this._searchValue();

    if (!searchValue || this.option('acceptCustomValue')) {
      this._focusListElement(null);
      return;
    }

    const $listItems = this._list._itemElements();
    const focusedElement = $listItems.not(DISABLED_STATE_SELECTOR).eq(0);

    this._focusListElement(focusedElement);
  },

  _focusListElement(element) {
    this._preventInputValueRender = true;
    this._list.option('focusedElement', getPublicElement(element));
    delete this._preventInputValueRender;
  },

  _scrollToSelectedItem() {
    this._list && this._list.scrollToItem(this._list.option('selectedItem'));
  },

  _listContentReadyHandler() {
    this.callBase();

    const isPaginate = this._dataController.paginate();

    if (isPaginate && this._needPopupRepaint()) {
      return;
    }

    this._scrollToSelectedItem();
  },

  _renderValue() {
    this._renderInputValue();
    this._setSubmitValue();

    return Deferred().resolve();
  },

  _renderInputValue() {
    return this.callBase().always(() => {
      this._renderInputValueAsync();
    });
  },

  _renderInputValueAsync() {
    this._renderTooltip();
    this._renderInputValueImpl().always(() => {
      this._refreshSelected();
    });
  },

  _renderInputValueImpl() {
    this._renderField();

    return Deferred().resolve();
  },

  _setNextItem(step) {
    const item = this._calcNextItem(step);
    const value = this._valueGetter(item);

    this._setValue(value);
  },

  _setNextValue(e) {
    const dataSourceIsLoaded = this._dataController.isLoaded()
      ? Deferred().resolve()
      : this._dataController.load();

    dataSourceIsLoaded.done(() => {
      const selectedIndex = this._getSelectedIndex();
      const hasPages = this._dataController.pageSize();
      const isLastPage = this._dataController.isLastPage();
      const isLastItem = selectedIndex === this._items().length - 1;

      this._saveValueChangeEvent(e);
      const step = normalizeKeyName(e) === 'downArrow' ? 1 : -1;

      if (hasPages && !isLastPage && isLastItem && step > 0) {
        if (!this._popup) {
          this._createPopup();
        }

        if (!this._dataController.isLoading()) {
          this._list._loadNextPage().done(this._setNextItem.bind(this, step));
        }
      } else {
        this._setNextItem(step);
      }
    });
  },

  _setSelectedItem(item) {
    const isUnknownItem = !this._isCustomValueAllowed() && (item === undefined);

    this.callBase(isUnknownItem ? null : item);

    if (!isUnknownItem && (!this._isEditable() || this._isCustomItemSelected())) {
      this._setListOption('selectedItem', this.option('selectedItem'));
    }
  },

  _isCustomValueAllowed() {
    return this.option('acceptCustomValue') || this.callBase();
  },

  _displayValue(item) {
    item = !isDefined(item) && this._isCustomValueAllowed() ? this.option('value') : item;
    return this.callBase(item);
  },

  _listConfig() {
    const result = extend(this.callBase(), {
      pageLoadMode: 'scrollBottom',
      onSelectionChanged: this._getSelectionChangeHandler(),
      selectedItem: this.option('selectedItem'),
      onFocusedItemChanged: this._listFocusedItemChangeHandler.bind(this),
      _onItemsRendered: (): void => {
        this._popup.repaint();
        if (this.option('opened')) {
          this._scrollToSelectedItem();
        }
      },
    });

    if (this.option('showSelectionControls')) {
      extend(result, {
        showSelectionControls: true,
        selectByClick: true,
      });
    }

    return result;
  },

  _listFocusedItemChangeHandler(e) {
    if (this._preventInputValueRender) {
      return;
    }

    const list = e.component;
    const focusedElement = $(list.option('focusedElement'));
    const focusedItem = list._getItemData(focusedElement);

    this._updateField(focusedItem);
  },

  _updateField(item) {
    const fieldTemplate = this._getTemplateByOption('fieldTemplate');

    if (!(fieldTemplate && this.option('fieldTemplate'))) {
      const text = this._displayGetter(item);

      this.option('text', text);
      this._renderDisplayText(text);
      return;
    }

    this._renderField();
  },

  _getSelectionChangeHandler() {
    return this.option('showSelectionControls') ? this._selectionChangeHandler.bind(this) : noop;
  },

  _selectionChangeHandler(e) {
    each(e.addedItems || [], (_, addedItem) => {
      this._setValue(this._valueGetter(addedItem));
    });
  },

  _getActualSearchValue() {
    return this._dataController.searchValue();
  },

  _isInlineAutocompleteEnabled() {
    return this.option('searchEnabled')
      && !this.option('acceptCustomValue')
      && this.option('searchMode') === 'startswith';
  },

  _getAriaAutocomplete() {
    const { disabled, readOnly, searchEnabled } = this.option();

    const isInputEditable = !(readOnly || disabled);
    const hasAutocomplete = searchEnabled && isInputEditable;

    if (!hasAutocomplete) {
      return 'none';
    }

    const isInlineAutocompleteEnabled = this._isInlineAutocompleteEnabled();

    const autocompleteAria = isInlineAutocompleteEnabled ? 'both' : 'list';

    return autocompleteAria;
  },

  _toggleOpenState(isVisible) {
    if (this.option('disabled')) {
      return;
    }

    isVisible = arguments.length ? isVisible : !this.option('opened');

    if (!isVisible && !this._shouldClearFilter()) {
      this._restoreInputText(true);
    }

    if (this._wasSearch() && isVisible) {
      this._wasSearch(false);
      const showDataImmediately = this.option('showDataBeforeSearch')
                || this._isMinSearchLengthExceeded();

      if (showDataImmediately && this._dataController.getDataSource()) {
        if (this._searchTimer) return;

        const searchValue = this._getActualSearchValue();
        searchValue && this._wasSearch(true);
        this._filterDataSource(searchValue || null);
      } else {
        this._setListOption('items', []);
      }
    }

    if (isVisible) {
      this._scrollToSelectedItem();
    }

    this.callBase(isVisible);
  },

  _renderTooltip() {
    if (this.option('tooltipEnabled')) {
      this.$element().attr('title', this.option('displayValue'));
    }
  },

  _renderDimensions() {
    this.callBase();

    this._updatePopupWidth();
    this._updateListDimensions();
  },

  _isValueEqualInputText() {
    const initialSelectedItem = this.option('selectedItem');

    if (initialSelectedItem === null) {
      return false;
    }

    const value = this._displayGetter(initialSelectedItem);
    const displayValue = value ? String(value) : '';
    const inputText = this._searchValue();

    return displayValue === inputText;
  },

  _popupHidingHandler() {
    if (this._isValueEqualInputText()) {
      this._cancelEditing();
    }
    this.callBase();
  },

  _popupHiddenHandler() {
    this.callBase();

    if (this._shouldCancelSearch()) {
      this._wasSearch(false);
      this._searchCanceled();
      this._shouldCancelSearch(false);
    }
  },

  _restoreInputText(saveEditingValue) {
    if (this.option('readOnly')) {
      return;
    }

    this._loadItemDeferred && this._loadItemDeferred.always(() => {
      const {
        acceptCustomValue,
        text,
        selectedItem: initialSelectedItem,
      } = this.option();

      if (acceptCustomValue) {
        if (!saveEditingValue && !this._isValueChanging) {
          this._updateField(initialSelectedItem ?? this._createCustomItem(text));
          this._clearFilter();
        }
        return;
      }

      if (this.option('searchEnabled')) {
        if (!this._searchValue() && this.option('allowClearing')) {
          this._clearTextValue();
          return;
        }
      }

      if (this._isValueEqualInputText()) {
        return;
      }

      this._renderInputValue().always((selectedItem) => {
        const newSelectedItem = ensureDefined(selectedItem, initialSelectedItem);
        this._setSelectedItem(newSelectedItem);
        this._updateField(newSelectedItem);
        this._clearFilter();
      });
    });
  },

  _valueChangeEventIncludesBlur() {
    const valueChangeEvent = this.option(this._getValueChangeEventOptionName());

    return valueChangeEvent.includes('blur');
  },

  _isPreventedFocusOutEvent(e) {
    return this._preventNestedFocusEvent(e) || this._valueChangeEventIncludesBlur();
  },

  _focusOutHandler(e) {
    if (!this._isPreventedFocusOutEvent(e)) {
      const isOverlayTarget = this._isOverlayNestedTarget(e.relatedTarget);

      if (!isOverlayTarget) {
        this._restoreInputText();
        this._clearSearchTimer();
      }

      this._cancelSearchIfNeed(e);
    }

    e.target = this._input().get(0);
    this.callBase(e);
  },

  _cancelSearchIfNeed(e) {
    const { searchEnabled } = this.option();
    const isOverlayTarget = this._isOverlayNestedTarget(e?.relatedTarget);

    const shouldCancelSearch = this._wasSearch()
            && searchEnabled
            && !isOverlayTarget;

    if (shouldCancelSearch) {
      const isPopupVisible = this._popup?._hideAnimationProcessing;
      this._clearSearchTimer();
      if (isPopupVisible) {
        this._shouldCancelSearch(true);
      } else {
        this._wasSearch(false);
        this._searchCanceled();
      }
    }
  },

  _shouldCancelSearch(value) {
    if (!arguments.length) {
      return this._shouldCancelSearchValue;
    }

    this._shouldCancelSearchValue = value;
  },

  _isOverlayNestedTarget(target) {
    return !!$(target).closest(`.${SELECTBOX_POPUP_WRAPPER_CLASS}`).length;
  },

  _clearTextValue() {
    const selectedItem = this.option('selectedItem');
    const selectedItemText = this._displayGetter(selectedItem);
    const shouldRestoreValue = selectedItem && selectedItemText !== '';

    if (shouldRestoreValue) {
      if (this._savedTextRemoveEvent) {
        this._saveValueChangeEvent(this._savedTextRemoveEvent);
      }
      this.option('value', null);
    }

    delete this._savedTextRemoveEvent;
  },

  _shouldOpenPopup() {
    return this._needPassDataSourceToList() && this._wasSearch();
  },

  _isFocused() {
    const activeElement = domAdapter.getActiveElement(this.element());
    return this.callBase() && $(activeElement).closest(this._input()).length > 0;
  },

  _getValueChangeEventOptionName() {
    return 'customItemCreateEvent';
  },

  _renderValueChangeEvent() {
    if (this._isEditable()) {
      this.callBase();
    }
  },

  _fieldRenderData() {
    const $listFocused = this._list && this.option('opened') && $(this._list.option('focusedElement'));

    if ($listFocused && $listFocused.length) {
      return this._list._getItemData($listFocused);
    }

    return this.option('selectedItem');
  },

  _isSelectedValue(value) {
    return this._isValueEquals(value, this.option('value'));
  },

  _shouldCloseOnItemClick() {
    return !(this.option('showSelectionControls') && this.option('selectionMode') !== 'single');
  },

  _listItemClickHandler(e) {
    const previousValue = this._getCurrentValue();
    this._focusListElement($(e.itemElement));

    this._saveValueChangeEvent(e.event);

    this._completeSelection(this._valueGetter(e.itemData));

    if (this._shouldCloseOnItemClick()) {
      this.option('opened', false);
    }

    if (this.option('searchEnabled') && previousValue === this._valueGetter(e.itemData)) {
      this._updateField(e.itemData);
    }

    if (this._shouldClearFilter()) {
      this._cancelSearchIfNeed();
    }
  },

  _shouldClearFilter() {
    return this._wasSearch();
  },

  _completeSelection(value) {
    this._setValue(value);
  },

  _loadItem(value, cache) {
    const that = this;
    const deferred = Deferred();

    this.callBase(value, cache)
      .done((item) => {
        deferred.resolve(item);
      })
      .fail((args) => {
        if (args?.shouldSkipCallback) {
          return;
        }

        const selectedItem = that.option('selectedItem');
        if (that.option('acceptCustomValue') && value === that._valueGetter(selectedItem)) {
          deferred.resolve(selectedItem);
        } else {
          deferred.reject();
        }
      });

    return deferred.promise();
  },

  _loadInputValue(value, callback) {
    this._loadItemDeferred = this._loadItem(value).always(callback);

    return this._loadItemDeferred;
  },

  _isCustomItemSelected() {
    const selectedItem = this.option('selectedItem');
    const searchValue = this._searchValue();
    const selectedItemText = this._displayGetter(selectedItem);

    return !selectedItemText || searchValue !== selectedItemText.toString();
  },

  _valueChangeEventHandler(e) {
    if (this.option('acceptCustomValue') && this._isCustomItemSelected() && !this._isValueChanging) {
      this._isValueChanging = true;
      this._customItemAddedHandler(e);
    }
  },

  _initCustomItemCreatingAction() {
    this._customItemCreatingAction = this._createActionByOption('onCustomItemCreating');
  },

  _createCustomItem(text) {
    const params = {
      text,
    } as any;
    const actionResult = this._customItemCreatingAction(params);
    const item = ensureDefined(actionResult, params.customItem);

    if (isDefined(actionResult)) {
      errors.log('W0015', 'onCustomItemCreating', 'customItem');
    }

    return item;
  },

  _customItemAddedHandler(e) {
    const searchValue = this._searchValue();

    const item = this._createCustomItem(searchValue);

    this._saveValueChangeEvent(e);

    if (item === undefined) {
      this._renderValue();
      throw errors.Error('E0121');
    }

    if (isPromise(item)) {
      fromPromise(item)
        .done(this._setCustomItem.bind(this))
        .fail(this._setCustomItem.bind(this, null));
    } else {
      this._setCustomItem(item);
    }
  },

  _setCustomItem(item) {
    if (this._disposed) {
      return;
    }

    item = item || null;
    this.option('selectedItem', item);
    this._cancelSearchIfNeed();
    this._setValue(this._valueGetter(item));
    this._renderDisplayText(this._displayGetter(item));
    this._isValueChanging = false;
  },

  _clearValueHandler(e) {
    this._preventFiltering = true;
    this.callBase(e);
    this._searchCanceled();

    return false;
  },

  _wasSearch(value) {
    if (!arguments.length) {
      return !!this._wasSearchValue;
    }
    this._wasSearchValue = value;

    return undefined;
  },

  _searchHandler() {
    if (this._preventFiltering) {
      delete this._preventFiltering;
      return;
    }

    if (this._needPassDataSourceToList()) {
      this._wasSearch(true);
    }

    this.callBase(arguments);
  },

  _dataSourceFiltered(searchValue) {
    this.callBase();

    if (searchValue !== null) {
      this._renderInputSubstitution();
      this._renderFocusedElement();
    }
  },

  _valueSubstituted() {
    const input = this._input().get(0);
    const currentSearchLength = this._searchValue().length;
    const isAllSelected = input.selectionStart === 0 && input.selectionEnd === currentSearchLength;
    const inputHasSelection = input.selectionStart !== input.selectionEnd;
    const isLastSymbolSelected = currentSearchLength === input.selectionEnd;

    return this._wasSearch() && inputHasSelection && !isAllSelected && isLastSymbolSelected && this._shouldSubstitutionBeRendered();
  },

  _shouldSubstitutionBeRendered() {
    return !this._preventSubstitution && this._isInlineAutocompleteEnabled();
  },

  _renderInputSubstitution() {
    if (!this._shouldSubstitutionBeRendered()) {
      delete this._preventSubstitution;
      return;
    }

    const item = this._list && this._getPlainItems(this._list.option('items'))[0];

    if (!item) {
      return;
    }

    const $input = this._input();
    const valueLength = $input.val().length;

    if (valueLength === 0) {
      return;
    }

    const inputElement = $input.get(0);
    const displayValue = this._displayGetter(item).toString();

    inputElement.value = displayValue;
    this._caret({ start: valueLength, end: displayValue.length });
  },

  _dispose() {
    this._renderInputValueAsync = noop;
    delete this._loadItemDeferred;
    this.callBase();
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'customItemCreateEvent':
        this._refreshValueChangeEvent();
        this._refreshFocusEvent();
        this._refreshEvents();
        break;
      case 'onCustomItemCreating':
        this._initCustomItemCreatingAction();
        break;
      case 'tooltipEnabled':
        this._renderTooltip();
        break;
      case 'readOnly':
      case 'disabled':
      case 'searchMode':
        this.callBase(args);
        this._setDefaultAria();
        break;
      case 'displayCustomValue':
      case 'acceptCustomValue':
      case 'showSelectionControls':
        this._invalidate();
        break;
      case 'allowClearing':
        break;
      default:
        this.callBase(args);
    }
  },
});

registerComponent('dxSelectBox', SelectBox);

export default SelectBox;
