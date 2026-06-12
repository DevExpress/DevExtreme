import '@ts/ui/list/modules/selection';

import type { SingleOrMultiple } from '@js/common';
import { normalizeKeyName } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import errors from '@js/core/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ensureDefined, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import {
  Deferred,
  // @ts-expect-error type on Deferred level
  fromPromise,
} from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isPromise } from '@js/core/utils/type';
import type { DxEvent, EventInfo } from '@js/events';
import type dxList from '@js/ui/list';
import { type Item, type ItemClickEvent, type SelectionChangedEvent } from '@js/ui/list';
import type { Properties } from '@js/ui/select_box';
import type { OptionChanged } from '@ts/core/widget/types';
import type { ItemCache } from '@ts/ui/drop_down_editor/drop_down_list';
import DropDownList from '@ts/ui/drop_down_editor/drop_down_list';
import type { ListBaseProperties } from '@ts/ui/list/list.base';

import type { ValueChangedEvent } from './editor/editor';

// STYLE selectBox

const DISABLED_STATE_SELECTOR = '.dx-state-disabled';
export const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_CLASS = 'dx-selectbox-popup';
const SELECTBOX_CONTAINER_CLASS = 'dx-selectbox-container';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';

interface RenderInputValueArgs { value?: unknown; renderOnly?: boolean }

interface SelectBoxProperties extends Omit<Properties,
'onItemClick' | 'onSelectionChanged'
| 'onOpened' | 'onClosed'
| 'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'
| 'onValueChanged' | 'validationMessagePosition' | 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
  selectionMode?: SingleOrMultiple;

  tooltipEnabled?: boolean;

  allowClearing?: boolean;

  focusedElement?: dxElementWrapper | null;
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

  _savedTextRemoveEvent?: KeyboardEvent;

  _preventInputValueRender?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | void> {
    const parent = super._supportedKeys();
    const clearSelectBox = (e: KeyboardEvent): void => {
      const { showClearButton } = this.option();
      const isEditable = this._isEditable();

      if (!isEditable) {
        if (showClearButton) {
          e.preventDefault();
          this.clear();
        }
      } else if (this._valueSubstituted()) {
        this._preventFiltering = true;
      }

      this._savedTextRemoveEvent = e;
      this._preventSubstitution = true;
    };

    const searchIfNeeded = (): void => {
      const { searchEnabled } = this.option();
      if (searchEnabled && this._valueSubstituted()) {
        this._searchHandler();
      }
    };

    return {
      ...parent,
      tab: (e: KeyboardEvent): void => {
        const { opened } = this.option();
        const popupHasFocusableElements = opened && !!this._popup?.getFocusableElements().length;
        if (!popupHasFocusableElements) {
          this._resetCaretPosition(true);
        }
        parent.tab?.call(this, e);

        if (!popupHasFocusableElements) {
          this._cancelSearchIfNeed();
        }
      },
      upArrow: (e: KeyboardEvent): boolean | undefined => {
        if (parent.upArrow.call(this, e)) {
          const { opened } = this.option();
          if (!opened) {
            this._setNextValue(e);
          }
          return true;
        }
        return undefined;
      },
      downArrow: (e: KeyboardEvent): boolean | undefined => {
        if (parent.downArrow.call(this, e)) {
          const { opened } = this.option();
          if (!opened) {
            this._setNextValue(e);
          }
          return true;
        }
        return undefined;
      },
      leftArrow: (e: KeyboardEvent): void => {
        searchIfNeeded();
        parent.leftArrow?.call(this, e);
      },
      rightArrow: (e: KeyboardEvent): void => {
        searchIfNeeded();
        parent.rightArrow?.call(this, e);
      },
      home: (e: KeyboardEvent): void => {
        searchIfNeeded();
        parent.home?.call(this, e);
      },
      end: (e: KeyboardEvent): void => {
        searchIfNeeded();
        parent.end?.call(this, e);
      },
      escape: (e: KeyboardEvent): boolean => {
        const result = parent.escape?.call(this, e);
        this._cancelEditing();

        return result ?? true;
      },
      enter: (e: KeyboardEvent): boolean | undefined => {
        const {
          opened, value, acceptCustomValue, allowClearing,
        } = this.option();
        const inputText = this._input().val().trim();
        const { focusedElement } = this._list?.option() ?? {};
        const isCustomText = inputText && this._list && !focusedElement;

        if (!inputText && isDefined(value) && allowClearing) {
          this._saveValueChangeEvent(e);
          this.option({
            selectedItem: null,
            value: null,
          });

          this.close();
        } else {
          if (acceptCustomValue) {
            e.preventDefault();

            if (isCustomText) {
              if (opened) this._toggleOpenState();
              this._valueChangeEventHandler(e);
            }

            return opened;
          }
          if (parent.enter?.call(this, e)) {
            return opened;
          }
        }

        return undefined;
      },
      space: (e: KeyboardEvent): boolean | undefined => {
        const { opened, searchEnabled, acceptCustomValue } = this.option();
        if (!opened || searchEnabled || acceptCustomValue) {
          return undefined;
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
    this._popup?.$element().addClass(SELECTBOX_POPUP_CLASS);
    this._popup?.$overlayContent().attr('tabindex', -1);
  }

  _popupWrapperClass(): string {
    return `${super._popupWrapperClass()} ${SELECTBOX_POPUP_WRAPPER_CLASS}`;
  }

  _cancelEditing(): void {
    const { searchEnabled, selectedItem } = this.option();

    if (!searchEnabled && this._list) {
      this._focusListElement(null);
      this._updateField(selectedItem);
    }
  }

  _renderOpenedState(): void {
    super._renderOpenedState();

    const { opened } = this.option();

    if (opened) {
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

    const $listItems = this._list?._itemElements();
    const index = items?.indexOf(selectedItem) ?? -1;
    const focusedElement = index !== -1 && !this._isCustomItemSelected()
      ? $listItems?.eq(index)
      : null;

    this._focusListElement(focusedElement);
  }

  _renderFocusedElement(): void {
    if (!this._list) {
      return;
    }

    const { acceptCustomValue } = this.option();
    const searchValue = this._searchValue();

    if (!searchValue || acceptCustomValue) {
      this._focusListElement(null);
      return;
    }
    const $listItems = this._list._itemElements();
    const focusedElement = $listItems.not(DISABLED_STATE_SELECTOR).eq(0);

    this._focusListElement(focusedElement);
  }

  _focusListElement(element?: dxElementWrapper | null): void {
    this._preventInputValueRender = true;
    this._list?.option('focusedElement', element ? getPublicElement(element) : null);
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

  _renderInputValue(args: RenderInputValueArgs = {}): DeferredObj<unknown> {
    return super._renderInputValue(args).always(() => {
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

  _setNextItem(step: number): void {
    const item = this._calcNextItem(step);
    // @ts-expect-error DataExpressionMixin
    const value = this._valueGetter(item);

    this._setValue(value);
  }

  _setNextValue(e: KeyboardEvent): void {
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
          this._list?._loadNextPage().done(this._setNextItem.bind(this, step));
        }
      } else {
        this._setNextItem(step);
      }
    });
  }

  _setSelectedItem(item?: Item | null): void {
    const isUnknownItem = !this._isCustomValueAllowed() && (item === undefined);

    super._setSelectedItem(isUnknownItem ? null : item);

    if (!isUnknownItem && (!this._isEditable() || this._isCustomItemSelected())) {
      const { selectedItem } = this.option();
      this._setListOption('selectedItem', selectedItem);
    }
  }

  _isCustomValueAllowed(): boolean {
    const { acceptCustomValue } = this.option();
    return Boolean(acceptCustomValue) || super._isCustomValueAllowed();
  }

  _displayValue(item?: Item | null): string {
    const { value } = this.option();
    const normalizedItem = !isDefined(item) && this._isCustomValueAllowed() ? value : item;
    return super._displayValue(normalizedItem as Item);
  }

  _listConfig(): ListBaseProperties {
    const { selectedItem, showSelectionControls } = this.option();
    const result = extend(super._listConfig(), {
      pageLoadMode: 'scrollBottom',
      onSelectionChanged: this._getSelectionChangeHandler(),
      selectedItem,
      onFocusedItemChanged: this._listFocusedItemChangeHandler.bind(this),
      _onItemsRendered: (): void => {
        this._popup?.repaint();
        if (this.option('opened')) {
          this._scrollToSelectedItem();
        }
      },
    });

    return {
      ...result,
      ...(showSelectionControls && { showSelectionControls: true, selectByClick: true }),
    } as ListBaseProperties;
  }

  _listFocusedItemChangeHandler(e: EventInfo<dxList>): void {
    if (this._preventInputValueRender) {
      return;
    }

    const list = e.component;
    const focusedElement = $(list.option('focusedElement') as Element);
    // @ts-expect-error _getItemData is an internal method not in the public dxList API
    const focusedItem = list._getItemData(focusedElement);

    this._updateField(focusedItem);
  }

  _updateField(item: unknown): void {
    const { fieldTemplate: fieldTemplateOption } = this.option();
    const fieldTemplate = this._getTemplate(fieldTemplateOption);

    if (!(fieldTemplate && fieldTemplateOption)) {
      // @ts-expect-error DataExpressionMixin must be typed
      const text = this._displayGetter(item);

      this.option('text', text);
      this._renderDisplayText(text);
      return;
    }

    this._renderField();
  }

  _getSelectionChangeHandler(): ((e: SelectionChangedEvent<Item>) => void) | typeof noop {
    const { showSelectionControls } = this.option();
    return showSelectionControls ? this._selectionChangeHandler.bind(this) : noop;
  }

  _selectionChangeHandler(e: SelectionChangedEvent<Item>): void {
    (e.addedItems ?? []).forEach((addedItem) => {
      // @ts-expect-error DataExpressionMixin must be typed
      this._setValue(this._valueGetter(addedItem));
    });
  }

  _getActualSearchValue(): string | null {
    // @ts-expect-error fix argument type in m_data_controller.ts
    return this._dataController.searchValue() as string | null;
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
    const { disabled, opened, showDataBeforeSearch } = this.option();
    if (disabled) {
      return;
    }

    const resolvedVisible = arguments.length ? isVisible : !opened;

    if (!resolvedVisible && !this._shouldClearFilter()) {
      this._restoreInputText(true);
    }

    if (this._wasSearch() && resolvedVisible) {
      this._wasSearch(false);
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const showDataImmediately = showDataBeforeSearch || this._isMinSearchLengthExceeded();

      if (showDataImmediately && this._dataController.getDataSource()) {
        if (this._searchTimer) return;

        const searchValue = this._getActualSearchValue();
        if (searchValue) {
          this._wasSearch(true);
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        this._filterDataSource(searchValue || null);
      } else {
        this._setListOption('items', []);
      }
    }

    if (resolvedVisible) {
      this._scrollToSelectedItem();
    }

    super._toggleOpenState(resolvedVisible);
  }

  _renderTooltip(): void {
    const { tooltipEnabled, displayValue } = this.option();

    if (tooltipEnabled) {
      this.$element().attr('title', displayValue ?? '');
    }
  }

  _renderDimensions(): void {
    super._renderDimensions();

    this._updatePopupWidth();
    this._updateListDimensions();
  }

  _isValueEqualInputText(): boolean {
    const { selectedItem: initialSelectedItem } = this.option();

    if (initialSelectedItem === null) {
      return false;
    }
    // @ts-expect-error DataExpressionMixin must be typed
    const value = this._displayGetter(initialSelectedItem);
    const displayValue = value ? String(value) : '';
    const inputText = this._searchValue();
    return displayValue === inputText;
  }

  _popupHidingHandler(): void {
    if (this._isValueEqualInputText()) {
      this._cancelEditing();
    }
    super._popupHidingHandler();
  }

  _popupHiddenHandler(): void {
    super._popupHiddenHandler();

    if (this._shouldCancelSearch()) {
      this._wasSearch(false);
      this._searchCanceled();
      this._shouldCancelSearch(false);
    }
  }

  _restoreInputText(saveEditingValue?: boolean): void {
    const { readOnly, searchEnabled, allowClearing } = this.option();

    if (readOnly) {
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
          let initialItem: unknown = null;

          if (isDefined(initialSelectedItem)) {
            initialItem = initialSelectedItem;
          } else if (customItemCreateEvent !== '') {
            initialItem = this._createCustomItem(text ?? '');
          }

          this._updateField(initialItem);
          this._clearFilter();
        }
        return;
      }

      if (searchEnabled) {
        if (!this._searchValue() && allowClearing) {
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

  _valueChangeEventIncludesBlur(): boolean {
    const { [this._getValueChangeEventOptionName()]: valueChangeEvent } = this.option();

    return (valueChangeEvent as string).includes('blur');
  }

  _isPreventedFocusOutEvent(e: DxEvent<FocusEvent>): boolean {
    return this._preventNestedFocusEvent(e) || this._valueChangeEventIncludesBlur();
  }

  _focusOutHandler(e: DxEvent<FocusEvent>): void {
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

  _cancelSearchIfNeed(e?: DxEvent<FocusEvent>): void {
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

  _shouldCancelSearch(value?: boolean): boolean {
    if (value === undefined) {
      return this._shouldCancelSearchValue ?? false;
    }

    this._shouldCancelSearchValue = value;
    return value;
  }

  // eslint-disable-next-line class-methods-use-this
  _isOverlayNestedTarget(target?: EventTarget | null): boolean {
    return !!$(target as Element).closest(`.${SELECTBOX_POPUP_WRAPPER_CLASS}`).length;
  }

  _clearTextValue(): void {
    const { selectedItem } = this.option();
    // @ts-expect-error DataExpressionMixin must be typed
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
    return this._needPassDataSourceToList() && Boolean(this._wasSearch());
  }

  _isFocused(): boolean {
    const activeElement = domAdapter.getActiveElement(this.element());
    return super._isFocused() && $(activeElement).closest(this._input()).length > 0;
  }

  // eslint-disable-next-line class-methods-use-this
  _getValueChangeEventOptionName(): keyof TProperties {
    return 'customItemCreateEvent';
  }

  _renderValueChangeEvent(): void {
    if (this._isEditable()) {
      super._renderValueChangeEvent();
    }
  }

  _fieldRenderData(): unknown {
    const { focusedElement, opened, selectedItem } = this.option();

    const $listFocused = (this._list && opened) ? $(focusedElement) : null;

    if ($listFocused?.length) {
      // @ts-expect-error internal API
      return this._list._getItemData($listFocused);
    }

    return selectedItem;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isSelectedValue(value: unknown, cache?: ItemCache): boolean {
    const { value: currentValue } = this.option();
    // @ts-expect-error DataExpressionMixin must be typed
    return this._isValueEquals(value, currentValue) as boolean;
  }

  _shouldCloseOnItemClick(): boolean {
    const { selectionMode, showSelectionControls } = this.option();

    return !(showSelectionControls && selectionMode !== 'single');
  }

  _listItemClickHandler(e?: ItemClickEvent<Item>): void {
    if (!e) return;

    const { searchEnabled } = this.option();
    // @ts-expect-error DataExpressionMixin must be typed
    const previousValue = this._getCurrentValue();
    this._focusListElement($(e.itemElement));

    this._saveValueChangeEvent(e.event);
    // @ts-expect-error DataExpressionMixin must be typed
    this._completeSelection(this._valueGetter(e.itemData));

    if (this._shouldCloseOnItemClick()) {
      this.option('opened', false);
    }
    // @ts-expect-error DataExpressionMixin must be typed
    if (searchEnabled && previousValue === this._valueGetter(e.itemData)) {
      this._updateField(e.itemData);
    }

    if (this._shouldClearFilter()) {
      this._cancelSearchIfNeed();
    }
  }

  _shouldClearFilter(): boolean | undefined {
    return this._wasSearch();
  }

  _completeSelection(value: unknown): void {
    this._setValue(value);
  }

  _loadItem(value: unknown, cache?: ItemCache): DeferredObj<unknown> {
    const deferred = Deferred();

    (super._loadItem(value, cache) as DeferredObj<unknown>)
      .done((item) => {
        deferred.resolve(item);
      })
      .fail((args) => {
        // @ts-expect-error add shouldSkipCallback to args
        if (args?.shouldSkipCallback) {
          return;
        }

        const { selectedItem, acceptCustomValue } = this.option();
        // @ts-expect-error DataExpressionMixin must be typed
        if (acceptCustomValue && value === this._valueGetter(selectedItem)) {
          deferred.resolve(selectedItem);
        } else {
          deferred.reject();
        }
      });
    // @ts-expect-error type on Deferred level
    return deferred.promise();
  }

  _loadInputValue(value: unknown, callback: (...args: [unknown]) => void): DeferredObj<unknown> {
    this._loadItemDeferred = this._loadItem(value).always(callback);

    return this._loadItemDeferred;
  }

  _isCustomItemSelected(): boolean {
    const { selectedItem } = this.option();
    const searchValue = this._searchValue();
    // @ts-expect-error DataExpressionMixin must be typed
    const selectedItemText = this._displayGetter(selectedItem);

    return !selectedItemText || searchValue !== selectedItemText.toString();
  }

  _valueChangeEventHandler(e: KeyboardEvent | DxEvent<InputEvent>): void {
    const { acceptCustomValue } = this.option();
    if (acceptCustomValue && this._isCustomItemSelected() && !this._isValueChanging) {
      this._isValueChanging = true;
      this._customItemAddedHandler(e);
    }
  }

  _initCustomItemCreatingAction(): void {
    this._customItemCreatingAction = this._createActionByOption('onCustomItemCreating');
  }

  _createCustomItem(text: string): unknown {
    const params: {
      text: string;
      customItem?: unknown;
    } = {
      text,
    };

    const actionResult = this._customItemCreatingAction(params);

    const item = ensureDefined(actionResult, params.customItem);

    if (isDefined(actionResult)) {
      errors.log('W0015', 'onCustomItemCreating', 'customItem');
    }

    return item;
  }

  _customItemAddedHandler(e: KeyboardEvent | DxEvent<InputEvent>): void {
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

  _setCustomItem(item: unknown): void {
    if (this._disposed) {
      return;
    }

    const normalizedItem = item ?? null;
    this.option('selectedItem', normalizedItem);
    this._cancelSearchIfNeed();
    // @ts-expect-error DataExpressionMixin must be typed
    this._setValue(this._valueGetter(normalizedItem));
    // @ts-expect-error DataExpressionMixin must be typed
    this._renderDisplayText(this._displayGetter(normalizedItem));
    this._isValueChanging = false;
  }

  _clearValueHandler(e: ValueChangedEvent & DxEvent): boolean {
    this._preventFiltering = true;
    super._clearValueHandler(e);
    this._searchCanceled();

    return false;
  }

  _wasSearch(value?: boolean): boolean | undefined {
    if (!arguments.length) {
      return !!this._wasSearchValue;
    }
    this._wasSearchValue = value;

    return undefined;
  }

  _searchHandler(e?: InputEvent | CompositionEvent): void {
    if (this._preventFiltering) {
      delete this._preventFiltering;
      return;
    }

    if (this._needPassDataSourceToList()) {
      this._wasSearch(true);
    }

    super._searchHandler(e);
  }

  _dataSourceFiltered(searchValue?: string | null): void {
    super._dataSourceFiltered();

    if (searchValue !== null) {
      this._renderInputSubstitution();
      this._renderFocusedElement();
    }
  }

  _valueSubstituted(): boolean {
    const input = this._input().get(0) as HTMLInputElement;
    const currentSearchLength = this._searchValue().length;
    const isAllSelected = input.selectionStart === 0 && input.selectionEnd === currentSearchLength;
    const inputHasSelection = input.selectionStart !== input.selectionEnd;
    const isLastSymbolSelected = currentSearchLength === input.selectionEnd;

    return Boolean(this._wasSearch()
      && inputHasSelection
      && !isAllSelected
      && isLastSymbolSelected
      && this._shouldSubstitutionBeRendered());
  }

  _shouldSubstitutionBeRendered(): boolean {
    return !this._preventSubstitution && Boolean(this._isInlineAutocompleteEnabled());
  }

  _renderInputSubstitution(): void {
    if (!this._shouldSubstitutionBeRendered()) {
      delete this._preventSubstitution;

      return;
    }

    const { items } = this._list?.option() ?? {};
    const item = this._list && this._getPlainItems(items)[0];

    if (!item) {
      return;
    }

    const $input = this._input();
    const valueLength = $input.val().length;

    if (valueLength === 0) {
      return;
    }

    const inputElement = $input.get(0) as HTMLInputElement;
    // @ts-expect-error DataExpressionMixin must be typed
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

  _optionChanged(args: OptionChanged<TProperties>): void {
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
