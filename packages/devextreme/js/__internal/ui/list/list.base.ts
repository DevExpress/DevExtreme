import { fx } from '@js/common/core/animation';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { end as swipeEventEnd } from '@js/common/core/events/swipe';
import { addNamespace } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import type { DataSourceOptions, GroupItem } from '@js/common/data';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { ensureDefined, noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { getImageContainer } from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { getHeight, getOuterHeight, setHeight } from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DataSourceLike } from '@js/data/data_source';
import type {
  DxEvent,
  InteractionEvent,
  NativeEventInfo,
  PointerInteractionEvent,
} from '@js/events';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type {
  GroupRenderedEvent,
  Item,
  PageLoadingEvent,
  Properties,
  PullRefreshEvent,
} from '@js/ui/list';
import type dxList from '@js/ui/list';
import type { ScrollEvent } from '@js/ui/scroll_view';
import { current, isMaterial, isMaterialBased } from '@js/ui/themes';
import { render } from '@ts/core/utils/m_ink_ripple';
import supportUtils from '@ts/core/utils/m_support';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import { getDataSourceOptions } from '@ts/data/data_converter/grouped';
import type {
  CollectionItemInfo,
  CollectionItemKey,
  Constructor,
  DataChange,
  InkRippleEvent,
  PostprocessRenderItemInfo,
} from '@ts/ui/collection/collection_widget.base';
import type { CollectionItemIndex } from '@ts/ui/collection/collection_widget.edit.strategy';
import type { CollectionWidgetLiveUpdateProperties } from '@ts/ui/collection/collection_widget.live_update';
import CollectionWidget from '@ts/ui/collection/collection_widget.live_update';
import ListItem from '@ts/ui/list/item';
import type { GroupedItem } from '@ts/ui/list/list.edit.strategy.grouped';
import type {
  ScrollView as ScrollViewType,
} from '@ts/ui/scroll_view/scroll_view';
import ScrollView from '@ts/ui/scroll_view/scroll_view';
import { deviceDependentOptions } from '@ts/ui/scroll_view/scrollable.device';
import type { ScrollOffset } from '@ts/ui/scroll_view/types';
import { getElementMargin } from '@ts/ui/scroll_view/utils/get_element_style';

const LIST_CLASS = 'dx-list';
const LIST_ITEMS_CLASS = 'dx-list-items';
export const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_ITEM_SELECTOR = `.${LIST_ITEM_CLASS}`;
const LIST_ITEM_ICON_CONTAINER_CLASS = 'dx-list-item-icon-container';
const LIST_ITEM_ICON_CLASS = 'dx-list-item-icon';
const LIST_GROUP_CLASS = 'dx-list-group';
const LIST_GROUP_HEADER_CLASS = 'dx-list-group-header';
const LIST_GROUP_BODY_CLASS = 'dx-list-group-body';
const LIST_COLLAPSIBLE_GROUPS_CLASS = 'dx-list-collapsible-groups';
const LIST_GROUP_COLLAPSED_CLASS = 'dx-list-group-collapsed';
const LIST_GROUP_HEADER_INDICATOR_CLASS = 'dx-list-group-header-indicator';
const LIST_HAS_NEXT_CLASS = 'dx-has-next';
const LIST_NEXT_BUTTON_CLASS = 'dx-list-next-button';
const LIST_SELECT_CHECKBOX = 'dx-list-select-checkbox';
const LIST_SELECT_RADIOBUTTON = 'dx-list-select-radiobutton';
const WRAP_ITEM_TEXT_CLASS = 'dx-wrap-item-text';
const SELECT_ALL_ITEM_SELECTOR = '.dx-list-select-all';

const LIST_ITEM_DATA_KEY = 'dxListItemData';
const LIST_FEEDBACK_SHOW_TIMEOUT = 70;

type ScrollViewConstructor = Constructor<ScrollViewType>;

// eslint-disable-next-line @typescript-eslint/naming-convention
let _scrollView: ScrollViewConstructor | null = null;

function getScrollView(): ScrollViewConstructor {
  return _scrollView ?? ScrollView;
}

export function setScrollView(value: ScrollViewConstructor): void {
  _scrollView = value;
}

export interface ListBaseProperties extends Properties<Item>, Omit<
  CollectionWidgetLiveUpdateProperties<ListBase, Item, CollectionItemKey>,
  keyof Properties<Item>
> {
  validationGroup?: string;

  _onItemsRendered?: () => void;

  showChevronExpr?: (data: Item) => boolean | undefined;

  badgeExpr?: (data: Item) => string | undefined;

  wrapItemText?: boolean;

  useInkRipple?: boolean;
}

type Direction = 'prev' | 'next';

export class ListBase extends CollectionWidget<ListBaseProperties, Item> {
  static ItemClass = ListItem;

  _$listContainer!: dxElementWrapper;

  _$container!: dxElementWrapper;

  _scrollView!: ScrollViewType;

  _$nextButton!: dxElementWrapper | null;

  _holdTimer?: ReturnType<typeof setTimeout>;

  _loadNextPageTimer?: ReturnType<typeof setTimeout>;

  _showLoadingIndicatorTimer?: ReturnType<typeof setTimeout>;

  _inkRippleTimer?: ReturnType<typeof setTimeout>;

  _isFirstLoadCompleted?: boolean;

  _groupRenderAction?: (e: Partial<GroupRenderedEvent>) => void;

  _itemElementsCache!: dxElementWrapper;

  _isLoadIndicationSuppressed?: boolean;

  _scrollAction?: (e: ScrollEvent) => void;

  _pullRefreshAction?: (e: PullRefreshEvent) => void;

  _pageLoadingAction?: (e: PageLoadingEvent) => void;

  _upInkRippleHandler?: (e: InkRippleEvent) => void;

  _downInkRippleHandler?: (e: InkRippleEvent) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _selectionChangeEventInstance?: any;

  protected _feedbackShowTimeout(): number {
    return LIST_FEEDBACK_SHOW_TIMEOUT;
  }

  _supportedKeys(): SupportedKeys {
    return {
      ...super._supportedKeys(),
      leftArrow: noop,
      rightArrow: noop,
      pageUp(e): void {
        this._moveFocusPerPage(e, 'prev');
      },
      pageDown(e): void {
        this._moveFocusPerPage(e, 'next');
      },
    };
  }

  _moveFocusPerPage(e: KeyboardEvent, direction: Direction): void {
    if (this._isLastItemFocused(direction)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    let $item = this._getEdgeVisibleItem(direction);
    const { focusedElement } = this.option();
    const isFocusedItem = $item.is($(focusedElement));

    if (isFocusedItem) {
      this.scrollTo(this._getItemLocation($item, direction));
      $item = this._getEdgeVisibleItem(direction);
    }

    this.option('focusedElement', getPublicElement($item));
    this.scrollToItem($item);
  }

  _isLastItemFocused(direction: Direction): boolean {
    const lastItemInDirection = direction === 'prev' ? this._itemElements().first() : this._itemElements().last();
    const { focusedElement } = this.option();
    return lastItemInDirection.is($(focusedElement));
  }

  _getNextItem($item: dxElementWrapper, direction: Direction): dxElementWrapper {
    const $items = this._getAvailableItems();
    const itemIndex = $items.index($item);

    if (direction === 'prev') {
      return $($items[itemIndex - 1]);
    }

    return $($items[itemIndex + 1]);
  }

  _getEdgeVisibleItem(direction: Direction): dxElementWrapper {
    const scrollTop = this.scrollTop();
    const containerHeight = getHeight(this.$element());

    const { focusedElement } = this.option();
    let $item = $(focusedElement);
    let isItemVisible = true;

    if (!$item.length) {
      return $();
    }

    while (isItemVisible) {
      const $nextItem = this._getNextItem($item, direction);

      if (!$nextItem.length) {
        break;
      }

      const nextItemLocation = ($nextItem.position()?.top ?? 0) + getOuterHeight($nextItem) / 2;
      isItemVisible = nextItemLocation < containerHeight + scrollTop
        && nextItemLocation > scrollTop;

      if (isItemVisible) {
        $item = $nextItem;
      }
    }

    return $item;
  }

  _getItemLocation($item: dxElementWrapper, direction: Direction): number {
    if (direction === 'prev') {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return $item.position().top - getHeight(this.$element()) + getOuterHeight($item);
    }

    // @ts-expect-error ts-error
    return $item.position().top;
  }

  _getDefaultOptions(): ListBaseProperties {
    return {
      ...super._getDefaultOptions(),
      hoverStateEnabled: true,
      pullRefreshEnabled: false,
      scrollingEnabled: true,
      selectByClick: true,
      showScrollbar: 'onScroll',
      useNativeScrolling: true,
      bounceEnabled: true,
      scrollByContent: true,
      scrollByThumb: false,
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
      // @ts-expect-error ts-error
      onItemSwipe: null,
      grouped: false,
      // @ts-expect-error ts-error
      onGroupRendered: null,
      collapsibleGroups: false,
      groupTemplate: 'group',
      indicateLoading: true,
      activeStateEnabled: true,
      _itemAttributes: { role: 'option' },
      useInkRipple: false,
      wrapItemText: false,
      showChevronExpr(data: Item): boolean | undefined {
        return data?.showChevron;
      },
      badgeExpr(data: Item): string | undefined { return data?.badge; },
      _onItemsRendered: (): void => {},
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<ListBaseProperties>[] {
    const themeName = current();

    return super._defaultOptionsRules().concat(deviceDependentOptions(), [
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
          return !supportUtils.nativeScrolling && !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
        },
        options: {
          showScrollbar: 'onHover',

          pageLoadMode: 'nextButton',
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
          useInkRipple: true,
        },
      },
      {
        device(): boolean {
          return isMaterialBased(themeName);
        },
        options: {
          pullingDownText: '',
          pulledDownText: '',
          refreshingText: '',
          pageLoadingText: '',
        },
      },
    ]);
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._updateLoadingState(true);
    }
  }

  _itemClass(): string {
    return LIST_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return LIST_ITEM_DATA_KEY;
  }

  _itemContainer(): dxElementWrapper {
    return this._$container;
  }

  _getItemsContainer(): dxElementWrapper {
    return this._$listContainer;
  }

  _cleanItemContainer(): void {
    super._cleanItemContainer();
    const listContainer = this._getItemsContainer();
    $(listContainer).empty();
    listContainer.appendTo(this._$container);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _saveSelectionChangeEvent(e): void {
    this._selectionChangeEventInstance = e;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  _getSelectionChangeEvent() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._selectionChangeEventInstance;
  }

  _refreshItemElements(): void {
    const { grouped } = this.option();
    const $itemsContainer = this._getItemsContainer();

    if (grouped) {
      this._itemElementsCache = $itemsContainer
        .children(`.${LIST_GROUP_CLASS}`)
        .children(`.${LIST_GROUP_BODY_CLASS}`)
        .children(this._itemSelector());
    } else {
      this._itemElementsCache = $itemsContainer.children(this._itemSelector());
    }
  }

  _getItemAndHeaderElements(): dxElementWrapper {
    const itemSelector = `> .${LIST_GROUP_BODY_CLASS} > ${this._itemSelector()}`;
    const itemAndHeaderSelector = `${itemSelector}, > .${LIST_GROUP_HEADER_CLASS}`;

    const $listGroup = this._getItemsContainer().children(`.${LIST_GROUP_CLASS}`);

    return $listGroup.find(itemAndHeaderSelector);
  }

  _getAvailableItems($itemElements?: dxElementWrapper): dxElementWrapper {
    const { collapsibleGroups } = this.option();

    if (collapsibleGroups) {
      const $elements = this._getItemAndHeaderElements();

      return $elements
        // @ts-expect-error ts-error
        .filter((_index: number, element: dxElementWrapper): boolean => {
          if ($(element).hasClass(LIST_GROUP_HEADER_CLASS)) {
            return true;
          }

          return !$(element).closest(`.${LIST_GROUP_CLASS}`).hasClass(LIST_GROUP_COLLAPSED_CLASS);
        });
    }

    return super._getAvailableItems($itemElements);
  }

  _modifyByChanges(changes: DataChange<Item>[], isPartialRefresh?: boolean): void {
    super._modifyByChanges(changes, isPartialRefresh);

    this._refreshItemElements();
    this._updateLoadingState(true);
  }

  reorderItem(
    itemElement: dxElementWrapper | CollectionItemIndex | Element,
    toItemElement: dxElementWrapper | CollectionItemIndex | Element,
  ): DeferredObj<unknown> {
    const promise = super.reorderItem(itemElement, toItemElement);

    return promise.done((): void => {
      this._refreshItemElements();
    });
  }

  deleteItem(itemElement: dxElementWrapper | CollectionItemIndex | Element): Promise<unknown> {
    const promise = super.deleteItem(itemElement);
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return promise.done((): void => {
      this._refreshItemElements();
    });
  }

  _itemElements(): dxElementWrapper {
    return this._itemElementsCache;
  }

  _itemSelectHandler(e: DxEvent):
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  DeferredObj<unknown> | void {
    const { selectionMode } = this.option();

    const isSingleSelectedItemClicked = selectionMode === 'single'
      && this.isItemSelected(e.currentTarget);

    if (isSingleSelectedItemClicked) {
      return;
    }

    const isSelectionControlClicked = $(e.target).closest(`.${LIST_SELECT_CHECKBOX}`).length
      || $(e.target).closest(`.${LIST_SELECT_RADIOBUTTON}`).length;

    if (isSelectionControlClicked) {
      this.option('focusedElement', getPublicElement($(e.currentTarget)));
    }

    // eslint-disable-next-line consistent-return
    return super._itemSelectHandler(e, isSelectionControlClicked);
  }

  _allowDynamicItemsAppend(): boolean {
    return true;
  }

  protected _activeStateUnit(): string {
    const { collapsibleGroups } = this.option();

    const selectors = [
      LIST_ITEM_SELECTOR,
      SELECT_ALL_ITEM_SELECTOR,
    ];

    if (collapsibleGroups) {
      selectors.push(`.${LIST_GROUP_HEADER_CLASS}`);
    }

    return selectors.join(',');
  }

  _init(): void {
    super._init();

    this._dataController.resetDataSourcePageIndex();
    this._$container = this.$element();

    this._$listContainer = $('<div>').addClass(LIST_ITEMS_CLASS);
    this._initScrollView();
    this._createGroupRenderAction();
  }

  _scrollBottomMode(): boolean {
    const { pageLoadMode } = this.option();

    return pageLoadMode === 'scrollBottom';
  }

  _nextButtonMode(): boolean {
    const { pageLoadMode } = this.option();

    return pageLoadMode === 'nextButton';
  }

  _dataSourceOptions(): DataSourceOptions {
    const scrollBottom = this._scrollBottomMode();
    const nextButton = this._nextButtonMode();

    return {
      ...super._dataSourceOptions(),
      paginate: ensureDefined(scrollBottom || nextButton, true),
    };
  }

  _getSpecificDataSourceOption(): DataSourceLike<Item>
    | DataSourceOptions<GroupItem<Item>>
    | null
    | undefined {
    const { grouped } = this.option();
    const dataSource = this.option('dataSource');

    if (dataSource && grouped) {
      return getDataSourceOptions<Item>(dataSource);
    }

    return dataSource;
  }

  _getGroupContainerByIndex(groupIndex: number): dxElementWrapper {
    return this._getItemsContainer().find(`.${LIST_GROUP_CLASS}`).eq(groupIndex).find(`.${LIST_GROUP_BODY_CLASS}`);
  }

  _dataSourceFromUrlLoadMode(): string {
    return 'raw';
  }

  _initScrollView(): void {
    const {
      height,
      width,
      disabled,
      showScrollbar,
      useNativeScrolling,
      bounceEnabled,
      scrollByContent,
      scrollByThumb,
      pullingDownText,
      pulledDownText,
      refreshingText,
      pageLoadingText,
      scrollingEnabled,
      pullRefreshEnabled,
    } = this.option();

    const isPullRefreshEnabled = scrollingEnabled && pullRefreshEnabled;
    const autoPagingEnabled = scrollingEnabled
      && this._scrollBottomMode()
      && !!this._dataController.getDataSource();

    this._scrollView = this._createComponent(this.$element(), getScrollView(), {
      height,
      width,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      disabled: disabled || !scrollingEnabled,
      onScroll: (e: ScrollEvent): void => {
        this._scrollHandler(e);
      },
      // @ts-expect-error ts-error
      onPullDown: isPullRefreshEnabled ? this._pullDownHandler.bind(this) : null,
      // @ts-expect-error ts-error
      onReachBottom: autoPagingEnabled ? this._scrollBottomHandler.bind(this) : null,
      showScrollbar,
      useNative: useNativeScrolling,
      bounceEnabled,
      scrollByContent,
      scrollByThumb,
      pullingDownText,
      pulledDownText,
      refreshingText,
      reachBottomText: pageLoadingText,
      useKeyboard: false,
    });

    this._$container = $(this._scrollView.content());

    this._$listContainer.appendTo(this._$container);

    const { wrapItemText } = this.option();
    this._toggleWrapItemText(wrapItemText);

    this._createScrollViewActions();
  }

  _toggleWrapItemText(value: boolean | undefined): void {
    this._$listContainer.toggleClass(WRAP_ITEM_TEXT_CLASS, value);
  }

  _createScrollViewActions(): void {
    this._scrollAction = this._createActionByOption('onScroll');
    this._pullRefreshAction = this._createActionByOption('onPullRefresh');
    this._pageLoadingAction = this._createActionByOption('onPageLoading');
  }

  _scrollHandler(e: ScrollEvent): void {
    this._scrollAction?.(e);
  }

  _initTemplates(): void {
    this._templateManager.addDefaultTemplates({
      group: new BindableTemplate(($container: dxElementWrapper, data: Item): void => {
        if (isPlainObject(data)) {
          if (data.key) {
            $container.text(data.key);
          }
        } else {
          $container.text(String(data));
        }
      }, ['key'], this.option('integrationOptions.watchMethod')),
    });
    super._initTemplates();
  }

  _prepareDefaultItemTemplate(data: Item, $container: dxElementWrapper): void {
    super._prepareDefaultItemTemplate(data, $container);

    if (data.icon) {
      const $imageContainer = getImageContainer(data.icon);
      if (!$imageContainer) {
        return;
      }

      const $icon = $imageContainer.addClass(LIST_ITEM_ICON_CLASS);
      const $iconContainer = $('<div>').addClass(LIST_ITEM_ICON_CONTAINER_CLASS);

      $iconContainer.append($icon);

      $container.prepend($iconContainer);
    }
  }

  _getBindableFields(): string[] {
    return ['text', 'html', 'icon'];
  }

  _updateLoadingState(tryLoadMore?: boolean): void {
    const dataController = this._dataController;
    const scrollBottomMode = this._scrollBottomMode();
    const isDataControllerLoading = dataController.isLoading();
    // @ts-expect-error mixin method
    const isLastPage = this._isLastPage();

    const shouldLoadNextPage = scrollBottomMode
      && Boolean(tryLoadMore)
      && !isDataControllerLoading
      && !isLastPage;

    if (this._shouldContinueLoading(shouldLoadNextPage)) {
      this._infiniteDataLoading();
    } else {
      this._scrollView.release(!shouldLoadNextPage && !dataController.isLoading());
      // @ts-expect-error mixin method
      this._toggleNextButton(this._shouldRenderNextButton() && !this._isLastPage());
      this._loadIndicationSuppressed(false);
    }
  }

  _shouldRenderNextButton(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._nextButtonMode() && this._dataController.isLoaded();
  }

  _isDataSourceFirstLoadCompleted(newValue?: boolean): boolean | undefined {
    if (isDefined(newValue)) {
      this._isFirstLoadCompleted = newValue;
    }

    return this._isFirstLoadCompleted;
  }

  _dataSourceLoadingChangedHandler(isLoading: boolean): void {
    if (this._loadIndicationSuppressed()) {
      return;
    }

    const { indicateLoading } = this.option();

    if (isLoading && indicateLoading) {
      // eslint-disable-next-line no-restricted-globals
      this._showLoadingIndicatorTimer = setTimeout((): void => {
        const isEmpty = !this._itemElements().length;
        const shouldIndicateLoading = !isEmpty || this._isDataSourceFirstLoadCompleted();
        if (shouldIndicateLoading) {
          this._scrollView?.startLoading();
        }
      });
    } else {
      clearTimeout(this._showLoadingIndicatorTimer);
      this._scrollView?.finishLoading();
    }
    if (!isLoading) {
      this._isDataSourceFirstLoadCompleted(false);
    }
  }

  _dataSourceChangedHandler(newItems: Item[], e?: { changes?: DataChange<Item>[] }): void {
    if (!this._shouldAppendItems() && hasWindow()) {
      this._scrollView?.scrollTo(0);
    }

    super._dataSourceChangedHandler(newItems, e);

    this._isDataSourceFirstLoadCompleted(true);
  }

  _refreshContent(): void {
    this._prepareContent();
    this._fireContentReadyAction();
  }

  _hideLoadingIfLoadIndicationOff(): void {
    const { indicateLoading } = this.option();

    if (!indicateLoading) {
      this._dataSourceLoadingChangedHandler(false);
    }
  }

  _loadIndicationSuppressed(value?: boolean): boolean | undefined {
    if (arguments.length) {
      this._isLoadIndicationSuppressed = value;
    }
    return this._isLoadIndicationSuppressed;
  }

  _scrollViewIsFull(): boolean {
    const scrollView = this._scrollView;
    return !scrollView || getHeight(scrollView.content()) > getHeight(scrollView.container());
  }

  _pullDownHandler(): void {
    const pullRefreshArgs = {
      component: this as unknown as dxList,
      element: this.element(),
    };
    this._pullRefreshAction?.(pullRefreshArgs);
    const dataController = this._dataController;

    if (dataController.getDataSource() && !dataController.isLoading()) {
      this._clearSelectedItems();
      dataController.pageIndex(0);
      dataController.reload();
    } else {
      this._updateLoadingState();
    }
  }

  _shouldContinueLoading(shouldLoadNextPage: boolean): boolean {
    if (!shouldLoadNextPage) {
      return false;
    }

    const $content = this._scrollView.content();
    const $container = this._scrollView.container();
    const contentHeight = getHeight($content);
    const containerHeight = getHeight($container);
    const offsetTop = this._scrollView.scrollOffset()?.top ?? 0;
    const isBottomReached = contentHeight - containerHeight < offsetTop;
    const isFull = this._scrollViewIsFull();

    return (shouldLoadNextPage && !isFull) || isBottomReached;
  }

  _infiniteDataLoading(): void {
    const isElementVisible = this.$element().is(':visible');

    if (isElementVisible) {
      clearTimeout(this._loadNextPageTimer);

      // eslint-disable-next-line no-restricted-globals
      this._loadNextPageTimer = setTimeout((): void => {
        this._loadNextPage();
      });
    }
  }

  _scrollBottomHandler(e: PageLoadingEvent): void {
    this._pageLoadingAction?.(e);
    const dataController = this._dataController;
    // @ts-expect-error ts-error mixin method
    if (!dataController.isLoading() && !this._isLastPage()) {
      this._loadNextPage();
    } else {
      this._updateLoadingState();
    }
  }

  _renderItems(items: Item[]): void {
    const { grouped } = this.option();

    if (grouped) {
      each(items, this._renderGroup.bind(this));
      this._attachGroupCollapseEvent();
      this._renderEmptyMessage();
      if (isMaterial(current())) {
        this.attachGroupHeaderInkRippleEvents();
      }
    } else {
      super._renderItems(items);
    }

    this._refreshItemElements();
    this._updateLoadingState(true);
  }

  _postProcessRenderItems(): void {
    const { _onItemsRendered: onItemsRendered } = this.option();
    onItemsRendered?.();
  }

  _attachGroupCollapseEvent(): void {
    const { collapsibleGroups } = this.option();
    // @ts-expect-error ts-error
    const eventNameClick = addNamespace(clickEventName, this.NAME);
    const headerSelector = `.${LIST_GROUP_HEADER_CLASS}`;

    const $element = this.$element();

    $element.toggleClass(LIST_COLLAPSIBLE_GROUPS_CLASS, collapsibleGroups);

    eventsEngine.off($element, eventNameClick, headerSelector);

    if (collapsibleGroups) {
      eventsEngine.on(
        $element,
        eventNameClick,
        headerSelector,
        (e: DxEvent<PointerInteractionEvent>): void => {
          this._processGroupCollapse(e);
        },
      );
    }
  }

  _processGroupCollapse(e: DxEvent<InteractionEvent>): void {
    const actionCallback = (
      evt: NativeEventInfo<InteractionEvent>,
    ): void => {
      const { focusStateEnabled } = this.option();
      const $group = $(evt.event?.currentTarget).parent();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._collapseGroupHandler($group);

      if (focusStateEnabled) {
        const groupHeader = getPublicElement($group.find(`.${LIST_GROUP_HEADER_CLASS}`));

        this.option({ focusedElement: groupHeader });
      }
    };

    const actionParams = {
      validatingTargetName: 'element',
    };

    const action = this._createAction(actionCallback, actionParams);

    action({ event: e });
  }

  _enterKeyHandler(e: DxEvent<KeyboardEvent>): void {
    const { collapsibleGroups, focusedElement } = this.option();
    const isGroupHeader = $(focusedElement).hasClass(LIST_GROUP_HEADER_CLASS);

    if (collapsibleGroups && isGroupHeader) {
      // @ts-expect-error ts-error
      const params: DxEvent<KeyboardEvent> = this._getHandlerExtendedParams(e, $(focusedElement));

      this._processGroupCollapse(params);

      return;
    }

    super._enterKeyHandler(e);
  }

  _collapseGroupHandler(
    $group: dxElementWrapper,
    toggle?: boolean,
  ): DeferredObj<unknown> | Promise<unknown> {
    const deferred = Deferred();

    const $groupHeader = $group.children(`.${LIST_GROUP_HEADER_CLASS}`);
    const collapsed = $group.hasClass(LIST_GROUP_COLLAPSED_CLASS);

    this._updateGroupHeaderAriaExpanded($groupHeader, collapsed);

    if (collapsed === toggle) {
      return deferred.resolve();
    }

    const $groupBody = $group.children(`.${LIST_GROUP_BODY_CLASS}`);
    const startHeight = getOuterHeight($groupBody);

    let endHeight = 0;

    if (collapsed) {
      setHeight($groupBody, 'auto');
      endHeight = getOuterHeight($groupBody);
    }

    $group.toggleClass(LIST_GROUP_COLLAPSED_CLASS, toggle);

    const groupBodyElement = $groupBody.get(0);

    if (fx.isAnimating(groupBodyElement)) {
      fx.stop(groupBodyElement, false);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate(groupBodyElement, {
      // @ts-expect-error fx.animate does not have proper typing
      type: 'custom',
      // @ts-expect-error fx.animate does not have proper typing
      from: { height: startHeight },
      // @ts-expect-error fx.animate does not have proper typing
      to: { height: endHeight },
      duration: 200,
      complete: (): void => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.updateDimensions();
        this._updateLoadingState(true);
        deferred.resolve();
      },
    });

    return deferred.promise();
  }

  _dataSourceLoadErrorHandler(): void {
    this._forgetNextPageLoading();

    if (this._initialized) {
      this._renderEmptyMessage();
      this._updateLoadingState();
    }
  }

  _initMarkup(): void {
    this._itemElementsCache = $();

    this.$element().addClass(LIST_CLASS);
    super._initMarkup();

    const { useInkRipple } = this.option();
    if (useInkRipple) {
      this._renderInkRipple();
    }

    const elementAria = {
      role: 'group',
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: messageLocalization.format('dxList-ariaRoleDescription'),
    };

    this.setAria(elementAria, this.$element());

    this._setListAria();
  }

  _renderEmptyMessage(rootNodes?: Item[]): boolean {
    const isEmpty = super._renderEmptyMessage(rootNodes);

    this.setAria({ role: isEmpty ? undefined : 'application' }, this._focusTarget());

    return isEmpty;
  }

  _isMultiSelectMode(): boolean {
    const { selectionMode } = this.option();
    return selectionMode === 'multiple' || selectionMode === 'all';
  }

  _setListAria(): void {
    const { items, allowItemDeleting, collapsibleGroups } = this.option();

    const label = allowItemDeleting
      ? messageLocalization.format('dxList-listAriaLabel-deletable')
      : messageLocalization.format('dxList-listAriaLabel');

    const shouldSetAria = items?.length && !collapsibleGroups;

    const listArea = {
      role: shouldSetAria ? 'listbox' : undefined,
      label: shouldSetAria ? label : undefined,
      // eslint-disable-next-line spellcheck/spell-checker
      multiselectable: shouldSetAria && this._isMultiSelectMode() ? 'true' : undefined,
    };

    this.setAria(listArea, this._$listContainer);
  }

  _focusTarget(): dxElementWrapper {
    return this._itemContainer();
  }

  _renderInkRipple(): void {
    this._inkRipple = render();
  }

  _toggleActiveState(
    $element: dxElementWrapper,
    value: boolean,
    event: InkRippleEvent,
  ): void {
    super._toggleActiveState($element, value);

    if (!this._inkRipple) {
      return;
    }

    const config = {
      element: $element,
      event,
    };

    if (value) {
      if (isMaterial(current())) {
        // eslint-disable-next-line no-restricted-globals
        this._inkRippleTimer = setTimeout((): void => {
          this._inkRipple?.showWave(config);
        }, LIST_FEEDBACK_SHOW_TIMEOUT / 2);
      } else {
        this._inkRipple.showWave(config);
      }
    } else {
      clearTimeout(this._inkRippleTimer);
      this._inkRipple.hideWave(config);
    }
  }

  _postprocessRenderItem(args: PostprocessRenderItemInfo<Item>): void {
    this._refreshItemElements();
    super._postprocessRenderItem(args);
    this._updateSwipeEventSubscription($(args.itemElement));
  }

  _getElementClassToSkipRefreshId(): string {
    return LIST_GROUP_HEADER_CLASS;
  }

  _updateSwipeEventSubscription($itemElement: dxElementWrapper = this._itemElements()): void {
    // @ts-expect-error ts-error
    const endEventName = addNamespace(swipeEventEnd, this.NAME);
    eventsEngine.off($itemElement, endEventName);

    if (this.hasActionSubscription('onItemSwipe')) {
      eventsEngine.on($itemElement, endEventName, (e) => {
        this._itemSwipeEndHandler(e);
      });
    }
  }

  _itemSwipeEndHandler(e: DxEvent & { offset: number }): void {
    this._itemDXEventHandler(e, 'onItemSwipe', {
      direction: e.offset < 0 ? 'left' : 'right',
    });
  }

  on(eventName: string | { [key: string]: Function }, eventHandler?: Function): this {
    const result = super.on(eventName, eventHandler);

    const hasItemSwipeHandler = eventName === 'itemSwipe'
      || (isPlainObject(eventName) && Object.prototype.hasOwnProperty.call(eventName, 'itemSwipe'));

    if (hasItemSwipeHandler) {
      this._updateSwipeEventSubscription();
    }

    return result;
  }

  off(eventName: string, eventHandler?: Function): this {
    const result = super.off(eventName, eventHandler);

    if (eventName === 'itemSwipe') {
      this._updateSwipeEventSubscription();
    }

    return result;
  }

  _nextButtonHandler(): void {
    const pageLoadingArgs = {
      component: this as unknown as dxList,
      element: this.element(),
    };
    this._pageLoadingAction?.(pageLoadingArgs);
    const dataController = this._dataController;
    if (dataController.getDataSource() && !dataController.isLoading()) {
      this._scrollView.toggleLoading(true);
      this._$nextButton?.detach();
      this._loadIndicationSuppressed(true);
      this._loadNextPage();
    }
  }

  _setGroupAria($group: dxElementWrapper, groupHeaderId: string): void {
    const { collapsibleGroups } = this.option();

    const groupAria = {
      role: collapsibleGroups ? undefined : 'group',
      // eslint-disable-next-line spellcheck/spell-checker
      labelledby: collapsibleGroups ? undefined : groupHeaderId,
    };

    this.setAria(groupAria, $group);
  }

  _updateGroupHeaderAriaExpanded($groupHeader: dxElementWrapper, expanded: boolean): void {
    this.setAria({ expanded }, $groupHeader);
  }

  _setGroupHeaderAria($groupHeader: dxElementWrapper, listGroupBodyId: string): void {
    const { collapsibleGroups } = this.option();

    const groupHeaderAria = {
      role: collapsibleGroups ? 'button' : undefined,
      expanded: collapsibleGroups ? true : undefined,
      controls: collapsibleGroups ? listGroupBodyId : undefined,
    };

    this.setAria(groupHeaderAria, $groupHeader);
  }

  _setGroupBodyAria($groupBody: dxElementWrapper, groupHeaderId: string): void {
    const { collapsibleGroups } = this.option();

    const groupHeaderAria = {
      role: collapsibleGroups ? 'listbox' : undefined,
      // eslint-disable-next-line spellcheck/spell-checker
      labelledby: collapsibleGroups ? groupHeaderId : undefined,
      // eslint-disable-next-line spellcheck/spell-checker
      multiselectable: collapsibleGroups && this._isMultiSelectMode() ? 'true' : undefined,
    };

    this.setAria(groupHeaderAria, $groupBody);
  }

  _renderGroup(index: number, group: GroupedItem): void {
    const $groupElement = $('<div>')
      .addClass(LIST_GROUP_CLASS)
      .appendTo(this._getItemsContainer());

    const groupHeaderId = `dx-${new Guid().toString()}`;

    const $groupHeaderElement = $('<div>')
      .addClass(LIST_GROUP_HEADER_CLASS)
      .attr('id', groupHeaderId)
      .appendTo($groupElement);

    const { groupTemplate: templateName } = this.option();

    const groupTemplate = this._getTemplate(
      group.template ?? templateName,
      // @ts-expect-error ts-error
      group,
      index,
      $groupHeaderElement,
    );

    const renderArgs = {
      index,
      itemData: group,
      container: getPublicElement($groupHeaderElement),
    };

    this._createItemByTemplate(groupTemplate, renderArgs);

    $('<div>')
      .addClass(LIST_GROUP_HEADER_INDICATOR_CLASS)
      .prependTo($groupHeaderElement);

    const groupBodyId = `dx-${new Guid().toString()}`;

    const $groupBody = $('<div>')
      .addClass(LIST_GROUP_BODY_CLASS)
      .attr('id', groupBodyId)
      .appendTo($groupElement);

    const groupItemsGetter = compileGetter('items');

    // @ts-expect-error ts-error
    each(groupItemsGetter(group) || [], (itemIndex: number, item: Item): void => {
      this._renderItem({ group: index, item: itemIndex }, item, $groupBody);
    });
    this._groupRenderAction?.({
      groupElement: getPublicElement<HTMLElement>($groupElement),
      groupIndex: index,
      groupData: group,
    });

    this._setGroupAria($groupElement, groupHeaderId);
    this._setGroupHeaderAria($groupHeaderElement, groupBodyId);
    this._setGroupBodyAria($groupBody, groupHeaderId);
  }

  downInkRippleHandler(e: InkRippleEvent): void {
    this._toggleActiveState($(e.currentTarget), true, e);
  }

  upInkRippleHandler(e: InkRippleEvent): void {
    this._toggleActiveState($(e.currentTarget), false, e);
  }

  attachGroupHeaderInkRippleEvents(): void {
    const selector = `.${LIST_GROUP_HEADER_CLASS}`;
    const $element = this.$element();

    this._downInkRippleHandler = this._downInkRippleHandler ?? this.downInkRippleHandler.bind(this);
    this._upInkRippleHandler = this._upInkRippleHandler ?? this.upInkRippleHandler.bind(this);

    // @ts-expect-error ts-error
    eventsEngine.off($element, pointerEvents.down, selector, this._downInkRippleHandler);
    eventsEngine.on($element, pointerEvents.down, selector, this._downInkRippleHandler);
    // @ts-expect-error ts-error
    eventsEngine.off($element, [pointerEvents.up, pointerEvents.out].join(' '), selector, this._upInkRippleHandler);
    eventsEngine.on($element, [pointerEvents.up, pointerEvents.out].join(' '), selector, this._upInkRippleHandler);
  }

  _createGroupRenderAction(): void {
    this._groupRenderAction = this._createActionByOption('onGroupRendered');
  }

  _clean(): void {
    clearTimeout(this._inkRippleTimer);
    if (this._$nextButton) {
      this._$nextButton.remove();
      this._$nextButton = null;
    }
    super._clean();
  }

  _dispose(): void {
    this._isDataSourceFirstLoadCompleted(false);
    clearTimeout(this._holdTimer);
    clearTimeout(this._loadNextPageTimer);
    clearTimeout(this._showLoadingIndicatorTimer);
    super._dispose();
  }

  _toggleDisabledState(value: boolean): void {
    super._toggleDisabledState(value);

    const { scrollingEnabled } = this.option();

    this._scrollView.option('disabled', value || !scrollingEnabled);
  }

  _toggleNextButton(value: boolean): void {
    const dataController = this._dataController;
    const $nextButton = this._getNextButton();

    this.$element().toggleClass(LIST_HAS_NEXT_CLASS, value);

    if (value && dataController.isLoaded()) {
      $nextButton.appendTo(this._itemContainer());
    }

    if (!value) {
      $nextButton.detach();
    }
  }

  _getNextButton(): dxElementWrapper {
    if (!this._$nextButton) {
      this._$nextButton = this._createNextButton();
    }
    return this._$nextButton;
  }

  _createNextButton(): dxElementWrapper {
    const $result = $('<div>').addClass(LIST_NEXT_BUTTON_CLASS);

    const $button = $('<div>').appendTo($result);

    const { nextButtonText } = this.option();

    this._createComponent<Button, ButtonProperties>($button, Button, {
      text: nextButtonText,
      onClick: (): void => {
        this._nextButtonHandler();
      },
      type: isMaterialBased(current()) ? 'default' : undefined,
      // @ts-expect-error
      integrationOptions: {},
    });

    return $result;
  }

  _moveFocus(location: string): void {
    super._moveFocus(location);

    const { focusedElement } = this.option();
    if (focusedElement) {
      this.scrollToItem(focusedElement);
    }
  }

  _refresh(): void {
    if (!hasWindow()) {
      super._refresh();
    } else {
      const scrollTop = this._scrollView.scrollTop();
      super._refresh();
      if (scrollTop) {
        this._scrollView.scrollTo(scrollTop);
      }
    }
  }

  _optionChanged(args: OptionChanged<ListBaseProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'pageLoadMode':
        this._toggleNextButton(!!value);
        this._initScrollView();
        break;
      case 'dataSource':
        super._optionChanged(args);
        this._initScrollView();
        this._updateLoadingState(true);
        this._isDataSourceFirstLoadCompleted(false);
        break;
      case 'items':
        super._optionChanged(args);
        this._isDataSourceFirstLoadCompleted(false);
        break;
      case 'pullingDownText':
      case 'pulledDownText':
      case 'refreshingText':
      case 'pageLoadingText':
      case 'showScrollbar':
      case 'bounceEnabled':
      case 'scrollByContent':
      case 'scrollByThumb':
      case 'useNativeScrolling':
      case 'scrollingEnabled':
      case 'pullRefreshEnabled':
        this._initScrollView();
        this._updateLoadingState(true);
        break;
      case 'nextButtonText':
      case 'onItemSwipe':
      case 'useInkRipple':
        this._invalidate();
        break;
      case 'onScroll':
      case 'onPullRefresh':
      case 'onPageLoading':
        this._createScrollViewActions();
        break;
      case 'grouped':
      case 'groupTemplate':
        this._invalidate();
        break;
      case 'collapsibleGroups':
        this._invalidate();
        break;
      case 'wrapItemText':
        this._toggleWrapItemText(value);
        break;
      case 'onGroupRendered':
        this._createGroupRenderAction();
        break;
      case 'width':
      case 'height':
        super._optionChanged(args);
        this._scrollView.option(name, value);
        this._scrollView.update();
        break;
      case 'indicateLoading':
        this._hideLoadingIfLoadIndicationOff();
        break;
      case 'visible':
        super._optionChanged(args);
        this._scrollView.update();
        break;
      case 'rtlEnabled':
        this._initScrollView();
        super._optionChanged(args);
        break;
      case 'showChevronExpr':
      case 'badgeExpr':
        this._invalidate();
        break;
      case '_onItemsRendered':
      case 'selectByClick':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _extendActionArgs(
    $itemElement: dxElementWrapper,
  ): CollectionItemInfo<Item> {
    const { grouped } = this.option();

    if (!grouped) {
      return super._extendActionArgs($itemElement);
    }

    const $group = $itemElement.closest(`.${LIST_GROUP_CLASS}`);
    const $item = $group.find(`.${LIST_ITEM_CLASS}`);

    return {
      ...super._extendActionArgs($itemElement),
      itemIndex: {
        group: $group.index(),
        item: $item.index($itemElement),
      },
    };
  }

  expandGroup(groupIndex: number): Promise<unknown> {
    const deferred = Deferred();
    const $group = this._getItemsContainer().find(`.${LIST_GROUP_CLASS}`).eq(groupIndex);
    // @ts-expect-error ts-error
    this._collapseGroupHandler($group, false).done(() => {
      // @ts-expect-error ts-error
      deferred.resolveWith(this);
    });

    return deferred.promise();
  }

  collapseGroup(groupIndex: number): DeferredObj<unknown> {
    const deferred = Deferred();
    const $group = this._getItemsContainer().find(`.${LIST_GROUP_CLASS}`).eq(groupIndex);
    // @ts-expect-error ts-error
    this._collapseGroupHandler($group, true).done(() => {
      // @ts-expect-error ts-error
      deferred.resolveWith(this);
    });

    return deferred;
  }

  updateDimensions(): Promise<unknown> {
    const deferred = Deferred();

    if (this._scrollView) {
      this._scrollView.update().done((): void => {
        if (!this._scrollViewIsFull()) {
          this._updateLoadingState(true);
        }
        // @ts-expect-error ts-error
        deferred.resolveWith(this);
      });
    } else {
      // @ts-expect-error ts-error
      deferred.resolveWith(this);
    }

    return deferred.promise();
  }

  reload(): void {
    super.reload();
    this.scrollTo(0);
    this._pullDownHandler();
  }

  repaint(): void {
    this.scrollTo(0);
    super.repaint();
  }

  scrollTop(): number {
    return this._scrollView.scrollOffset().top ?? 0;
  }

  clientHeight(): number | undefined {
    return this._scrollView.clientHeight();
  }

  scrollHeight(): number | undefined {
    return this._scrollView.scrollHeight();
  }

  scrollBy(distance: Partial<ScrollOffset> | number): void {
    this._scrollView.scrollBy(distance);
  }

  scrollTo(location: Partial<ScrollOffset> | number): void {
    this._scrollView.scrollTo(location);
  }

  scrollToItem(itemElement: number | Element | dxElementWrapper | Item | undefined): void {
    if (!isDefined(itemElement)) {
      return;
    }

    const $item = this._editStrategy.getItemElement(itemElement);

    this._scrollView.scrollToElement($item, {
      bottom: getElementMargin($item?.get(0), 'bottom'),
    });
  }

  _dimensionChanged(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.updateDimensions();
  }
}
