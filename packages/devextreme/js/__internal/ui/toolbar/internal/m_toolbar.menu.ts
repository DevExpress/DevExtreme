import '@js/ui/popup/ui.popup';

import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ChildDefaultTemplate } from '@js/core/templates/child_default_template';
import { extend } from '@js/core/utils/extend';
import { getOuterHeight } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';
import Button from '@js/ui/button';
import type dxList from '@js/ui/list';
import type { dxPopupAnimation } from '@js/ui/popup';
import type Popup from '@js/ui/popup';
import { isFluent, isMaterialBased } from '@js/ui/themes';
import type { Item } from '@js/ui/toolbar';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import Widget from '@ts/core/widget/widget';

import { toggleItemFocusableElementTabIndex } from '../m_toolbar.utils';
import ToolbarMenuList from './m_toolbar.menu.list';

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_POPUP_CLASS = 'dx-dropdownmenu-popup';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';
const POPUP_BOUNDARY_VERTICAL_OFFSET = 10;
const POPUP_VERTICAL_OFFSET = 3;

export interface Properties extends WidgetOptions<DropDownMenu> {
  opened?: boolean;

  container: string | Element | undefined;

  animation?: dxPopupAnimation;

  items?: Item[];
}

export default class DropDownMenu extends Widget<Properties> {
  _button?: Button;

  _popup?: Popup;

  _list?: dxList;

  _$popup?: dxElementWrapper;

  _deferRendering?: boolean;

  _itemClickAction?: any;

  _buttonClickAction?: any;

  _supportedKeys() {
    let extension = {};

    if (!this.option('opened') || !this._list?.option('focusedElement')) {
      // @ts-expect-error
      extension = this._button._supportedKeys();
    }

    return extend(super._supportedKeys(), extension, {
      tab() {
        this._popup && this._popup.hide();
      },
    });
  }

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      items: [],
      // @ts-expect-error
      onItemClick: null,
      dataSource: null,
      itemTemplate: 'item',
      onButtonClick: null,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      opened: false,
      onItemRendered: null,
      closeOnClick: true,
      useInkRipple: false,
      container: undefined,
      animation: {
        show: { type: 'fade', from: 0, to: 1 },
        hide: { type: 'fade', to: 0 },
      },
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<Properties>[] {
    return super._defaultOptionsRules().concat([
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
          // @ts-expect-error
          return isMaterialBased();
        },
        options: {
          // @ts-expect-error
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
    this.setAria({
      haspopup: true,
      expanded: this.option('opened'),
    });
  }

  _renderContentImpl(): void {
    if (this.option('opened')) {
      this._renderPopup();
    }
  }

  _clean(): void {
    this._cleanFocusState();

    this._list && this._list.$element().remove();
    this._popup && this._popup.$element().remove();

    delete this._list;
    delete this._popup;
  }

  _renderButton(): void {
    const $button = this.$element().addClass(DROP_DOWN_MENU_BUTTON_CLASS);

    this._button = this._createComponent($button, Button, {
      icon: 'overflow',
      template: 'content',
      // @ts-expect-error
      stylingMode: isFluent() ? 'text' : 'contained',
      useInkRipple: this.option('useInkRipple'),
      hoverStateEnabled: false,
      focusStateEnabled: false,
      onClick: (e) => {
        this.option('opened', !this.option('opened'));
        this._buttonClickAction(e);
      },
    });
  }

  _toggleActiveState($element, value, e): void {
    // @ts-expect-error
    this._button._toggleActiveState($element, value, e);
  }

  _toggleMenuVisibility(opened) {
    const state = opened ?? !this._popup?.option('visible');

    if (opened) {
      this._renderPopup();
    }

    this._popup?.toggle(state);
    this.setAria('expanded', state);
  }

  _renderPopup(): void {
    if (this._$popup) {
      return;
    }

    this._$popup = $('<div>').appendTo(this.$element());
    const { rtlEnabled, container, animation } = this.option();

    this._popup = this._createComponent(this._$popup, 'dxPopup', {
      onInitialized({ component }) {
        component.$wrapper()
          .addClass(DROP_DOWN_MENU_POPUP_WRAPPER_CLASS)
          .addClass(DROP_DOWN_MENU_POPUP_CLASS);
      },
      deferRendering: false,
      preventScrollEvents: false,
      contentTemplate: (contentElement) => this._renderList(contentElement),
      _ignoreFunctionValueDeprecation: true,
      maxHeight: () => this._getMaxHeight(),
      position: {
        my: `top ${rtlEnabled ? 'left' : 'right'}`,
        at: `bottom ${rtlEnabled ? 'left' : 'right'}`,
        collision: 'fit flip',
        offset: { v: POPUP_VERTICAL_OFFSET },
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
      hideOnOutsideClick: (e) => this._closeOutsideDropDownHandler(e),
      hideOnParentScroll: true,
      shading: false,
      dragEnabled: false,
      showTitle: false,
      fullScreen: false,
      _fixWrapperPosition: true,
    });
  }

  _getMaxHeight() {
    const $element = this.$element();

    // @ts-expect-error
    const offsetTop = $element.offset().top;
    const windowHeight = getOuterHeight(getWindow());
    const maxHeight = Math.max(offsetTop, windowHeight - offsetTop - getOuterHeight($element));

    return Math.min(windowHeight, maxHeight - POPUP_VERTICAL_OFFSET - POPUP_BOUNDARY_VERTICAL_OFFSET);
  }

  _closeOutsideDropDownHandler(e): boolean {
    const isOutsideClick = !$(e.target).closest(this.$element()).length;

    return isOutsideClick;
  }

  _renderList(contentElement): void {
    const $content = $(contentElement);
    $content.addClass(DROP_DOWN_MENU_LIST_CLASS);

    // @ts-expect-error
    this._list = this._createComponent($content, ToolbarMenuList, {
      dataSource: this._getListDataSource(),
      pageLoadMode: 'scrollBottom',
      indicateLoading: false,
      noDataText: '',
      itemTemplate: this.option('itemTemplate'),
      onItemClick: (e) => {
        if (this.option('closeOnClick')) {
          this.option('opened', false);
        }
        this._itemClickAction(e);
      },
      tabIndex: -1,
      focusStateEnabled: false,
      activeStateEnabled: true,
      onItemRendered: this.option('onItemRendered'),
      _itemAttributes: { role: 'menuitem' },
    });
  }

  _itemOptionChanged(item, property, value): void {
    // @ts-expect-error
    this._list?._itemOptionChanged(item, property, value);
    toggleItemFocusableElementTabIndex(this._list, item);
  }

  _getListDataSource(): any {
    return this.option('dataSource') ?? this.option('items');
  }

  _setListDataSource(): void {
    this._list?.option('dataSource', this._getListDataSource());

    delete this._deferRendering;
  }

  _getKeyboardListeners() {
    return super._getKeyboardListeners().concat([this._list]);
  }

  _toggleVisibility(visible): void {
    super._toggleVisibility(visible);
    this._button?.option('visible', visible);
  }

  _optionChanged(args) {
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
        this._buttonClickAction();
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
        this._popup && this._popup.option(name, value);
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
    // @ts-expect-error
    this.option('items').forEach((item) => toggleItemFocusableElementTabIndex(this._list, item));
  }
}
