import { locate, move, resetPosition } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import { getFieldName } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ChildDefaultTemplate } from '@js/core/templates/child_default_template';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { Properties } from '@js/ui/lookup';
import Popover from '@js/ui/popover/ui.popover';
import type { Properties as PopupProperties } from '@js/ui/popup';
import { current, isMaterial } from '@js/ui/themes';
import supportUtils from '@ts/core/utils/m_support';
import type { OptionChanged } from '@ts/core/widget/types';
import DropDownList from '@ts/ui/drop_down_editor/drop_down_list';
import { getElementWidth } from '@ts/ui/drop_down_editor/utils';
import TextBox from '@ts/ui/text_box/text_box';

const window = getWindow();

const LOOKUP_CLASS = 'dx-lookup';
const LOOKUP_SEARCH_CLASS = 'dx-lookup-search';
const LOOKUP_SEARCH_WRAPPER_CLASS = 'dx-lookup-search-wrapper';
const LOOKUP_FIELD_CLASS = 'dx-lookup-field';
const LOOKUP_ARROW_CLASS = 'dx-lookup-arrow';
const LOOKUP_FIELD_WRAPPER_CLASS = 'dx-lookup-field-wrapper';
const LOOKUP_POPUP_CLASS = 'dx-lookup-popup';
const LOOKUP_POPUP_WRAPPER_CLASS = 'dx-lookup-popup-wrapper';
const LOOKUP_POPUP_SEARCH_CLASS = 'dx-lookup-popup-search';
const LOOKUP_POPOVER_MODE = 'dx-lookup-popover-mode';
const LOOKUP_EMPTY_CLASS = 'dx-lookup-empty';
const LOOKUP_POPOVER_FLIP_VERTICAL_CLASS = 'dx-popover-flipped-vertical';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_EMPTY_CLASS = 'dx-texteditor-empty';

const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const GROUP_LIST_HEADER_CLASS = 'dx-list-group-header';

const MATERIAL_LOOKUP_LIST_ITEMS_COUNT = 5;
const MATERIAL_LOOKUP_LIST_PADDING = 8;
const WINDOW_RATIO = 0.8;

export interface LookupProperties extends Omit<Properties, 'onItemClick' | 'onSelectionChanged'> {
  _scrollToSelectedItemEnabled?: boolean;
}

class Lookup extends DropDownList<LookupProperties> {
  _$field!: dxElementWrapper;

  _$fieldWrapper!: dxElementWrapper;

  _searchBox?: TextBox;

  _$searchBox?: dxElementWrapper | null;

  _$searchWrapper?: dxElementWrapper;

  _hideOnParentScrollTimer?: ReturnType<typeof setTimeout>;

  _scrollAction?: (e) => void;

  _pullRefreshAction?: (e) => void;

  _pageLoadingAction?: (e) => void;

  _supportedKeys() {
    return {
      ...super._supportedKeys(),
      space(e) {
        e.preventDefault();
        this._validatedOpening();
      },
      enter() {
        this._validatedOpening();
      },
    };
  }

  _getDefaultOptions(): LookupProperties {
    const getSize = (side) => {
      let size;
      if (devices.real().deviceType === 'phone' && window.visualViewport) {
        size = window.visualViewport[side];
      } else {
        size = side === 'width' ? getWidth(window) : getHeight(window);
      }
      return size * WINDOW_RATIO;
    };

    return {
      ...super._getDefaultOptions(),
      placeholder: messageLocalization.format('Select'),
      searchPlaceholder: messageLocalization.format('Search'),
      searchEnabled: true,
      searchStartEvent: 'input change keyup',
      cleanSearchOnOpening: true,
      showCancelButton: true,
      showClearButton: false,
      clearButtonText: messageLocalization.format('Clear'),
      applyButtonText: messageLocalization.format('OK'),
      pullRefreshEnabled: false,
      useNativeScrolling: true,
      pullingDownText: messageLocalization.format('dxList-pullingDownText'),
      pulledDownText: messageLocalization.format('dxList-pulledDownText'),
      refreshingText: messageLocalization.format('dxList-refreshingText'),
      pageLoadingText: messageLocalization.format('dxList-pageLoadingText'),
      // @ts-expect-error ts-error
      onScroll: null,
      // @ts-expect-error ts-error
      onPullRefresh: null,
      // @ts-expect-error ts-error
      onPageLoading: null,
      pageLoadMode: 'scrollBottom',
      nextButtonText: messageLocalization.format('dxList-nextButtonText'),
      grouped: false,
      groupTemplate: 'group',
      usePopover: false,
      openOnFieldClick: true,
      showDropDownButton: false,
      focusStateEnabled: false,
      dropDownOptions: {
        showTitle: true,
        // @ts-expect-error The width cannot be a static value due to the mechanism of size updates
        width: () => getSize('width'),
        // @ts-expect-error The height cannot be a static value due to the mechanism of size updates
        height: () => getSize('height'),
        shading: true,
        hideOnOutsideClick: true,
        animation: {},
        title: '',
        titleTemplate: 'title',
        // @ts-expect-error ts-error
        onTitleRendered: null,
        fullScreen: false,
        maxHeight: '100vh',
      },
      dropDownCentered: false,
      _scrollToSelectedItemEnabled: false,
      useHiddenSubmitElement: true,
    };
  }

  _defaultOptionsRules() {
    const themeName = current();

    // @ts-expect-error ts-error
    return super._defaultOptionsRules().concat([
      {
        device() {
          return !supportUtils.nativeScrolling;
        },
        options: {
          useNativeScrolling: false,
        },
      },
      {
        device(device) {
          return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
        },
        options: {
          usePopover: true,

          dropDownOptions: {
            height: 'auto',
          },
        },
      },
      {
        device: { platform: 'ios', phone: true },
        options: {
          dropDownOptions: {
            fullScreen: true,
          },
        },
      },
      {
        device: { platform: 'ios', tablet: true },
        options: {
          dropDownOptions: {
            width() { return Math.min(getWidth(window), getHeight(window)) * 0.4; },
            height: 'auto',
          },

          usePopover: true,
        },
      },
      {
        device() {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device() {
          return isMaterial(themeName);
        },
        options: {
          usePopover: false,
          searchEnabled: false,
          showCancelButton: false,
          dropDownCentered: true,
          _scrollToSelectedItemEnabled: true,
          dropDownOptions: {
            _ignoreFunctionValueDeprecation: true,
            shading: false,
            showTitle: false,
            // The height cannot be a static value due to the mechanism of size updates
            height: () => this._getPopupHeight(),
            // The width cannot be a static value due to the mechanism of size updates
            width: () => getElementWidth(this.$element()),
          },
        },
      },
    ]);
  }

  _init(): void {
    super._init();

    this._initActions();
  }

  _initActions(): void {
    super._initActions();

    this._initScrollAction();
    this._initPageLoadingAction();
    this._initPullRefreshAction();
  }

  _initPageLoadingAction(): void {
    this._pageLoadingAction = this._createActionByOption('onPageLoading');
  }

  _initPullRefreshAction(): void {
    this._pullRefreshAction = this._createActionByOption('onPullRefresh');
  }

  _initScrollAction(): void {
    this._scrollAction = this._createActionByOption('onScroll');
  }

  _scrollHandler(e): void {
    this._scrollAction?.(e);
  }

  _pullRefreshHandler(e): void {
    this._pullRefreshAction?.(e);
  }

  _pageLoadingHandler(e): void {
    this._pageLoadingAction?.(e);
  }

  _initTemplates(): void {
    super._initTemplates();
    this._templateManager.addDefaultTemplates({
      group: new ChildDefaultTemplate('group'),
      title: new ChildDefaultTemplate('title'),
    });
  }

  _initMarkup(): void {
    const { usePopover } = this.option();

    this.$element()
      .addClass(LOOKUP_CLASS)
      .toggleClass(LOOKUP_POPOVER_MODE, usePopover);
    super._initMarkup();
  }

  _inputWrapper(): dxElementWrapper {
    return this.$element().find(`.${LOOKUP_FIELD_WRAPPER_CLASS}`);
  }

  _dataSourceOptions() {
    return extend(super._dataSourceOptions(), {
      paginate: true,
    });
  }

  _fireContentReadyAction() { }

  _popupWrapperClass() {
    return '';
  }

  _renderInput() {
    const { inputAttr } = this.option();
    this._$field = $('<div>');
    this._applyInputAttributes(inputAttr);
    this._$field.addClass(LOOKUP_FIELD_CLASS);

    const $arrow = $('<div>').addClass(LOOKUP_ARROW_CLASS);

    this._$fieldWrapper = $('<div>').addClass(LOOKUP_FIELD_WRAPPER_CLASS)
      .append(this._$field)
      .append($arrow)
      .appendTo(this.$element());
  }

  _applyInputAttributes(attributes) {
    this._$field.attr(attributes);
  }

  _getInputContainer() {
    return this._$fieldWrapper;
  }

  _renderField() {
    const { fieldTemplate: fieldTemplateOption } = this.option();

    const fieldTemplate = this._getTemplate(fieldTemplateOption);

    if (fieldTemplate && fieldTemplateOption) {
      this._renderFieldTemplate(fieldTemplate);
      return;
    }

    const displayValue = this.option('displayValue');
    this._updateField(displayValue);

    const isFieldEmpty = !this.option('selectedItem');

    this.$element()
      .toggleClass(LOOKUP_EMPTY_CLASS, isFieldEmpty)
      .toggleClass(TEXTEDITOR_EMPTY_CLASS, isFieldEmpty);
  }

  _getLabelContainer() {
    return this._$field;
  }

  _renderDisplayText(text): void {
    if (this._input().length) {
      super._renderDisplayText(text);
    } else {
      this._updateField(text);
    }
  }

  _updateField(text): void {
    text = isDefined(text) && String(text);

    this._$field.empty();

    if (text) {
      this._$field.text(text);
    } else {
      const $placeholder = $('<div>')
        // @ts-expect-error ts-error
        .attr({ 'data-dx_placeholder': this.option('placeholder') });

      this._$field.append($placeholder);
      $placeholder.addClass('dx-placeholder');
    }
  }

  _renderButtonContainers(): void { }

  _renderFieldTemplate(template) {
    this._$field.empty();
    const data = this._fieldRenderData();
    template.render({
      model: data,
      container: getPublicElement(this._$field),
    });
  }

  _fieldRenderData() {
    return this.option('selectedItem');
  }

  _popupShowingHandler(): void {
    // @ts-expect-error ts-error
    super._popupShowingHandler.apply(this, arguments);

    if (this.option('cleanSearchOnOpening')) {
      if (this.option('searchEnabled') && this._searchBox?.option('value')) {
        this._searchBox.option('value', '');
        this._searchCanceled();
      }
      this._list?.option('focusedElement', null);
    }

    if (this.option('dropDownOptions.fullScreen') && this.option('_scrollToSelectedItemEnabled')) {
      // @ts-expect-error ts-error
      this._popup.option('position').of = $(window);
    }
  }

  _popupShownHandler(): void {
    const scrollToSelectedItemEnabled = this.option('_scrollToSelectedItemEnabled');
    const fullScreen = this.option('dropDownOptions.fullScreen');

    if (!fullScreen && scrollToSelectedItemEnabled) {
      this._setPopupPosition();
    }

    super._popupShownHandler();
  }

  _scrollToSelectedItem(): void {
    const { selectedIndex, items: listItems } = this._list?.option() ?? {};
    // @ts-expect-error ts-error
    const itemsCount = listItems.length;

    if (itemsCount !== 0) {
      if (this._list?.option('grouped')) {
        // @ts-expect-error ts-error
        this._list?.scrollToItem({ group: itemsCount - 1, item: listItems[itemsCount - 1].items.length - 1 });
      } else {
        this._list?.scrollToItem(itemsCount - 1);
      }

      this._list?.scrollToItem(selectedIndex);
    }
  }

  _getDifferenceOffsets(selectedListItem) {
    // @ts-expect-error ts-error
    return selectedListItem.offset().top - $(this.element()).offset().top;
  }

  _isCenteringEnabled(index, count) {
    return index > 1 && index < (count - 2);
  }

  _getPopupOffset() {
    const listItemsCount = this._listItemElements().length;

    if (listItemsCount === 0) return;
    // @ts-expect-error ts-error
    const selectedListItem = $(this._list.element()).find(`.${LIST_ITEM_SELECTED_CLASS}`);
    const selectedIndex = this._listItemElements().index(selectedListItem);
    const differenceOfHeights = (getHeight(selectedListItem) - getHeight(this.element())) / 2;
    // @ts-expect-error
    const lookupOffset = $(this._list.element()).offset().top;
    const dropDownHeightOption = this.option('dropDownOptions.height');
    // @ts-expect-error ts-error
    const popupHeight = typeof dropDownHeightOption === 'function' ? dropDownHeightOption() : dropDownHeightOption;
    const windowHeight = getHeight(window);

    let offsetTop = 0;

    if (selectedIndex !== -1) {
      if (this._isCenteringEnabled(selectedIndex, listItemsCount)) {
        this._scrollToSelectedItem();

        const scrollOffsetTop = (popupHeight - getHeight(selectedListItem)) / 2 - this._getDifferenceOffsets(selectedListItem);
        // @ts-expect-error ts-error
        this._list.scrollTo(this._list.scrollTop() + MATERIAL_LOOKUP_LIST_PADDING / 2 - scrollOffsetTop);

        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);

        if (lookupOffset < offsetTop && selectedIndex !== (listItemsCount - 3)) {
          // @ts-expect-error ts-error
          this._list.scrollTo(this._list.scrollTop() + this._getDifferenceOffsets(selectedListItem) / 2);

          offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
        }
      } else if (selectedIndex <= 1) {
        // @ts-expect-error ts-error
        this._list.scrollTo(0);

        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
      } else if (selectedIndex >= (listItemsCount - 2)) {
        this._scrollToSelectedItem();

        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
      }

      if (lookupOffset < offsetTop) {
        this._scrollToSelectedItem();
        offsetTop = differenceOfHeights + MATERIAL_LOOKUP_LIST_PADDING;
      }
    }

    const offsetBottom = popupHeight - offsetTop - getHeight(this.element());

    if (windowHeight - lookupOffset < offsetBottom) {
      // @ts-expect-error ts-error
      this._list.scrollTo(this._list.scrollTop() + differenceOfHeights - offsetBottom);
      offsetTop = popupHeight - getHeight(this.element()) - MATERIAL_LOOKUP_LIST_PADDING;
    }

    return offsetTop;
  }

  _setPopupPosition(): void {
    if (!this.option('dropDownCentered')) return;
    // @ts-expect-error ts-error
    const flipped = this._popup.$wrapper().hasClass(LOOKUP_POPOVER_FLIP_VERTICAL_CLASS);
    if (flipped) return;
    // @ts-expect-error ts-error
    const popupContentParent = $(this._popup.$content()).parent();
    const popupOffset = this._getPopupOffset();

    const position = locate(popupContentParent);

    move(popupContentParent, {
      // @ts-expect-error ts-error
      top: position.top - popupOffset,
    });
  }

  _listItemGroupedElements() {
    // @ts-expect-error ts-error
    const groups = this._list._getItemsContainer().children();
    const items: Element[] = [];

    // @ts-expect-error ts-error
    groups.each((_, group) => {
      items.push($(group).find(`.${GROUP_LIST_HEADER_CLASS}`)[0]);

      const groupedItems = $(group).find(`.${LIST_ITEM_CLASS}`);
      // @ts-expect-error
      groupedItems.each((_, item) => {
        items.push(item);
      });
    });

    return $(items);
  }

  _calculateListHeight(grouped) {
    const listItems = grouped ? this._listItemGroupedElements() : this._listItemElements();
    const selectedListItem = $(`.${LIST_ITEM_SELECTED_CLASS}`);
    const selectedIndex = listItems.index(selectedListItem);
    let listHeight = 0;
    let requireListItems = [];

    if (listItems.length === 0) {
      listHeight += MATERIAL_LOOKUP_LIST_PADDING;
    } else if (listItems.length < MATERIAL_LOOKUP_LIST_ITEMS_COUNT) {
      // @ts-expect-error ts-error
      listItems.each((_, item) => {
        listHeight += getOuterHeight(item);
      });
    } else {
      if (selectedIndex <= 1) {
        // @ts-expect-error ts-error
        requireListItems = listItems.slice(0, MATERIAL_LOOKUP_LIST_ITEMS_COUNT);
      } else if (this._isCenteringEnabled(selectedIndex, listItems.length)) {
        // @ts-expect-error ts-error
        requireListItems = listItems.slice(selectedIndex - 2, selectedIndex + 3);
      } else {
        // @ts-expect-error ts-error
        requireListItems = listItems.slice(listItems.length - MATERIAL_LOOKUP_LIST_ITEMS_COUNT, listItems.length);
      }

      // @ts-expect-error
      requireListItems.each((_, item) => {
        listHeight += getOuterHeight(item);
      });
    }

    return listHeight + (grouped ? MATERIAL_LOOKUP_LIST_PADDING : MATERIAL_LOOKUP_LIST_PADDING * 2);
  }

  _getPopupHeight() {
    if (this._list?.itemElements().length) {
      return this._calculateListHeight(this.option('grouped'))
        + (this._$searchWrapper ? getOuterHeight(this._$searchWrapper) : 0)
        // @ts-expect-error ts-error
        + (this._popup.bottomToolbar() ? getOuterHeight(this._popup.bottomToolbar()) : 0)
        // @ts-expect-error ts-error
        + (this._popup.topToolbar() ? getOuterHeight(this._popup.topToolbar()) : 0);
    }
    return 'auto';
  }

  _allowSelectItemByTab() {
    return false;
  }

  _popupTabHandler(e) {
    const shouldLoopFocusInsidePopup = this._shouldLoopFocusInsidePopup();

    if (!shouldLoopFocusInsidePopup) {
      super._popupTabHandler(e);
    }
  }

  _renderPopup(): void {
    if (this.option('usePopover') && !this.option('dropDownOptions.fullScreen')) {
      if (this.option('_scrollToSelectedItemEnabled')) {
        super._renderPopup();
      } else {
        this._renderPopover();
        this._attachPopupKeyHandler();
      }
    } else {
      super._renderPopup();
    }

    this._$popup!.addClass(LOOKUP_POPUP_CLASS);
    this._popup!.$wrapper()?.addClass(LOOKUP_POPUP_WRAPPER_CLASS);
  }

  _renderPopover() {
    const popupConfig = this._popupConfig();

    const options = extend(
      popupConfig,
      this._options.cache('dropDownOptions'),
      {
        showEvent: null,
        hideEvent: null,
        target: this.$element(),
        fullScreen: false,
        shading: false,
        hideOnParentScroll: true,
        _fixWrapperPosition: false,
        width: this._isInitialOptionValue('dropDownOptions.width')
          ? () => getOuterWidth(this.$element())
          : popupConfig.width,
      },
    );
    // @ts-expect-error ts-error
    this._popup = this._createComponent(this._$popup, Popover, options);

    this._popup.$overlayContent().attr('role', 'dialog');

    this._popup.on({
      showing: this._popupShowingHandler.bind(this),
      shown: this._popupShownHandler.bind(this),
      hiding: this._popupHidingHandler.bind(this),
      hidden: this._popupHiddenHandler.bind(this),
      contentReady: this._contentReadyHandler.bind(this),
    });

    if (this.option('_scrollToSelectedItemEnabled')) {
      this._popup._$arrow.remove();
    }

    const $content = this._popup.$content();

    if ($content) {
      this._setPopupContentId($content);
    }

    this._contentReadyHandler();
  }

  _popupHidingHandler(): void {
    super._popupHidingHandler();
    this.option('focusStateEnabled') && this.focus();
  }

  _popupHiddenHandler(): void {
    super._popupHiddenHandler();

    if (this.option('_scrollToSelectedItemEnabled')) {
      resetPosition($(this._popup?.content()).parent());
    }
  }

  _preventFocusOnPopup(): void { }

  _shouldLoopFocusInsidePopup(): boolean {
    const {
      usePopover,
      dropDownCentered,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _scrollToSelectedItemEnabled,
    } = this.option();
    // @ts-expect-error ts-error
    const result: boolean = _scrollToSelectedItemEnabled
      ? dropDownCentered
      : !usePopover;

    return result;
  }

  _popupConfig(): PopupProperties {
    const { dropDownOptions = {} } = this.option();
    const shouldLoopFocusInsidePopup = this._shouldLoopFocusInsidePopup();

    const result = extend(super._popupConfig(), {
      toolbarItems: this._getPopupToolbarItems(),
      hideOnParentScroll: false,
      onPositioned: null,
      maxHeight: dropDownOptions.maxHeight,
      showTitle: dropDownOptions.showTitle,
      title: dropDownOptions.title,
      titleTemplate: this._getTemplateByOption('dropDownOptions.titleTemplate'),
      onTitleRendered: dropDownOptions.onTitleRendered,
      fullScreen: dropDownOptions.fullScreen,
      shading: dropDownOptions.shading,
      hideOnOutsideClick: dropDownOptions.hideOnOutsideClick,
      tabFocusLoopEnabled: shouldLoopFocusInsidePopup,
    });

    delete result.animation;
    delete result.position;

    if (this.option('_scrollToSelectedItemEnabled')) {
      result.position = this.option('dropDownCentered') ? {
        my: 'left top',
        at: 'left top',
        of: this.element(),
      } : {
        my: 'left top',
        at: 'left bottom',
        of: this.element(),
      };

      result.hideOnParentScroll = true;
    }

    each(['position', 'animation', 'width', 'height'], (_, optionName) => {
      const popupOptionValue = dropDownOptions[optionName];

      if (popupOptionValue !== undefined) {
        result[optionName] = popupOptionValue;
      }
    });

    return result;
  }

  _getPopupToolbarItems() {
    const { applyValueMode } = this.option();

    const buttonsConfig = applyValueMode === 'useButtons'
      ? this._popupToolbarItemsConfig()
      : [];

    const cancelButton = this._getCancelButtonConfig();
    if (cancelButton) {
      // @ts-expect-error ts-error
      buttonsConfig.push(cancelButton);
    }

    const clearButton = this._getClearButtonConfig();
    if (clearButton) {
      // @ts-expect-error ts-error
      buttonsConfig.push(clearButton);
    }

    return this._applyButtonsLocation(buttonsConfig);
  }

  _popupToolbarItemsConfig() {
    const { focusStateEnabled, applyButtonText: text } = this.option();

    return [
      {
        shortcut: 'done',
        options: {
          text,
          focusStateEnabled,
          onClick: this._applyButtonHandler.bind(this),
        },
      },
    ];
  }

  _getCancelButtonConfig() {
    const { focusStateEnabled, cancelButtonText: text, showCancelButton } = this.option();

    return showCancelButton ? {
      shortcut: 'cancel',
      options: {
        text,
        focusStateEnabled,
      },
      onClick: this._cancelButtonHandler.bind(this),
    } : null;
  }

  _getClearButtonConfig() {
    const { showClearButton, clearButtonText: text, focusStateEnabled } = this.option();

    return showClearButton ? {
      shortcut: 'clear',
      options: {
        text,
        focusStateEnabled,
      },
      onClick: this._resetValue.bind(this),
    } : null;
  }

  _applyButtonHandler(args?): void {
    if (args) {
      this._saveValueChangeEvent(args.event);
    }
    // @ts-expect-error ts-error
    this.option('value', this._valueGetter(this._currentSelectedItem()));
    super._applyButtonHandler();
  }

  _cancelButtonHandler(): void {
    this._refreshSelected();
    super._cancelButtonHandler();
  }

  _refreshPopupVisibility(): void {
    if (this.option('opened')) {
      this._updateListDimensions();
    }
  }

  _dimensionChanged(): void {
    if (this.option('usePopover') && !this.option('dropDownOptions.width')) {
      this.option('dropDownOptions.width', getWidth(this.$element()));
    }

    this._updateListDimensions();
  }

  _input() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this._$searchBox || super._input();
  }

  _renderPopupContent(): void {
    super._renderPopupContent();
    this._renderSearch();
  }

  _renderValueChangeEvent(): void { }

  _renderSearch(): void {
    const isSearchEnabled = this.option('searchEnabled');

    this._toggleSearchClass(isSearchEnabled);

    if (isSearchEnabled) {
      const $searchWrapper = this._$searchWrapper = $('<div>').addClass(LOOKUP_SEARCH_WRAPPER_CLASS);

      const $searchBox = this._$searchBox = $('<div>').addClass(LOOKUP_SEARCH_CLASS)
        .appendTo($searchWrapper);

      const currentDevice = devices.current();
      const searchMode = currentDevice.android ? 'text' : 'search';

      let isKeyboardListeningEnabled = false;

      const { searchStartEvent } = this.option();

      const textBoxOptions = {
        mode: searchMode,
        showClearButton: true,
        valueChangeEvent: searchStartEvent,
        inputAttr: { 'aria-label': messageLocalization.format('Search') },
        // eslint-disable-next-line no-return-assign
        onDisposing: () => isKeyboardListeningEnabled = false,
        // eslint-disable-next-line no-return-assign
        onFocusIn: () => isKeyboardListeningEnabled = true,
        onFocusOut: () => {
          isKeyboardListeningEnabled = false;
          this._list?.option('focusedElement', null);
        },
        // @ts-expect-error ts-error
        onKeyboardHandled: (opts) => isKeyboardListeningEnabled && this._list._keyboardHandler(opts),
        onValueChanged: (e) => this._searchHandler(e),
      };

      this._searchBox = this._createComponent($searchBox, TextBox, textBoxOptions);

      this._registerSearchKeyHandlers();
      // @ts-expect-error ts-error
      $searchWrapper.insertBefore(this._$list);

      this._setSearchPlaceholder();
    }
  }

  _filterDataSource(...args): void {
    if (this._list && !this._list._dataSource && this._isMinSearchLengthExceeded()) {
      this._list?._scrollView.startLoading();
    }
    // @ts-expect-error ts-error
    super._filterDataSource(...args);
  }

  _dataSourceFiltered(...args) {
    super._dataSourceFiltered(...args);
    this._list?._scrollView.finishLoading();
  }

  _updateActiveDescendant(): void {
    super._updateActiveDescendant();

    if (!this._$searchBox) {
      return;
    }
    const $input = this._$searchBox.find('input');
    super._updateActiveDescendant($input);
  }

  _removeSearch(): void {
    this._$searchWrapper?.remove();
    delete this._$searchWrapper;

    this._$searchBox?.remove();
    delete this._$searchBox;
    delete this._searchBox;
  }

  _selectListItemHandler(e) {
    const { focusedElement } = this._list!.option();

    const $itemElement = $(focusedElement);

    if (!$itemElement.length) {
      return;
    }

    e.preventDefault();
    e.target = $itemElement.get(0);
    this._saveValueChangeEvent(e);
    this._selectListItem(e.itemData, $itemElement);
  }

  _registerSearchKeyHandlers(): void {
    this._searchBox?.registerKeyHandler('enter', this._selectListItemHandler.bind(this));
    this._searchBox?.registerKeyHandler('space', this._selectListItemHandler.bind(this));
    this._searchBox?.registerKeyHandler('end', noop);
    this._searchBox?.registerKeyHandler('home', noop);
  }

  _toggleSearchClass(isSearchEnabled) {
    if (this._popup) {
      this._popup.$wrapper()?.toggleClass(LOOKUP_POPUP_SEARCH_CLASS, isSearchEnabled);
    }
  }

  _setSearchPlaceholder(): void {
    if (!this._$searchBox) {
      return;
    }

    const minSearchLength = this.option('minSearchLength');
    let placeholder = this.option('searchPlaceholder');

    if (minSearchLength && placeholder === messageLocalization.format('Search')) {
      // @ts-expect-error ts-error
      placeholder = messageLocalization.getFormatter('dxLookup-searchPlaceholder')(minSearchLength);
    }

    this._searchBox?.option('placeholder', placeholder);
  }

  _setAriaTargetForList(): void { }

  _listConfig() {
    return extend(super._listConfig(), {
      tabIndex: this.option('searchEnabled') ? -1 : 0,
      grouped: this.option('grouped'),
      groupTemplate: this._getTemplateByOption('groupTemplate'),
      pullRefreshEnabled: this.option('pullRefreshEnabled'),
      useNativeScrolling: this.option('useNativeScrolling'),
      pullingDownText: this.option('pullingDownText'),
      pulledDownText: this.option('pulledDownText'),
      refreshingText: this.option('refreshingText'),
      pageLoadingText: this.option('pageLoadingText'),
      onScroll: this._scrollHandler.bind(this),
      onPullRefresh: this._pullRefreshHandler.bind(this),
      onPageLoading: this._pageLoadingHandler.bind(this),
      pageLoadMode: this.option('pageLoadMode'),
      nextButtonText: this.option('nextButtonText'),
      indicateLoading: this.option('searchEnabled'),
    });
  }

  _listContentReadyHandler(): void {
    // @ts-expect-error ts-error
    super._listContentReadyHandler(...arguments);
    this._refreshSelected();
  }

  _runWithoutCloseOnScroll(callback) {
    // NOTE: Focus can trigger "scroll" event

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _scrollToSelectedItemEnabled } = this.option();
    const hideOnParentScroll = this._popup?.option('hideOnParentScroll');

    if (!_scrollToSelectedItemEnabled) {
      callback();
    } else {
      this._popup?.option('hideOnParentScroll', false);
      callback();
      this._hideOnParentScrollTimer = setTimeout(() => { // T1018037
        this._popup?.option('hideOnParentScroll', hideOnParentScroll);
      });
    }
  }

  _setFocusPolicy(): void {
    if (!this.option('focusStateEnabled')) {
      return;
    }

    this._runWithoutCloseOnScroll(() => {
      if (this.option('searchEnabled')) {
        this._searchBox?.focus();
      } else {
        this._list?.focus();
      }
    });
  }

  _focusTarget() {
    return this._$field;
  }

  _keyboardEventBindingTarget() {
    return this._$field;
  }

  _listItemClickHandler(e): void {
    this._saveValueChangeEvent(e.event);
    this._selectListItem(e.itemData, e.event.currentTarget);
  }

  _selectListItem(itemData, target): void {
    this._list?.selectItem(target);

    const { applyValueMode } = this.option();

    if (applyValueMode === 'instantly') {
      this._applyButtonHandler();
    }
  }

  _currentSelectedItem() {
    return this.option('grouped')
      // @ts-expect-error ts-error
      ? this._list.option('selectedItems[0]').items[0]
      : this._list?.option('selectedItems[0]');
  }

  _resetValue(e): void {
    this._saveValueChangeEvent(e.event);
    this.option('value', null);
    this.option('opened', false);
  }

  // @ts-expect-error ts-error
  _searchValue() {
    return this.option('searchEnabled') && this._searchBox ? this._searchBox.option('value') : '';
  }

  _renderInputValue(...args) {
    return super._renderInputValue(...args).always(() => {
      this._refreshSelected();
    });
  }

  _renderPlaceholder(): void {
    if (this.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`).length === 0) {
      return;
    }

    super._renderPlaceholder();
  }

  _clean(): void {
    this._$fieldWrapper.remove();
    clearTimeout(this._hideOnParentScrollTimer);
    // @ts-expect-error ts-error
    this._hideOnParentScrollTimer = null;
    this._$searchBox = null;

    super._clean();
  }

  _optionChanged(args: OptionChanged<LookupProperties>): void {
    const { name, fullName, value } = args;

    switch (name) {
      case 'dataSource':
        // @ts-expect-error ts-error
        super._optionChanged(...arguments);
        this._renderField();
        break;
      case 'searchEnabled':
        if (this._popup) {
          this._removeSearch();
          this._renderSearch();
        }
        this._setListOption('tabIndex', value ? -1 : 0);
        break;
      case 'searchPlaceholder':
        this._setSearchPlaceholder();
        break;
      case 'minSearchLength':
        this._setSearchPlaceholder();
        // @ts-expect-error ts-error
        super._optionChanged(...arguments);
        break;
      case 'inputAttr':
        this._applyInputAttributes(value);
        break;
      case 'usePopover':
      case 'placeholder':
        this._invalidate();
        break;
      case 'focusStateEnabled':
        this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
        // @ts-expect-error ts-error
        super._optionChanged(...arguments);
        break;
      case 'clearButtonText':
      case 'showClearButton':
      case 'showCancelButton':
        this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
        break;
      case 'applyValueMode':
        // @ts-expect-error ts-error
        super._optionChanged(...arguments);
        break;
      case 'onPageLoading':
        this._initPageLoadingAction();
        break;
      case 'onPullRefresh':
        this._initPullRefreshAction();
        break;
      case 'pullRefreshEnabled':
      case 'useNativeScrolling':
      case 'pullingDownText':
      case 'pulledDownText':
      case 'refreshingText':
      case 'pageLoadingText':
      case 'nextButtonText':
      case 'grouped':
      case 'groupTemplate':
        this._setListOption(name);
        break;
      case 'searchStartEvent':
        this._searchBox?.option('valueChangeEvent', value);
        break;
      case 'onScroll':
        this._initScrollAction();
        break;
      case 'pageLoadMode':
        this._setListOption('pageLoadMode', this.option('pageLoadMode'));
        break;
      case 'cleanSearchOnOpening':
      case '_scrollToSelectedItemEnabled':
        break;
      case 'dropDownOptions':
        switch (fullName) {
          case 'dropDownOptions.width':
          case 'dropDownOptions.height': {
            const optionArgs = {
              ...args,
              value: value === 'auto' ? this.initialOption('dropDownOptions')[getFieldName(fullName)] : value,
            };
            this._popupOptionChanged(optionArgs);
            this._innerWidgetOptionChanged(this._popup, optionArgs);
            break;
          }
          default:
            super._optionChanged(args);
        }
        break;
      case 'dropDownCentered':
        if (this.option('_scrollToSelectedItemEnabled')) {
          this.option('dropDownOptions.position', undefined);
          this._renderPopup();
        }
        break;
      default:
        // @ts-expect-error ts-error
        super._optionChanged(...arguments);
    }
  }

  focus() {
    // @ts-expect-error
    this.option('opened') ? this._setFocusPolicy() : eventsEngine.trigger(this._focusTarget(), 'focus');
  }

  // @ts-expect-error ts-error
  field() {
    return this._$field;
  }
}

registerComponent('dxLookup', Lookup);

export default Lookup;
