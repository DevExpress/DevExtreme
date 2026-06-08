import { locate, move, resetPosition } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import { getFieldName } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ChildDefaultTemplate } from '@js/core/templates/child_default_template';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { DataSourceOptions } from '@js/data/data_source';
import type { DxEvent } from '@js/events';
import type { ClickEvent as ButtonClickEvent } from '@js/ui/button';
import type {
  Item,
  ItemClickEvent,
  PageLoadingEvent,
  PullRefreshEvent,
  ScrollEvent,
} from '@js/ui/list';
import type { Properties } from '@js/ui/lookup';
import Popover from '@js/ui/popover/ui.popover';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import { current, isMaterial } from '@js/ui/themes';
import supportUtils from '@ts/core/utils/m_support';
import type { OptionChanged } from '@ts/core/widget/types';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import DropDownList from '@ts/ui/drop_down_editor/drop_down_list';
import { getElementWidth } from '@ts/ui/drop_down_editor/utils';
import type { ListBaseProperties } from '@ts/ui/list/list.base';
import TextBox from '@ts/ui/text_box/text_box';

import type { FieldTemplate } from './drop_down_editor/drop_down_editor';

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

type LookupButtonConfig = ToolbarItem & {
  shortcut: string;
  onClick?: (e: ButtonClickEvent) => void
};

class Lookup extends DropDownList<LookupProperties> {
  _$field!: dxElementWrapper;

  _$fieldWrapper!: dxElementWrapper;

  _searchBox?: TextBox;

  _$searchBox?: dxElementWrapper | null;

  _$searchWrapper?: dxElementWrapper;

  _hideOnParentScrollTimer?: ReturnType<typeof setTimeout> | null;

  _scrollAction?: (e: ScrollEvent) => void;

  _pullRefreshAction?: (e: PullRefreshEvent) => void;

  _pageLoadingAction?: (e: PageLoadingEvent) => void;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => void> {
    return {
      ...super._supportedKeys(),
      space(e: KeyboardEvent): void {
        e.preventDefault();
        this._validatedOpening();
      },
      enter(): void {
        this._validatedOpening();
      },
    };
  }

  _getDefaultOptions(): LookupProperties {
    const getSize = (side: 'width' | 'height'): number => {
      if (devices.real().deviceType === 'phone' && window.visualViewport) {
        return window.visualViewport[side] * WINDOW_RATIO;
      }

      const size = side === 'width' ? getWidth(window) : getHeight(window);

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
      // @ts-expect-error public API
      onScroll: null,
      // @ts-expect-error public API
      onPullRefresh: null,
      // @ts-expect-error public API
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

  _defaultOptionsRules(): DefaultOptionsRule<LookupProperties>[] {
    const themeName = current();

    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return !supportUtils.nativeScrolling;
        },
        options: {
          useNativeScrolling: false,
        },
      },
      {
        device(device): boolean {
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
            width(): number { return Math.min(getWidth(window), getHeight(window)) * 0.4; },
            height: 'auto',
          },

          usePopover: true,
        },
      },
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device(): boolean {
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
    ] as DefaultOptionsRule<LookupProperties>[]);
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

  _scrollHandler(e: ScrollEvent): void {
    this._scrollAction?.(e);
  }

  _pullRefreshHandler(e: PullRefreshEvent): void {
    this._pullRefreshAction?.(e);
  }

  _pageLoadingHandler(e: PageLoadingEvent): void {
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

  _dataSourceOptions(): Partial<DataSourceOptions<Item>> {
    return { ...super._dataSourceOptions(), paginate: true };
  }

  // eslint-disable-next-line class-methods-use-this
  _fireContentReadyAction(): void { }

  // eslint-disable-next-line class-methods-use-this
  _popupWrapperClass(): string {
    return '';
  }

  _renderInput(): void {
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

  _applyInputAttributes(attributes: unknown): void {
    // @ts-expect-error fix on renderer level
    this._$field.attr(attributes);
  }

  _getInputContainer(): dxElementWrapper {
    return this._$fieldWrapper;
  }

  _renderField(): void {
    const { fieldTemplate: fieldTemplateOption, displayValue, selectedItem } = this.option();

    const fieldTemplate = this._getTemplate(fieldTemplateOption);

    if (fieldTemplate && fieldTemplateOption) {
      this._renderFieldTemplate(fieldTemplate);
      return;
    }

    this._updateField(displayValue);

    const isFieldEmpty = !selectedItem;

    this.$element()
      .toggleClass(LOOKUP_EMPTY_CLASS, isFieldEmpty)
      .toggleClass(TEXTEDITOR_EMPTY_CLASS, isFieldEmpty);
  }

  _getLabelContainer(): dxElementWrapper {
    return this._$field;
  }

  _renderDisplayText(text: string | undefined): void {
    if (this._input().length) {
      super._renderDisplayText(text);
    } else {
      this._updateField(text);
    }
  }

  _updateField(text: string | undefined): void {
    const displayText: string | false = isDefined(text) && String(text);

    this._$field.empty();

    if (displayText) {
      this._$field.text(displayText);
    } else {
      const { placeholder } = this.option();
      const $placeholder = $('<div>')
        // @ts-expect-error fix on renderer level
        .attr({ 'data-dx_placeholder': placeholder });

      this._$field.append($placeholder);
      $placeholder.addClass('dx-placeholder');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _renderButtonContainers(): void { }

  _renderFieldTemplate(template: FieldTemplate): void {
    this._$field.empty();
    const data = this._fieldRenderData();
    template.render({
      model: data,
      container: getPublicElement(this._$field),
    });
  }

  _fieldRenderData(): Item | undefined {
    const { selectedItem } = this.option();

    return selectedItem as Item | undefined;
  }

  _popupShowingHandler(): void {
    super._popupShowingHandler();

    const {
      cleanSearchOnOpening,
      searchEnabled,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _scrollToSelectedItemEnabled,
      dropDownOptions: { fullScreen } = {},
    } = this.option();
    const { value: searchBoxValue } = this._searchBox?.option() ?? {};

    if (cleanSearchOnOpening) {
      if (searchEnabled && searchBoxValue) {
        this._searchBox?.option('value', '');
        this._searchCanceled();
      }
      this._list?.option('focusedElement', null);
    }

    if (fullScreen && _scrollToSelectedItemEnabled) {
      const { position } = this._popup?.option() ?? {};
      if (position) {
        // @ts-expect-error PositionConfig
        position.of = $(window);
      }
    }
  }

  _popupShownHandler(): void {
    const {

      _scrollToSelectedItemEnabled: scrollToSelectedItemEnabled,
      dropDownOptions: { fullScreen } = {},
    } = this.option();

    if (!fullScreen && scrollToSelectedItemEnabled) {
      this._setPopupPosition();
    }

    super._popupShownHandler();
  }

  _scrollToSelectedItem(): void {
    const { selectedIndex, items: listItems, grouped } = this._list?.option() ?? {};

    const itemsCount = listItems?.length ?? 0;

    if (itemsCount !== 0) {
      if (grouped) {
        this._list?.scrollToItem({
          // @ts-expect-error fix on List level
          group: itemsCount - 1,
          // @ts-expect-error fix on List item level
          item: (listItems?.[itemsCount - 1].items.length ?? 0) - 1,
        });
      } else {
        this._list?.scrollToItem(itemsCount - 1);
      }

      this._list?.scrollToItem(selectedIndex);
    }
  }

  _getDifferenceOffsets(selectedListItem: dxElementWrapper): number {
    return (selectedListItem.offset()?.top ?? 0) - ($(this.element()).offset()?.top ?? 0);
  }

  // eslint-disable-next-line class-methods-use-this
  _isCenteringEnabled(index: number, count: number): boolean {
    return index > 1 && index < (count - 2);
  }

  _getPopupOffset(): number | undefined {
    const listItemsCount = this._listItemElements().length;

    if (listItemsCount === 0) return undefined;

    const selectedListItem = $(this._list?.element()).find(`.${LIST_ITEM_SELECTED_CLASS}`);
    const selectedIndex = this._listItemElements().index(selectedListItem);
    const differenceOfHeights = (getHeight(selectedListItem) - getHeight(this.element())) / 2;

    const lookupOffset = $(this._list?.element()).offset()?.top ?? 0;
    const { dropDownOptions: { height: dropDownHeightOption } = {} } = this.option();
    const popupHeight = (
      // @ts-expect-error fix on PopupProperties height typing
      typeof dropDownHeightOption === 'function' ? dropDownHeightOption() : dropDownHeightOption
    ) as number;
    const windowHeight = getHeight(window);

    let offsetTop = 0;

    if (selectedIndex !== -1) {
      if (this._isCenteringEnabled(selectedIndex, listItemsCount)) {
        this._scrollToSelectedItem();

        const differenceOffset = this._getDifferenceOffsets(selectedListItem);
        const scrollOffsetTop = (popupHeight - getHeight(selectedListItem)) / 2 - differenceOffset;
        // @ts-expect-error fix on List level
        this._list.scrollTo(
          // @ts-expect-error fix on List level
          this._list.scrollTop() + MATERIAL_LOOKUP_LIST_PADDING / 2 - scrollOffsetTop,
        );

        offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);

        if (lookupOffset < offsetTop && selectedIndex !== (listItemsCount - 3)) {
          const updatedDifferenceOffset = this._getDifferenceOffsets(selectedListItem);
          // @ts-expect-error fix on List level
          this._list.scrollTo(
            // @ts-expect-error fix on List level
            this._list.scrollTop() + updatedDifferenceOffset / 2,
          );

          offsetTop = differenceOfHeights + this._getDifferenceOffsets(selectedListItem);
        }
      } else if (selectedIndex <= 1) {
        // @ts-expect-error fix on List level
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
      // @ts-expect-error fix on List level
      this._list.scrollTo(
        // @ts-expect-error fix on List level
        this._list.scrollTop() + differenceOfHeights - offsetBottom,
      );
      offsetTop = popupHeight - getHeight(this.element()) - MATERIAL_LOOKUP_LIST_PADDING;
    }

    return offsetTop;
  }

  _setPopupPosition(): void {
    const { dropDownCentered } = this.option();

    if (!dropDownCentered) return;

    const flipped = this._popup?.$wrapper()?.hasClass(LOOKUP_POPOVER_FLIP_VERTICAL_CLASS);

    if (flipped) return;

    const popupContentParent = $(this._popup?.$content()).parent();
    const popupOffset = this._getPopupOffset() ?? 0;
    const position = locate(popupContentParent);

    move(popupContentParent, {
      top: position.top - popupOffset,
    });
  }

  _listItemGroupedElements(): dxElementWrapper {
    const groupsContainer = this._list
      ? this._list._getItemsContainer().children() as unknown as ArrayLike<Element>
      : [];
    const groups = Array.from(groupsContainer);
    const items: Element[] = [];

    groups.forEach((group) => {
      items.push($(group).find(`.${GROUP_LIST_HEADER_CLASS}`)[0]);

      const groupedItems = Array.from($(group).find(`.${LIST_ITEM_CLASS}`) as unknown as ArrayLike<Element>);
      items.push(...groupedItems);
    });

    return $(items);
  }

  _calculateListHeight(grouped?: boolean): number {
    const listItems = grouped ? this._listItemGroupedElements() : this._listItemElements();
    const selectedListItem = $(`.${LIST_ITEM_SELECTED_CLASS}`);
    const selectedIndex = listItems.index(selectedListItem);
    let listHeight = 0;

    if (listItems.length === 0) {
      listHeight += MATERIAL_LOOKUP_LIST_PADDING;
    } else if (listItems.length < MATERIAL_LOOKUP_LIST_ITEMS_COUNT) {
      Array.from(listItems as unknown as ArrayLike<Element>).forEach((item) => {
        listHeight += getOuterHeight(item);
      });
    } else {
      let requireListItems: dxElementWrapper = $([]);

      if (selectedIndex <= 1) {
        requireListItems = listItems.slice(0, MATERIAL_LOOKUP_LIST_ITEMS_COUNT);
      } else if (this._isCenteringEnabled(selectedIndex, listItems.length)) {
        requireListItems = listItems.slice(selectedIndex - 2, selectedIndex + 3);
      } else {
        const start = listItems.length - MATERIAL_LOOKUP_LIST_ITEMS_COUNT;
        requireListItems = listItems.slice(start, listItems.length);
      }

      Array.from(requireListItems as unknown as ArrayLike<Element>).forEach((item) => {
        listHeight += getOuterHeight(item);
      });
    }

    return listHeight + (grouped ? MATERIAL_LOOKUP_LIST_PADDING : MATERIAL_LOOKUP_LIST_PADDING * 2);
  }

  _getPopupHeight(): number | string {
    const { grouped } = this.option();
    if (!this._list?.itemElements().length) {
      return 'auto';
    }

    const bottomToolbar = this._popup?.bottomToolbar();
    const topToolbar = this._popup?.topToolbar();

    return (
      this._calculateListHeight(grouped)
      + (this._$searchWrapper ? getOuterHeight(this._$searchWrapper) : 0)
      + (bottomToolbar ? getOuterHeight(bottomToolbar) : 0)
      + (topToolbar ? getOuterHeight(topToolbar) : 0)
    ) as number;
  }

  // eslint-disable-next-line class-methods-use-this
  _allowSelectItemByTab(): boolean {
    return false;
  }

  _popupTabHandler(e: DxEvent<KeyboardEvent>): void {
    const shouldLoopFocusInsidePopup = this._shouldLoopFocusInsidePopup();

    if (!shouldLoopFocusInsidePopup) {
      super._popupTabHandler(e);
    }
  }

  _renderPopup(): void {
    const {
      usePopover,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _scrollToSelectedItemEnabled,
      dropDownOptions: { fullScreen } = {},
    } = this.option();
    if (usePopover && !fullScreen) {
      if (_scrollToSelectedItemEnabled) {
        super._renderPopup();
      } else {
        this._renderPopover();
        this._attachPopupKeyHandler();
      }
    } else {
      super._renderPopup();
    }

    this._$popup?.addClass(LOOKUP_POPUP_CLASS);
    this._popup?.$wrapper()?.addClass(LOOKUP_POPUP_WRAPPER_CLASS);
  }

  _renderPopover(): void {
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
          ? (): number => getOuterWidth(this.$element()) as number
          : popupConfig.width,
      },
    );
    // @ts-expect-error fix on Dom Component level
    this._popup = this._createComponent(this._$popup, Popover, options);

    this._popup.$overlayContent().attr('role', 'dialog');

    this._popup.on({
      showing: this._popupShowingHandler.bind(this),
      shown: this._popupShownHandler.bind(this),
      hiding: this._popupHidingHandler.bind(this),
      hidden: this._popupHiddenHandler.bind(this),
      contentReady: this._contentReadyHandler.bind(this),
    });

    const { _scrollToSelectedItemEnabled: scrollToSelectedItemEnabledInPopover } = this.option();
    if (scrollToSelectedItemEnabledInPopover) {
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
    const { focusStateEnabled } = this.option();

    if (focusStateEnabled) {
      this.focus();
    }
  }

  _popupHiddenHandler(): void {
    super._popupHiddenHandler();

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _scrollToSelectedItemEnabled } = this.option();

    if (_scrollToSelectedItemEnabled) {
      resetPosition($(this._popup?.content()).parent());
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _preventFocusOnPopup(): void { }

  _shouldLoopFocusInsidePopup(): boolean {
    const {
      usePopover,
      dropDownCentered,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _scrollToSelectedItemEnabled,
    } = this.option();

    const result: boolean = _scrollToSelectedItemEnabled
      ? Boolean(dropDownCentered)
      : !usePopover;

    return result;
  }

  _popupConfig(): PopupProperties {
    const {
      dropDownOptions = {},
      dropDownCentered,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _scrollToSelectedItemEnabled,
    } = this.option();
    const shouldLoopFocusInsidePopup = this._shouldLoopFocusInsidePopup();

    const result: PopupProperties = {
      ...super._popupConfig(),
      toolbarItems: this._getPopupToolbarItems(),
      hideOnParentScroll: false,
      onPositioned: null,
      maxHeight: dropDownOptions.maxHeight,
      showTitle: dropDownOptions.showTitle,
      title: dropDownOptions.title,
      titleTemplate: this._getTemplateByOption('dropDownOptions.titleTemplate'),
      // @ts-expect-error fix on PopoverProperties level
      onTitleRendered: dropDownOptions.onTitleRendered,
      fullScreen: dropDownOptions.fullScreen,
      shading: dropDownOptions.shading,
      hideOnOutsideClick: dropDownOptions.hideOnOutsideClick,
      tabFocusLoopEnabled: shouldLoopFocusInsidePopup,
    };

    delete result.animation;
    delete result.position;

    if (_scrollToSelectedItemEnabled) {
      result.position = dropDownCentered ? {
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

    (['position', 'animation', 'width', 'height'] as const).forEach((optionName) => {
      const popupOptionValue = dropDownOptions[optionName];

      if (popupOptionValue !== undefined) {
        // @ts-expect-error fix on PopoverProperties level
        result[optionName] = popupOptionValue;
      }
    });

    return result;
  }

  _getPopupToolbarItems(): ToolbarItem[] {
    const { applyValueMode } = this.option();

    const buttonsConfig: LookupButtonConfig[] = applyValueMode === 'useButtons'
      ? this._popupToolbarItemsConfig()
      : [];

    const cancelButton = this._getCancelButtonConfig();
    if (cancelButton) {
      buttonsConfig.push(cancelButton);
    }

    const clearButton = this._getClearButtonConfig();
    if (clearButton) {
      buttonsConfig.push(clearButton);
    }

    return this._applyButtonsLocation(buttonsConfig);
  }

  _popupToolbarItemsConfig(): LookupButtonConfig[] {
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

  _getCancelButtonConfig(): LookupButtonConfig | null {
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

  _getClearButtonConfig(): LookupButtonConfig | null {
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

  _applyButtonHandler(args?: ButtonClickEvent): void {
    if (args) {
      this._saveValueChangeEvent(args.event);
    }
    // @ts-expect-error DataExpressionMixin
    this.option('value', this._valueGetter(this._currentSelectedItem()));
    super._applyButtonHandler();
  }

  _cancelButtonHandler(): void {
    this._refreshSelected();
    super._cancelButtonHandler();
  }

  _refreshPopupVisibility(): void {
    const { opened } = this.option();
    if (opened) {
      this._updateListDimensions();
    }
  }

  _dimensionChanged(): void {
    const { usePopover, dropDownOptions: { width: dropDownWidth } = {} } = this.option();
    if (usePopover && !dropDownWidth) {
      this.option('dropDownOptions.width', getWidth(this.$element()));
    }

    this._updateListDimensions();
  }

  _input(): dxElementWrapper {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this._$searchBox || super._input();
  }

  _renderPopupContent(): void {
    super._renderPopupContent();
    this._renderSearch();
  }

  // eslint-disable-next-line class-methods-use-this
  _renderValueChangeEvent(): void { }

  _renderSearch(): void {
    const { searchEnabled: isSearchEnabled, searchStartEvent } = this.option();

    this._toggleSearchClass(isSearchEnabled);

    if (isSearchEnabled) {
      this._$searchWrapper = $('<div>').addClass(LOOKUP_SEARCH_WRAPPER_CLASS);
      const $searchWrapper = this._$searchWrapper;

      this._$searchBox = $('<div>').addClass(LOOKUP_SEARCH_CLASS)
        .appendTo($searchWrapper);
      const $searchBox = this._$searchBox;

      const currentDevice = devices.current();
      const searchMode = currentDevice.android ? 'text' : 'search';

      let isKeyboardListeningEnabled = false;

      const textBoxOptions = {
        mode: searchMode,
        showClearButton: true,
        valueChangeEvent: searchStartEvent,
        inputAttr: { 'aria-label': messageLocalization.format('Search') },
        onDisposing: (): void => { isKeyboardListeningEnabled = false; },
        onFocusIn: (): void => { isKeyboardListeningEnabled = true; },
        onFocusOut: (): void => {
          isKeyboardListeningEnabled = false;
          this._list?.option('focusedElement', null);
        },
        onKeyboardHandled: (opts: KeyboardKeyDownEvent): void => {
          if (isKeyboardListeningEnabled) { this._list?._keyboardHandler(opts); }
        },
        onValueChanged: (): void => { this._searchHandler(); },
      };

      this._searchBox = this._createComponent($searchBox, TextBox, textBoxOptions);

      this._registerSearchKeyHandlers();
      // @ts-expect-error _$list is a List component; insertBefore expects a dxElementWrapper
      $searchWrapper.insertBefore(this._$list);

      this._setSearchPlaceholder();
    }
  }

  _filterDataSource(searchValue: string | null): void {
    if (this._list && !this._list._dataSource && this._isMinSearchLengthExceeded()) {
      this._list?._scrollView.startLoading();
    }
    super._filterDataSource(searchValue);
  }

  _dataSourceFiltered(searchValue?: string | null): void {
    super._dataSourceFiltered(searchValue);
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

  _selectListItemHandler(e: DxEvent<KeyboardEvent>): void {
    const { focusedElement } = this._list?.option() ?? {};

    const $itemElement = $(focusedElement);

    if (!$itemElement.length) {
      return;
    }

    e.preventDefault();
    e.target = $itemElement.get(0);
    this._saveValueChangeEvent(e);
    this._selectListItem(undefined, $itemElement);
  }

  _registerSearchKeyHandlers(): void {
    this._searchBox?.registerKeyHandler('enter', this._selectListItemHandler.bind(this));
    this._searchBox?.registerKeyHandler('space', this._selectListItemHandler.bind(this));
    this._searchBox?.registerKeyHandler('end', noop);
    this._searchBox?.registerKeyHandler('home', noop);
  }

  _toggleSearchClass(isSearchEnabled: boolean | undefined): void {
    if (this._popup) {
      this._popup.$wrapper()?.toggleClass(LOOKUP_POPUP_SEARCH_CLASS, isSearchEnabled);
    }
  }

  _setSearchPlaceholder(): void {
    if (!this._$searchBox) {
      return;
    }

    const { minSearchLength, searchPlaceholder } = this.option();
    let placeholder = searchPlaceholder;

    if (minSearchLength && placeholder === messageLocalization.format('Search')) {
      // @ts-expect-error getFormatter return type does not accept a numeric argument
      placeholder = messageLocalization.getFormatter('dxLookup-searchPlaceholder')(minSearchLength);
    }

    this._searchBox?.option('placeholder', placeholder);
  }

  // eslint-disable-next-line class-methods-use-this
  _setAriaTargetForList(): void { }

  _listConfig(): ListBaseProperties {
    const {
      searchEnabled,
      grouped,
      pullRefreshEnabled,
      useNativeScrolling,
      pullingDownText,
      pulledDownText,
      refreshingText,
      pageLoadingText,
      pageLoadMode,
      nextButtonText,
    } = this.option();

    return {
      ...super._listConfig(),
      ...{
        tabIndex: searchEnabled ? -1 : 0,
        grouped,
        groupTemplate: this._getTemplateByOption('groupTemplate'),
        pullRefreshEnabled,
        useNativeScrolling,
        pullingDownText,
        pulledDownText,
        refreshingText,
        pageLoadingText,
        onScroll: this._scrollHandler.bind(this),
        onPullRefresh: this._pullRefreshHandler.bind(this),
        onPageLoading: this._pageLoadingHandler.bind(this),
        pageLoadMode,
        nextButtonText,
        indicateLoading: searchEnabled,
      },
    };
  }

  _listContentReadyHandler(): void {
    super._listContentReadyHandler();
    this._refreshSelected();
  }

  _runWithoutCloseOnScroll(callback: () => void): void {
    // NOTE: Focus can trigger "scroll" event

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _scrollToSelectedItemEnabled } = this.option();
    const { hideOnParentScroll } = this._popup?.option() ?? {};

    if (!_scrollToSelectedItemEnabled) {
      callback();
    } else {
      this._popup?.option('hideOnParentScroll', false);
      callback();
      // eslint-disable-next-line no-restricted-globals
      this._hideOnParentScrollTimer = setTimeout(() => { // T1018037
        this._popup?.option('hideOnParentScroll', hideOnParentScroll);
      });
    }
  }

  _setFocusPolicy(): void {
    const { focusStateEnabled, searchEnabled } = this.option();
    if (!focusStateEnabled) {
      return;
    }

    this._runWithoutCloseOnScroll(() => {
      if (searchEnabled) {
        this._searchBox?.focus();
      } else {
        this._list?.focus();
      }
    });
  }

  _focusTarget(): dxElementWrapper {
    return this._$field;
  }

  _keyboardEventBindingTarget(): dxElementWrapper {
    return this._$field;
  }

  _listItemClickHandler(e?: ItemClickEvent<Item>): void {
    if (!e) return;
    this._saveValueChangeEvent(e.event);
    this._selectListItem(e.itemData, e.event?.currentTarget);
  }

  _selectListItem(itemData: unknown, target?: Element | dxElementWrapper): void {
    if (target) {
      this._list?.selectItem(target as Element);
    }

    const { applyValueMode } = this.option();

    if (applyValueMode === 'instantly') {
      this._applyButtonHandler();
    }
  }

  _currentSelectedItem(): Item | undefined {
    const { grouped } = this.option();
    const { selectedItems: [firstSelectedItem] = [] } = this._list?.option() ?? {};
    // @ts-expect-error should be fixed on List level
    return grouped ? firstSelectedItem?.items[0] as Item : firstSelectedItem;
  }

  _resetValue(e: ButtonClickEvent): void {
    this._saveValueChangeEvent(e.event);
    this.option('value', null);
    this.option('opened', false);
  }

  _searchValue(): string {
    const { searchEnabled } = this.option();
    const { value: searchBoxValue } = this._searchBox?.option() ?? {};
    return searchEnabled && this._searchBox ? (searchBoxValue as string) : '';
  }

  _renderInputValue(arg: { value?: unknown; renderOnly?: boolean } = {}): DeferredObj<unknown> {
    return super._renderInputValue(arg).always(() => {
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
    if (this._hideOnParentScrollTimer) {
      clearTimeout(this._hideOnParentScrollTimer);
    }
    this._hideOnParentScrollTimer = null;
    this._$searchBox = null;

    super._clean();
  }

  _optionChanged(args: OptionChanged<LookupProperties>): void {
    const { name, fullName, value } = args;

    switch (name) {
      case 'dataSource':
        super._optionChanged(args);
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
        super._optionChanged(args);
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
        super._optionChanged(args);
        break;
      case 'clearButtonText':
      case 'showClearButton':
      case 'showCancelButton':
        this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
        break;
      case 'applyValueMode':
        super._optionChanged(args);
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
      case 'pageLoadMode': {
        const { pageLoadMode } = this.option();
        this._setListOption('pageLoadMode', pageLoadMode);
        break;
      }
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
      case 'dropDownCentered': {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { _scrollToSelectedItemEnabled } = this.option();
        if (_scrollToSelectedItemEnabled) {
          this.option('dropDownOptions.position', undefined);
          this._renderPopup();
        }
        break;
      }
      default:
        super._optionChanged(args);
    }
  }

  focus(): void {
    const { opened } = this.option();
    if (opened) {
      this._setFocusPolicy();

      return;
    }

    // @ts-expect-error EventsEngine
    eventsEngine.trigger(this._focusTarget(), 'focus');
  }

  // @ts-expect-error not compatible with base class
  field(): dxElementWrapper {
    return this._$field;
  }
}

registerComponent('dxLookup', Lookup);

export default Lookup;
