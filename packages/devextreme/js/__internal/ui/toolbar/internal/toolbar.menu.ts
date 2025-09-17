import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ChildDefaultTemplate } from '@js/core/templates/child_default_template';
import { getOuterHeight } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';
import type { DataSourceLike } from '@js/data/data_source';
import type { DxEvent } from '@js/events';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import type { Item as ListItem, ItemClickEvent } from '@js/ui/list';
import type { dxPopupAnimation } from '@js/ui/popup';
import { current, isFluent, isMaterialBased } from '@js/ui/themes';
import type { Item } from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import Button from '@ts/ui/button/wrapper';
import type { ListBase } from '@ts/ui/list/list.base';
import Popup from '@ts/ui/popup/m_popup';
import ToolbarMenuList, { TOOLBAR_MENU_ACTION_CLASS } from '@ts/ui/toolbar/internal/toolbar.menu.list';
import { toggleItemFocusableElementTabIndex } from '@ts/ui/toolbar/toolbar.utils';

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_POPUP_CLASS = 'dx-dropdownmenu-popup';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';
const POPUP_BOUNDARY_VERTICAL_OFFSET = 10;
const POPUP_VERTICAL_OFFSET = 3;

export interface DropDownMenuProperties extends WidgetProperties<DropDownMenu> {
  opened?: boolean;
  container: string | Element | undefined;
  animation?: dxPopupAnimation;
  items?: Item[];
  dataSource?: DataSourceLike<Item, string | number> | null;
  itemTemplate?: string | (() => void);
  onItemRendered?: (e: Record<string, unknown>) => void;
  onItemClick?: (e) => void;
  onButtonClick?: (e: ClickEvent) => void;
  useInkRipple?: boolean;
  closeOnClick?: boolean;
}

export default class DropDownMenu extends Widget<DropDownMenuProperties> {
  _button!: Button;

  _popup?: Popup;

  _list?: ListBase;

  _$popup?: dxElementWrapper;

  _deferRendering?: boolean;

  _itemClickAction?: (e: Partial<ItemClickEvent<ListItem>>) => void;

  _buttonClickAction?: (e: ClickEvent) => void;

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | void> {
    let extension = {};
    const { opened } = this.option();

    if (!opened || !this._list?.option('focusedElement')) {
      extension = this._button._supportedKeys();
    }

    return {
      ...super._supportedKeys(),
      ...extension,
      tab(): void {
        this._popup?.hide();
      },
    };
  }

  _getDefaultOptions(): DropDownMenuProperties {
    return {
      ...super._getDefaultOptions(),
      items: [],
      dataSource: null,
      itemTemplate: 'item',
      activeStateEnabled: true,
      hoverStateEnabled: true,
      opened: false,
      closeOnClick: true,
      useInkRipple: false,
      container: undefined,
      animation: {
        show: { type: 'fade', from: 0, to: 1 },
        hide: { type: 'fade', to: 0 },
      },
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<DropDownMenuProperties>[] {
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
          return isMaterialBased(current());
        },
        options: {
          useInkRipple: true,
          animation: {
            show: {
              type: 'pop',
              duration: 200,
              from: { scale: 0 },
              to: { scale: 1 },
            },
            hide: {
              type: 'pop',
              duration: 200,
              from: { scale: 1 },
              to: { scale: 0 },
            },
          },
        },
      },
    ]);
  }

  _init(): void {
    super._init();

    this.$element().addClass(DROP_DOWN_MENU_CLASS);

    this._initItemClickAction();
    this._initButtonClickAction();
  }

  _initItemClickAction(): void {
    this._itemClickAction = this._createActionByOption('onItemClick', {});
  }

  _initButtonClickAction(): void {
    this._buttonClickAction = this._createActionByOption('onButtonClick', {});
  }

  _initTemplates(): void {
    this._templateManager.addDefaultTemplates({
      content: new ChildDefaultTemplate('content'),
    });
    super._initTemplates();
  }

  _initMarkup(): void {
    this._renderButton();
    super._initMarkup();
  }

  _render(): void {
    super._render();

    const { opened } = this.option();

    this.setAria({
      haspopup: true,
      expanded: opened,
    });
  }

  _renderContentImpl(): void {
    const { opened } = this.option();
    if (opened) {
      this._renderPopup();
    }
  }

  _clean(): void {
    this._cleanFocusState();

    this._list?.$element().remove();
    this._popup?.$element().remove();

    delete this._list;
    delete this._popup;
  }

  _renderButton(): void {
    const $button = this.$element().addClass(DROP_DOWN_MENU_BUTTON_CLASS);

    const { useInkRipple } = this.option();

    this._button = this._createComponent<Button, ButtonProperties>($button, Button, {
      icon: 'overflow',
      template: 'content',
      stylingMode: isFluent(current()) ? 'text' : 'contained',
      // @ts-expect-error
      useInkRipple,
      hoverStateEnabled: false,
      focusStateEnabled: false,
      onClick: (e: ClickEvent) => {
        this.option('opened', !this.option('opened'));
        this._buttonClickAction?.(e);
      },
    });
  }

  _toggleActiveState(
    $element: dxElementWrapper,
    value: boolean,
  ): void {
    this._button._toggleActiveState($element[0], value);
  }

  _toggleMenuVisibility(opened: boolean | undefined): void {
    const state = opened ?? !this._popup?.option('visible');

    if (opened) {
      this._renderPopup();
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup?.toggle(state);
    this.setAria('expanded', state);
  }

  _renderPopup(): void {
    if (this._$popup) {
      return;
    }

    this._$popup = $('<div>').appendTo(this.$element());
    const {
      rtlEnabled,
      container,
      animation,
    } = this.option();

    this._popup = this._createComponent(this._$popup, Popup, {
      onInitialized(e) {
        const { component } = e;
        // @ts-expect-error
        component.$wrapper()
          .addClass(DROP_DOWN_MENU_POPUP_WRAPPER_CLASS)
          .addClass(DROP_DOWN_MENU_POPUP_CLASS);
      },
      deferRendering: false,
      preventScrollEvents: false,
      _ignorePreventScrollEventsDeprecation: true,
      contentTemplate: (contentElement) => this._renderList(contentElement),
      _ignoreFunctionValueDeprecation: true,
      // @ts-expect-error
      maxHeight: () => this._getMaxHeight(),
      position: {
        // @ts-expect-error
        my: `top ${rtlEnabled ? 'left' : 'right'}`,
        // @ts-expect-error
        at: `bottom ${rtlEnabled ? 'left' : 'right'}`,
        collision: 'fit flip',
        // @ts-expect-error
        offset: { v: POPUP_VERTICAL_OFFSET },
        // @ts-expect-error
        of: this.$element(),
      },
      animation,
      onOptionChanged: ({ name, value }) => {
        if (name === 'visible') {
          this.option('opened', value);
        }
      },
      container,
      autoResizeEnabled: false,
      height: 'auto',
      width: 'auto',
      hideOnOutsideClick: (
        e: DxEvent<MouseEvent | PointerEvent | TouchEvent>,
      ) => this._closeOutsideDropDownHandler(e),
      hideOnParentScroll: true,
      shading: false,
      dragEnabled: false,
      showTitle: false,
      fullScreen: false,
      ignoreChildEvents: false,
      _fixWrapperPosition: true,
    });
    this._popup.registerKeyHandler('space', (
      e: DxEvent<KeyboardEvent>,
    ) => {
      this._popupKeyHandler(e);
    });
    this._popup.registerKeyHandler('enter', (
      e: DxEvent<KeyboardEvent>,
    ) => {
      this._popupKeyHandler(e);
    });
    this._popup.registerKeyHandler('escape', (
      e: DxEvent<KeyboardEvent>,
    ): void => {
      if (this._popup?.$overlayContent().is($(e.target))) {
        this.option('opened', false);
      }
    });
  }

  _getMaxHeight(): number {
    const $element = this.$element();

    const offsetTop = $element.offset()?.top ?? 0;
    const windowHeight = getOuterHeight(getWindow());
    const maxHeight = Math.max(
      offsetTop,
      windowHeight - offsetTop - getOuterHeight($element),
    );

    return Math.min(
      windowHeight,
      maxHeight - POPUP_VERTICAL_OFFSET - POPUP_BOUNDARY_VERTICAL_OFFSET,
    );
  }

  _closeOutsideDropDownHandler(
    e: DxEvent<MouseEvent | PointerEvent | TouchEvent>,
  ): boolean {
    const isOutsideClick = !$(e.target).closest(this.$element()).length;

    return isOutsideClick;
  }

  _renderList(contentElement: Element): void {
    const $content = $(contentElement);
    $content.addClass(DROP_DOWN_MENU_LIST_CLASS);

    const { itemTemplate, onItemRendered } = this.option();

    this._list = this._createComponent($content, ToolbarMenuList, {
      dataSource: this._getListDataSource(),
      pageLoadMode: 'scrollBottom',
      indicateLoading: false,
      noDataText: '',
      itemTemplate,
      onItemClick: (
        e: ItemClickEvent<ListItem>,
      ) => {
        this._itemClickHandler(e);
      },
      tabIndex: -1,
      focusStateEnabled: false,
      activeStateEnabled: true,
      onItemRendered,
      _itemAttributes: { role: 'menuitem' },
    });
  }

  _popupKeyHandler(e: DxEvent<KeyboardEvent>): void {
    if ($(e.target).closest(`.${TOOLBAR_MENU_ACTION_CLASS}`).length) {
      this._closePopup();
    }
  }

  _closePopup(): void {
    const { closeOnClick } = this.option();
    if (closeOnClick) {
      this.option('opened', false);
    }
  }

  _itemClickHandler(e: ItemClickEvent<ListItem>): void {
    this._closePopup();
    this._itemClickAction?.(e);
  }

  _itemOptionChanged(
    item: Item,
    property: 'disabled',
    value: unknown,
  ): void {
    this._list?._itemOptionChanged(item, property, value);
    toggleItemFocusableElementTabIndex(this._list, item);
  }

  _getListDataSource(): DataSourceLike<Item, string | number> | Item[] {
    const { dataSource, items = [] } = this.option();
    return dataSource ?? items;
  }

  _setListDataSource(): void {
    this._list?.option('dataSource', this._getListDataSource());

    delete this._deferRendering;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getKeyboardListeners(): any[] {
    return super._getKeyboardListeners().concat([this._list]);
  }

  _toggleVisibility(visible: boolean): void {
    super._toggleVisibility(visible);
    this._button?.option('visible', visible);
  }

  _optionChanged(args: OptionChanged<DropDownMenuProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'items':
      case 'dataSource':
        if (!this.option('opened')) {
          this._deferRendering = true;
        } else {
          this._setListDataSource();
        }
        break;
      case 'itemTemplate':
        this._list?.option(name, this._getTemplate(value));
        break;
      case 'onItemClick':
        this._initItemClickAction();
        break;
      case 'onButtonClick':
        this._initButtonClickAction();
        break;
      case 'useInkRipple':
        this._invalidate();
        break;
      case 'focusStateEnabled':
        this._list?.option(name, value);
        super._optionChanged(args);
        break;
      case 'onItemRendered':
        this._list?.option(name, value);
        break;
      case 'opened':
        if (this._deferRendering) {
          this._setListDataSource();
        }
        this._toggleMenuVisibility(value);
        this._updateFocusableItemsTabIndex();
        break;
      case 'closeOnClick':
        break;
      case 'container':
        this._popup?.option(name, value);
        break;
      case 'disabled':
        if (this._list) {
          this._updateFocusableItemsTabIndex();
        }
        break;
      default:
        super._optionChanged(args);
    }
  }

  _updateFocusableItemsTabIndex(): void {
    const { items = [] } = this.option();

    items.forEach((item) => toggleItemFocusableElementTabIndex(this._list, item));
  }
}
