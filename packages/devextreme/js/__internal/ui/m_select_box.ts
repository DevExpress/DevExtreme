import '@ts/ui/list/modules/selection';

import type { SingleOrMultiple } from '@js/common';
import { normalizeKeyName } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import errors from '@js/core/errors';
import $ from '@js/core/renderer';
import { ensureDefined, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import {
  Deferred,
  // @ts-expect-error ts-error
  fromPromise,
} from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isPromise } from '@js/core/utils/type';
import type { Properties } from '@js/ui/select_box';
import DropDownList from '@ts/ui/drop_down_editor/m_drop_down_list';

import type { ValueChangedEvent } from './editor/editor';

// STYLE selectBox

const DISABLED_STATE_SELECTOR = '.dx-state-disabled';
export const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_CLASS = 'dx-selectbox-popup';
const SELECTBOX_CONTAINER_CLASS = 'dx-selectbox-container';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';

interface SelectBoxProperties extends Omit<Properties,
'onItemClick' | 'onSelectionChanged'
| 'onOpened' | 'onClosed'
| 'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'
| 'onValueChanged' | 'validationMessagePosition' | 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
  selectionMode?: SingleOrMultiple;

  tooltipEnabled?: boolean;
}

class SelectBox<
  TProperties extends SelectBoxProperties = SelectBoxProperties,
> extends DropDownList<TProperties> {
  _loadItemDeferred?: DeferredObj<unknown>;

  _isValueChanging?: boolean;

  _preventSubstitution?: boolean;

  _wasSearchValue?: boolean;

  _preventFiltering?: boolean;

  _shouldCancelSearchValue?: boolean;

  _customItemCreatingAction!: (event?: Record<string, unknown>) => void;

  _savedTextRemoveEvent?: ValueChangedEvent;

  _preventInputValueRender?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | void> {
    const that = this;
    const parent = super._supportedKeys();
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

    return {
      ...parent,
      tab(): void {
        const { opened } = this.option();
        const popupHasFocusableElements = opened && !!this._popup.getFocusableElements().length;
        if (!popupHasFocusableElements) {
          this._resetCaretPosition(true);
        }
        // @ts-expect-error ts-error
        parent.tab && parent.tab.apply(this, arguments);

        if (!popupHasFocusableElements) {
          this._cancelSearchIfNeed();
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      upArrow(e): boolean | void {
        // @ts-expect-error ts-error
        if (parent.upArrow.apply(this, arguments)) {
          if (!this.option('opened')) {
            this._setNextValue(e);
          }
          return true;
        }
        return undefined;
      },
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      downArrow(e): boolean | void {
        // @ts-expect-error ts-error
        if (parent.downArrow.apply(this, arguments)) {
          if (!this.option('opened')) {
            this._setNextValue(e);
          }
          return true;
        }
        return undefined;
      },
      leftArrow(): void {
        searchIfNeeded();
        // @ts-expect-error ts-error
        parent.leftArrow?.apply(this, arguments);
      },
      rightArrow(): void {
        searchIfNeeded();
        // @ts-expect-error ts-error
        parent.rightArrow?.apply(this, arguments);
      },
      home(): void {
        searchIfNeeded();
        // @ts-expect-error ts-error
        parent.home?.apply(this, arguments);
      },
      end(): void {
        searchIfNeeded();
        // @ts-expect-error ts-error
        parent.end?.apply(this, arguments);
      },
      escape() {
        // @ts-expect-error ts-error
        const result = parent.escape?.apply(this, arguments);
        this._cancelEditing();

        return result ?? true;
      },
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      enter(e): boolean | void {
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
          // @ts-expect-error ts-error
          if (parent.enter?.apply(this, arguments)) {
            return isOpened;
          }
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      space(e): boolean | void {
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
    };
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      placeholder: messageLocalization.format('Select'),
      fieldTemplate: null,
      customItemCreateEvent: 'change',
      acceptCustomValue: false,
      onCustomItemCreating(e): void {
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
    };
  }

  _init(): void {
    super._init();
    this._initCustomItemCreatingAction();
  }

  _initMarkup(): void {
    this.$element().addClass(SELECTBOX_CLASS);
    this._renderTooltip();

    super._initMarkup();
    this._$container.addClass(SELECTBOX_CONTAINER_CLASS);
  }

  _createPopup(): void {
    super._createPopup();
    // @ts-expect-error ts-error
    this._popup.$element().addClass(SELECTBOX_POPUP_CLASS);
    // @ts-expect-error ts-error
    this._popup.$overlayContent().attr('tabindex', -1);
  }

  _popupWrapperClass(): string {
    return `${super._popupWrapperClass()} ${SELECTBOX_POPUP_WRAPPER_CLASS}`;
  }

  _cancelEditing(): void {
    if (!this.option('searchEnabled') && this._list) {
      this._focusListElement(null);
      this._updateField(this.option('selectedItem'));
    }
  }

  _renderOpenedState(): void {
    super._renderOpenedState();

    if (this.option('opened')) {
      this._scrollToSelectedItem();
      this._focusSelectedElement();
    }
  }

  _focusSelectedElement(): void {
    const searchValue = this._searchValue();

    if (!searchValue) {
      this._focusListElement(null);
      return;
    }

    const { items, selectedItem } = this.option();
    // @ts-expect-error ts-error
    const $listItems = this._list._itemElements();
    const index = items?.indexOf(selectedItem) ?? -1;
    const focusedElement = index !== -1 && !this._isCustomItemSelected() ? $listItems.eq(index) : null;

    this._focusListElement(focusedElement);
  }

  _renderFocusedElement(): void {
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
  }

  _focusListElement(element): void {
    this._preventInputValueRender = true;
    // @ts-expect-error ts-error
    this._list.option('focusedElement', getPublicElement(element));
    delete this._preventInputValueRender;
  }

  _scrollToSelectedItem(): void {
    if (!this._list) {
      return;
    }

    const { selectedItem } = this._list.option();
    this._list.scrollToItem(selectedItem);
  }

  _listContentReadyHandler(): void {
    super._listContentReadyHandler();

    const isPaginate = this._dataController.paginate();

    if (isPaginate && this._needPopupRepaint()) {
      return;
    }

    this._scrollToSelectedItem();
  }

  _renderValue(): DeferredObj<unknown> {
    this._renderInputValue();
    this._setSubmitValue();

    return Deferred().resolve();
  }

  _renderInputValue(...args) {
    return super._renderInputValue(...args).always(() => {
      this._renderInputValueAsync();
    });
  }

  _renderInputValueAsync(): void {
    this._renderTooltip();
    this._renderInputValueImpl().always(() => {
      this._refreshSelected();
    });
  }

  _renderInputValueImpl(): DeferredObj<unknown> {
    this._renderField();

    return Deferred().resolve();
  }

  _setNextItem(step): void {
    const item = this._calcNextItem(step);
    // @ts-expect-error ts-error
    const value = this._valueGetter(item);

    this._setValue(value);
  }

  _setNextValue(e): void {
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
          // @ts-expect-error ts-error
          this._list._loadNextPage().done(this._setNextItem.bind(this, step));
        }
      } else {
        this._setNextItem(step);
      }
    });
  }

  _setSelectedItem(item): void {
    const isUnknownItem = !this._isCustomValueAllowed() && (item === undefined);

    super._setSelectedItem(isUnknownItem ? null : item);

    if (!isUnknownItem && (!this._isEditable() || this._isCustomItemSelected())) {
      this._setListOption('selectedItem', this.option('selectedItem'));
    }
  }

  _isCustomValueAllowed() {
    return this.option('acceptCustomValue') || super._isCustomValueAllowed();
  }

  _displayValue(item) {
    item = !isDefined(item) && this._isCustomValueAllowed() ? this.option('value') : item;
    return super._displayValue(item);
  }

  _listConfig() {
    const result = extend(super._listConfig(), {
      pageLoadMode: 'scrollBottom',
      onSelectionChanged: this._getSelectionChangeHandler(),
      selectedItem: this.option('selectedItem'),
      onFocusedItemChanged: this._listFocusedItemChangeHandler.bind(this),
      _onItemsRendered: (): void => {
        this._popup!.repaint();
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
  }

  _listFocusedItemChangeHandler(e): void {
    if (this._preventInputValueRender) {
      return;
    }

    const list = e.component;
    const focusedElement = $(list.option('focusedElement'));
    const focusedItem = list._getItemData(focusedElement);

    this._updateField(focusedItem);
  }

  _updateField(item): void {
    const { fieldTemplate: fieldTemplateOption } = this.option();
    const fieldTemplate = this._getTemplate(fieldTemplateOption);

    if (!(fieldTemplate && fieldTemplateOption)) {
      // @ts-expect-error ts-error
      const text = this._displayGetter(item);

      this.option('text', text);
      this._renderDisplayText(text);
      return;
    }

    this._renderField();
  }

  _getSelectionChangeHandler() {
    return this.option('showSelectionControls') ? this._selectionChangeHandler.bind(this) : noop;
  }

  _selectionChangeHandler(e): void {
    each(e.addedItems || [], (_, addedItem) => {
      // @ts-expect-error ts-error
      this._setValue(this._valueGetter(addedItem));
    });
  }

  _getActualSearchValue() {
    return this._dataController.searchValue();
  }

  _isInlineAutocompleteEnabled(): boolean | undefined {
    const { searchEnabled, acceptCustomValue, searchMode } = this.option();

    return searchEnabled
      && !acceptCustomValue
      && searchMode === 'startswith';
  }

  _getAriaAutocomplete(): string {
    const { disabled, readOnly, searchEnabled } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const isInputEditable = !(readOnly || disabled);
    const hasAutocomplete = searchEnabled && isInputEditable;

    if (!hasAutocomplete) {
      return 'none';
    }

    const isInlineAutocompleteEnabled = this._isInlineAutocompleteEnabled();

    const autocompleteAria = isInlineAutocompleteEnabled ? 'both' : 'list';

    return autocompleteAria;
  }

  _toggleOpenState(isVisible?: boolean): void {
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

    super._toggleOpenState(isVisible);
  }

  _renderTooltip(): void {
    const { tooltipEnabled, displayValue } = this.option();

    if (tooltipEnabled) {
      // @ts-expect-error ts-error
      this.$element().attr('title', displayValue);
    }
  }

  _renderDimensions(): void {
    super._renderDimensions();

    this._updatePopupWidth();
    this._updateListDimensions();
  }

  _isValueEqualInputText(): boolean {
    const initialSelectedItem = this.option('selectedItem');

    if (initialSelectedItem === null) {
      return false;
    }

    // @ts-expect-error ts-error
    const value = this._displayGetter(initialSelectedItem);
    const displayValue = value ? String(value) : '';
    const inputText = this._searchValue();
    return displayValue === inputText;
  }

  _popupHidingHandler() {
    if (this._isValueEqualInputText()) {
      this._cancelEditing();
    }
    super._popupHidingHandler();
  }

  _popupHiddenHandler() {
    super._popupHiddenHandler();

    if (this._shouldCancelSearch()) {
      this._wasSearch(false);
      this._searchCanceled();
      this._shouldCancelSearch(false);
    }
  }

  _restoreInputText(saveEditingValue?) {
    if (this.option('readOnly')) {
      return;
    }

    this._loadItemDeferred?.always(() => {
      const {
        acceptCustomValue,
        text,
        selectedItem: initialSelectedItem,
        customItemCreateEvent,
      } = this.option();

      if (acceptCustomValue) {
        if (!saveEditingValue && !this._isValueChanging) {
          let initialItem = null;

          if (isDefined(initialSelectedItem)) {
            initialItem = initialSelectedItem;
          } else if (customItemCreateEvent !== '') {
            initialItem = this._createCustomItem(text);
          }

          this._updateField(initialItem);
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
  }

  _valueChangeEventIncludesBlur() {
    const valueChangeEvent = this.option(this._getValueChangeEventOptionName());
    // @ts-expect-error
    return valueChangeEvent.includes('blur');
  }

  _isPreventedFocusOutEvent(e) {
    return this._preventNestedFocusEvent(e) || this._valueChangeEventIncludesBlur();
  }

  _focusOutHandler(e): void {
    if (!this._isPreventedFocusOutEvent(e)) {
      const isOverlayTarget = this._isOverlayNestedTarget(e.relatedTarget);

      if (!isOverlayTarget) {
        this._restoreInputText();
        this._clearSearchTimer();
      }

      this._cancelSearchIfNeed(e);
    }

    e.target = this._input().get(0);
    super._focusOutHandler(e);
  }

  _cancelSearchIfNeed(e?): void {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _shouldCancelSearch(value?): boolean | void {
    if (!arguments.length) {
      return this._shouldCancelSearchValue;
    }

    this._shouldCancelSearchValue = value;
  }

  _isOverlayNestedTarget(target): boolean {
    return !!$(target).closest(`.${SELECTBOX_POPUP_WRAPPER_CLASS}`).length;
  }

  _clearTextValue(): void {
    const selectedItem = this.option('selectedItem');
    // @ts-expect-error ts-error
    const selectedItemText = this._displayGetter(selectedItem);
    const shouldRestoreValue = selectedItem && selectedItemText !== '';

    if (shouldRestoreValue) {
      if (this._savedTextRemoveEvent) {
        this._saveValueChangeEvent(this._savedTextRemoveEvent);
      }
      this.option('value', null);
    }

    delete this._savedTextRemoveEvent;
  }

  _shouldOpenPopup(): boolean {
    // @ts-expect-error ts-error
    return this._needPassDataSourceToList() && this._wasSearch();
  }

  _isFocused(): boolean {
    const activeElement = domAdapter.getActiveElement(this.element());
    return super._isFocused() && $(activeElement).closest(this._input()).length > 0;
  }

  _getValueChangeEventOptionName(): keyof TProperties {
    return 'customItemCreateEvent';
  }

  _renderValueChangeEvent(): void {
    if (this._isEditable()) {
      super._renderValueChangeEvent();
    }
  }

  _fieldRenderData() {
    // @ts-expect-error ts-error
    const { focusedElement } = this.option();

    const $listFocused = this._list && this.option('opened') && $(focusedElement);

    if ($listFocused?.length) {
      // @ts-expect-error ts-error
      return this._list._getItemData($listFocused);
    }

    return this.option('selectedItem');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isSelectedValue(value, cache?) {
    // @ts-expect-error ts-error
    return this._isValueEquals(value, this.option('value'));
  }

  _shouldCloseOnItemClick() {
    const { selectionMode } = this.option();

    return !(this.option('showSelectionControls') && selectionMode !== 'single');
  }

  _listItemClickHandler(e) {
    // @ts-expect-error ts-error
    const previousValue = this._getCurrentValue();
    this._focusListElement($(e.itemElement));

    this._saveValueChangeEvent(e.event);
    // @ts-expect-error ts-error
    this._completeSelection(this._valueGetter(e.itemData));

    if (this._shouldCloseOnItemClick()) {
      this.option('opened', false);
    }
    // @ts-expect-error ts-error
    if (this.option('searchEnabled') && previousValue === this._valueGetter(e.itemData)) {
      this._updateField(e.itemData);
    }

    if (this._shouldClearFilter()) {
      this._cancelSearchIfNeed();
    }
  }

  _shouldClearFilter(): boolean | undefined {
    return this._wasSearch();
  }

  _completeSelection(value): void {
    this._setValue(value);
  }

  _loadItem(value, cache?): DeferredObj<unknown> {
    const that = this;
    const deferred = Deferred();

    super._loadItem(value, cache)
      .done((item) => {
        deferred.resolve(item);
      })
      .fail((args) => {
        if (args?.shouldSkipCallback) {
          return;
        }

        const selectedItem = that.option('selectedItem');
        // @ts-expect-error ts-error
        if (that.option('acceptCustomValue') && value === that._valueGetter(selectedItem)) {
          deferred.resolve(selectedItem);
        } else {
          deferred.reject();
        }
      });
    // @ts-expect-error ts-error
    return deferred.promise();
  }

  _loadInputValue(value, callback) {
    this._loadItemDeferred = this._loadItem(value).always(callback);

    return this._loadItemDeferred;
  }

  _isCustomItemSelected() {
    const selectedItem = this.option('selectedItem');
    const searchValue = this._searchValue();
    // @ts-expect-error ts-error
    const selectedItemText = this._displayGetter(selectedItem);

    return !selectedItemText || searchValue !== selectedItemText.toString();
  }

  _valueChangeEventHandler(e): void {
    if (this.option('acceptCustomValue') && this._isCustomItemSelected() && !this._isValueChanging) {
      this._isValueChanging = true;
      this._customItemAddedHandler(e);
    }
  }

  _initCustomItemCreatingAction(): void {
    this._customItemCreatingAction = this._createActionByOption('onCustomItemCreating');
  }

  _createCustomItem(text) {
    const params = {
      text,
    };
    const actionResult = this._customItemCreatingAction(params);
    // @ts-expect-error ts-error
    const item = ensureDefined(actionResult, params.customItem);

    if (isDefined(actionResult)) {
      errors.log('W0015', 'onCustomItemCreating', 'customItem');
    }

    return item;
  }

  _customItemAddedHandler(e): void {
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
  }

  _setCustomItem(item): void {
    if (this._disposed) {
      return;
    }

    item = item || null;
    this.option('selectedItem', item);
    this._cancelSearchIfNeed();
    // @ts-expect-error ts-error
    this._setValue(this._valueGetter(item));
    // @ts-expect-error ts-error
    this._renderDisplayText(this._displayGetter(item));
    this._isValueChanging = false;
  }

  _clearValueHandler(e): boolean {
    this._preventFiltering = true;
    super._clearValueHandler(e);
    this._searchCanceled();

    return false;
  }

  _wasSearch(value?): boolean | undefined {
    if (!arguments.length) {
      return !!this._wasSearchValue;
    }
    this._wasSearchValue = value;

    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _searchHandler(e?): void {
    if (this._preventFiltering) {
      delete this._preventFiltering;
      return;
    }

    if (this._needPassDataSourceToList()) {
      this._wasSearch(true);
    }

    super._searchHandler(arguments);
  }

  _dataSourceFiltered(searchValue?): void {
    super._dataSourceFiltered();

    if (searchValue !== null) {
      this._renderInputSubstitution();
      this._renderFocusedElement();
    }
  }

  _valueSubstituted() {
    const input = this._input().get(0) as HTMLInputElement;
    const currentSearchLength = this._searchValue().length;
    const isAllSelected = input.selectionStart === 0 && input.selectionEnd === currentSearchLength;
    const inputHasSelection = input.selectionStart !== input.selectionEnd;
    const isLastSymbolSelected = currentSearchLength === input.selectionEnd;

    return this._wasSearch() && inputHasSelection && !isAllSelected && isLastSymbolSelected && this._shouldSubstitutionBeRendered();
  }

  _shouldSubstitutionBeRendered() {
    return !this._preventSubstitution && this._isInlineAutocompleteEnabled();
  }

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

    const inputElement = $input.get(0) as HTMLInputElement;
    // @ts-expect-error ts-error
    const displayValue = this._displayGetter(item).toString();
    inputElement.value = displayValue;
    this._caret({ start: valueLength, end: displayValue.length });
  }

  // eslint-disable-next-line class-methods-use-this
  _shouldLogFieldTemplateDeprecationWarning(): boolean {
    return true;
  }

  _dispose(): void {
    this._renderInputValueAsync = noop;
    delete this._loadItemDeferred;
    super._dispose();
  }

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
        super._optionChanged(args);
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
        super._optionChanged(args);
    }
  }
}

registerComponent('dxSelectBox', SelectBox);

export default SelectBox;
