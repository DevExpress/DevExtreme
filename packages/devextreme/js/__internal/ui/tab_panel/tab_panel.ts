import type {
  DefaultOptionsRule,
  Orientation,
  Position,
  TabsIconPosition,
  TabsStyle,
} from '@js/common';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { getImageContainer } from '@js/core/utils/icon';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Item, Properties } from '@js/ui/tab_panel';
import { current as currentTheme, isFluent, isMaterialBased } from '@js/ui/themes';
import supportUtils from '@ts/core/utils/m_support';
import type { OptionChanged } from '@ts/core/widget/types';
import type { MultiViewProperties } from '@ts/ui/multi_view/multi_view';
import MultiView from '@ts/ui/multi_view/multi_view';
import type { TabsProperties } from '@ts/ui/tabs/tabs';
import Tabs, {
  TABS_ITEM_TEXT_CLASS,
  TABS_ITEM_TEXT_SPAN_CLASS,
  TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS,
} from '@ts/ui/tabs/tabs';

import TabPanelItem from './item';

// STYLE tabPanel

export const TABPANEL_CLASS = 'dx-tabpanel';
const TABPANEL_TABS_CLASS = 'dx-tabpanel-tabs';
export const TABPANEL_TABS_ITEM_CLASS = 'dx-tabpanel-tab';
export const TABPANEL_CONTAINER_CLASS = 'dx-tabpanel-container';

export const DISABLED_FOCUSED_TAB_CLASS = 'dx-disabled-focused-tab';

export const TABPANEL_TABS_POSITION_CLASS: Record<Position, string> = {
  top: 'dx-tabpanel-tabs-position-top',
  right: 'dx-tabpanel-tabs-position-right',
  bottom: 'dx-tabpanel-tabs-position-bottom',
  left: 'dx-tabpanel-tabs-position-left',
};

export const TABS_POSITION: Record<Position, Position> = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
};

const TABS_INDICATOR_POSITION_BY_TABS_POSITION: Record<Position, Position> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export const TABS_ORIENTATION: Record<Orientation, Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

const ICON_POSITION: Record<TabsIconPosition, TabsIconPosition> = {
  top: 'top',
  end: 'end',
  bottom: 'bottom',
  start: 'start',
};

const STYLING_MODE: Record<TabsStyle, TabsStyle> = {
  primary: 'primary',
  secondary: 'secondary',
};

export interface TabPanelProperties extends Properties, Omit<
  MultiViewProperties,
  keyof Properties
> {
  _tabsIndicatorPosition?: Position | null;

  badgeExpr?: (data) => string | undefined;
}

class TabPanel extends MultiView<TabPanelProperties> {
  static ItemClass = TabPanelItem;

  _titleHoldAction!: (event?: Record<string, unknown>) => void;

  _titleRenderedAction!: (event?: Record<string, unknown>) => void;

  _titleClickAction!: (event?: Record<string, unknown>) => void;

  _tabs!: Tabs;

  _isFocusOutHandlerExecuting?: boolean;

  _$container!: dxElementWrapper;

  _$tabContainer!: dxElementWrapper;

  _getDefaultOptions(): TabPanelProperties {
    return {
      ...super._getDefaultOptions(),
      itemTitleTemplate: 'title',
      hoverStateEnabled: true,
      selectOnFocus: false,
      showNavButtons: false,
      scrollByContent: true,
      scrollingEnabled: true,
      tabsPosition: TABS_POSITION.top,
      iconPosition: ICON_POSITION.start,
      stylingMode: STYLING_MODE.primary,
      // @ts-expect-error ts-error
      onTitleClick: null,
      // @ts-expect-error ts-error
      onTitleHold: null,
      // @ts-expect-error ts-error
      onTitleRendered: null,
      badgeExpr(data: Item): string | undefined {
        return data?.badge;
      },
      _tabsIndicatorPosition: null,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TabPanelProperties>[] {
    const themeName = currentTheme();

    return super._defaultOptionsRules().concat([
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
          return !supportUtils.touch;
        },
        options: {
          swipeEnabled: false,
        },
      },
      {
        device: { platform: 'generic' },
        options: {
          animationEnabled: false,
        },
      },
      {
        device(): boolean {
          return isFluent(themeName);
        },
        options: {
          stylingMode: STYLING_MODE.secondary,
        },
      },
      {
        device(): boolean {
          return isMaterialBased(themeName);
        },
        options: {
          iconPosition: ICON_POSITION.top,
        },
      },
    ]);
  }

  _init(): void {
    super._init();

    this.$element().addClass(TABPANEL_CLASS);
    this._toggleTabPanelTabsPositionClass();
  }

  _getElementAria(): Record<string, string> {
    return { role: 'tabpanel' };
  }

  _getItemAria(): Record<string, string> {
    return { role: 'tabpanel' };
  }

  _initMarkup(): void {
    super._initMarkup();

    this._createTitleActions();
    this._renderLayout();
  }

  _prepareTabsItemTemplate(data: Item, $container: dxElementWrapper): void {
    const $iconElement = getImageContainer(data?.icon);

    if ($iconElement) {
      $container.append($iconElement);
    }

    const title = isPlainObject(data) ? data?.title : data;

    if (isDefined(title) && !isPlainObject(title)) {
      const $tabTextSpan = $('<span>').addClass(TABS_ITEM_TEXT_SPAN_CLASS);
      $tabTextSpan.append(domAdapter.createTextNode(title));

      const $tabTextSpanPseudo = $('<span>').addClass(TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS);
      $tabTextSpanPseudo.append(domAdapter.createTextNode(title));
      $tabTextSpanPseudo.appendTo($tabTextSpan);

      $tabTextSpan.appendTo($container);
    }
  }

  _initTemplates(): void {
    super._initTemplates();

    this._templateManager.addDefaultTemplates({
      title: new BindableTemplate(($container: dxElementWrapper, data: Item) => {
        this._prepareTabsItemTemplate(data, $container);

        const $tabItem = $('<div>').addClass(TABS_ITEM_TEXT_CLASS);

        $container.wrapInner($tabItem);
      }, ['title', 'icon'], this.option('integrationOptions.watchMethod')),
    });
  }

  _createTitleActions(): void {
    this._createTitleClickAction();
    this._createTitleHoldAction();
    this._createTitleRenderedAction();
  }

  _createTitleClickAction(): void {
    this._titleClickAction = this._createActionByOption('onTitleClick');
  }

  _createTitleHoldAction(): void {
    this._titleHoldAction = this._createActionByOption('onTitleHold');
  }

  _createTitleRenderedAction(): void {
    this._titleRenderedAction = this._createActionByOption('onTitleRendered');
  }

  _renderLayout(): void {
    if (this._tabs) {
      return;
    }

    const $element = this.$element();

    this._$tabContainer = $('<div>')
      .addClass(TABPANEL_TABS_CLASS)
      .appendTo($element);

    const $tabs = $('<div>').appendTo(this._$tabContainer);

    this._tabs = this._createComponent($tabs, Tabs, this._tabConfig());

    this._$container = $('<div>')
      .addClass(TABPANEL_CONTAINER_CLASS)
      .appendTo($element);
    this._$container.append(this._$wrapper);

    const { focusStateEnabled, selectedIndex } = this.option();
    if (focusStateEnabled && isDefined(selectedIndex)) {
      const selectedItem = this._tabs.itemElements().get(selectedIndex);

      if (selectedItem) {
        this._tabs.option({ focusedElement: selectedItem });
      }
    }
  }

  _refreshActiveDescendant(): void {
    if (!this._tabs) {
      return;
    }

    const tabs = this._tabs;
    const tabItems = tabs.itemElements();
    // @ts-expect-error ts-error
    const $activeTab = $(tabItems[tabs.option('selectedIndex')]);
    const id = this.getFocusedItemId();

    this.setAria('controls', undefined, $(tabItems));
    this.setAria('controls', id, $activeTab);
  }

  _getTabsIndicatorPosition(): Position {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _tabsIndicatorPosition, tabsPosition } = this.option();

    return _tabsIndicatorPosition
      ?? TABS_INDICATOR_POSITION_BY_TABS_POSITION[tabsPosition ?? TABS_POSITION.top];
  }

  _tabConfig(): TabsProperties {
    const tabsIndicatorPosition = this._getTabsIndicatorPosition();

    const {
      focusStateEnabled,
      hoverStateEnabled,
      repaintChangesOnly,
      tabIndex,
      selectedIndex,
      badgeExpr,
      itemHoldTimeout,
      items,
      scrollingEnabled,
      scrollByContent,
      showNavButtons,
      loop,
      iconPosition,
      stylingMode,
    } = this.option();

    return {
      selectOnFocus: true,
      focusStateEnabled,
      hoverStateEnabled,
      repaintChangesOnly,
      tabIndex,
      selectedIndex,
      badgeExpr,
      onItemClick: this._titleClickAction.bind(this),
      onItemHold: this._titleHoldAction.bind(this),
      itemHoldTimeout,
      onSelectionChanging: (e): void => {
        const newTabsSelectedItemData = e.addedItems[0];
        const newTabsSelectedIndex = this._getIndexByItemData(newTabsSelectedItemData);

        const selectingResult = this.selectItem(newTabsSelectedIndex);
        // @ts-expect-error ts-error
        const promiseState = selectingResult.state();
        if (promiseState !== 'pending') {
          // NOTE: Keep selection change process synchronious if possible.
          e.cancel = promiseState === 'rejected';
          return;
        }

        e.cancel = new Promise((resolve) => {
          selectingResult
            // @ts-expect-error ts-error
            .done(() => {
              resolve(false);
            })
            .fail(() => {
              resolve(true);
            });
        });
      },
      onSelectionChanged: (): void => {
        this._refreshActiveDescendant();
      },
      onItemRendered: this._titleRenderedAction.bind(this),
      itemTemplate: this._getTemplateByOption('itemTitleTemplate'),
      items,
      // @ts-expect-error ts-error
      noDataText: null,
      scrollingEnabled,
      scrollByContent,
      showNavButtons,
      itemTemplateProperty: 'tabTemplate',
      loopItemFocus: loop,
      selectionRequired: true,
      onOptionChanged: (args): void => {
        if (args.name === 'focusedElement') {
          if (args.value) {
            const $value = $(args.value);
            const $newItem = this._itemElements().eq($value.index());
            this.option('focusedElement', getPublicElement($newItem));
          } else {
            this.option('focusedElement', args.value);
          }
        }
      },
      onFocusIn: (args): void => { this._focusInHandler(args.event); },
      onFocusOut: (args): void => {
        if (!this._isFocusOutHandlerExecuting) {
          this._focusOutHandler(args.event);
        }
      },
      orientation: this._getTabsOrientation(),
      iconPosition,
      stylingMode,
      _itemAttributes: { class: TABPANEL_TABS_ITEM_CLASS },
      _indicatorPosition: tabsIndicatorPosition,
    };
  }

  _renderFocusTarget(): void {
    this._focusTarget().attr('tabIndex', -1);
  }

  _getTabsOrientation(): Orientation {
    const { tabsPosition } = this.option();
    // @ts-expect-error ts-error
    if ([TABS_POSITION.right, TABS_POSITION.left].includes(tabsPosition)) {
      return TABS_ORIENTATION.vertical;
    }

    return TABS_ORIENTATION.horizontal;
  }

  _getTabPanelTabsPositionClass(): string {
    const { tabsPosition } = this.option();

    switch (tabsPosition) {
      case TABS_POSITION.right:
        return TABPANEL_TABS_POSITION_CLASS.right;
      case TABS_POSITION.bottom:
        return TABPANEL_TABS_POSITION_CLASS.bottom;
      case TABS_POSITION.left:
        return TABPANEL_TABS_POSITION_CLASS.left;
      case TABS_POSITION.top:
      default:
        return TABPANEL_TABS_POSITION_CLASS.top;
    }
  }

  _toggleTabPanelTabsPositionClass(): void {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const key in TABPANEL_TABS_POSITION_CLASS) {
      this.$element().removeClass(TABPANEL_TABS_POSITION_CLASS[key]);
    }

    const newClass = this._getTabPanelTabsPositionClass();

    this.$element().addClass(newClass);
  }

  _updateTabsOrientation(): void {
    const orientation = this._getTabsOrientation();

    this._setTabsOption('orientation', orientation);
  }

  _toggleWrapperFocusedClass(isFocused: boolean): void {
    this._toggleFocusClass(isFocused, this._$wrapper);
  }

  _toggleDisabledFocusedClass(isFocused: boolean): void {
    this._focusTarget().toggleClass(DISABLED_FOCUSED_TAB_CLASS, isFocused);
  }

  _updateFocusState(e: DxEvent, isFocused: boolean): void {
    super._updateFocusState(e, isFocused);

    const isTabsTarget = e.target === this._tabs._focusTarget().get(0);
    const isMultiViewTarget = e.target === this._focusTarget().get(0);

    if (isTabsTarget) {
      this._toggleFocusClass(isFocused, this._focusTarget());
    }

    if (isTabsTarget || isMultiViewTarget) {
      // @ts-expect-error ts-error
      const isDisabled = this._isDisabled(this.option('focusedElement'));

      this._toggleWrapperFocusedClass(isFocused && !isDisabled);
      this._toggleDisabledFocusedClass(isFocused && isDisabled);
    }

    if (isMultiViewTarget) {
      this._toggleFocusClass(isFocused, this._tabs.$element());
      // @ts-expect-error ts-error
      this._toggleFocusClass(isFocused, this._tabs.option('focusedElement'));
    }
  }

  _focusOutHandler(e: DxEvent): void {
    this._isFocusOutHandlerExecuting = true;
    super._focusOutHandler(e);

    this._tabs._focusOutHandler(e);
    this._isFocusOutHandlerExecuting = false;
  }

  _setTabsOption(name: keyof TabsProperties, value: unknown): void {
    if (this._tabs) {
      this._tabs.option(name, value);
    }
  }

  _postprocessSwipe(args: { swipedTabsIndex: number }): void {
    this._setTabsOption('selectedIndex', args.swipedTabsIndex);
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._tabs._dimensionChanged();
    }
  }

  registerKeyHandler(key: string, handler: (event?) => void): void {
    super.registerKeyHandler(key, handler);

    if (this._tabs) {
      this._tabs.registerKeyHandler(key, handler);
    }
  }

  repaint(): void {
    super.repaint();
    this._tabs.repaint();
  }

  _updateTabsIndicatorPosition(): void {
    const value = this._getTabsIndicatorPosition();

    this._setTabsOption('_indicatorPosition', value);
  }

  _optionChanged(args: OptionChanged<TabPanelProperties>): void {
    const { name, value, fullName } = args;

    switch (name) {
      case 'dataSource':
        super._optionChanged(args);
        break;
      case 'items':
        this._setTabsOption(name, this.option(name));
        if (!this.option('repaintChangesOnly')) {
          this._tabs.repaint();
        }
        super._optionChanged(args);
        break;
      case 'width':
        super._optionChanged(args);
        this._tabs.repaint();
        break;
      case 'selectedIndex':
      case 'selectedItem': {
        this._setTabsOption(fullName, value);
        super._optionChanged(args);

        const { focusStateEnabled } = this.option();

        if (focusStateEnabled === true) {
          const selectedIndex = this.option('selectedIndex');
          // @ts-expect-error ts-error
          const selectedTabContent = this._itemElements().eq(selectedIndex);
          this.option('focusedElement', getPublicElement(selectedTabContent));
        }
        break;
      }
      case 'itemHoldTimeout':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._setTabsOption(fullName, value);
        super._optionChanged(args);
        break;
      case 'scrollingEnabled':
      case 'scrollByContent':
      case 'showNavButtons':
        this._setTabsOption(fullName, value);
        break;
      case 'focusedElement': {
        const id = value ? $(value).index() : value;
        // @ts-expect-error ts-error
        const newItem = value && this._tabs ? this._tabs._itemElements().eq(id) : value;
        // @ts-expect-error ts-error
        this._setTabsOption('focusedElement', getPublicElement(newItem));

        if (value) {
          // @ts-expect-error ts-error
          const isDisabled = this._isDisabled(value);

          this._toggleWrapperFocusedClass(!isDisabled);
          this._toggleDisabledFocusedClass(isDisabled);
        }

        super._optionChanged(args);
        break;
      }
      case 'itemTitleTemplate':
        this._setTabsOption('itemTemplate', this._getTemplateByOption('itemTitleTemplate'));
        break;
      case 'onTitleClick':
        this._createTitleClickAction();
        this._setTabsOption('onItemClick', this._titleClickAction.bind(this));
        break;
      case 'onTitleHold':
        this._createTitleHoldAction();
        this._setTabsOption('onItemHold', this._titleHoldAction.bind(this));
        break;
      case 'onTitleRendered':
        this._createTitleRenderedAction();
        this._setTabsOption('onItemRendered', this._titleRenderedAction.bind(this));
        break;
      case 'loop':
        this._setTabsOption('loopItemFocus', value);
        super._optionChanged(args);
        break;
      case 'badgeExpr':
        this._invalidate();
        break;
      case 'tabsPosition':
        this._toggleTabPanelTabsPositionClass();
        this._updateTabsIndicatorPosition();
        this._updateTabsOrientation();
        break;
      case 'iconPosition':
        this._setTabsOption('iconPosition', value);
        break;
      case 'stylingMode':
        this._setTabsOption('stylingMode', value);
        break;
      case '_tabsIndicatorPosition':
        this._setTabsOption('_indicatorPosition', value);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxTabPanel', TabPanel);

export default TabPanel;
