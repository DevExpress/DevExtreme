import { fx } from '@js/common/core/animation';
import { locate, move } from '@js/common/core/animation/translator';
import type { Cancelable, ItemInfo, NativeEventInfo } from '@js/common/core/events';
import { name as clickEventName } from '@js/common/core/events/click';
import { active } from '@js/common/core/events/core/emitter.feedback';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { getOuterWidth, setWidth } from '@js/core/utils/size';
import type { DxEvent } from '@js/events';
import type dxActionSheet from '@js/ui/action_sheet';
import type { Item } from '@js/ui/list';
import { current, isMaterialBased } from '@js/ui/themes';
import ActionSheet from '@ts/ui/action_sheet';
import type { BagConfig, SwipeEndArgs, SwipeUpdateArgs } from '@ts/ui/list/list.edit.decorator';
import SwitchableEditDecorator from '@ts/ui/list/list.edit.decorator.switchable';
import { register as registerDecorator } from '@ts/ui/list/list.edit.decorator_registry';

const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const CLICK_EVENT_NAME = addNamespace(clickEventName, LIST_EDIT_DECORATOR);
const ACTIVE_EVENT_NAME = addNamespace(active, LIST_EDIT_DECORATOR);

const SLIDE_MENU_CLASS = 'dx-list-slide-menu';
const SLIDE_MENU_WRAPPER_CLASS = 'dx-list-slide-menu-wrapper';

const SLIDE_MENU_CONTENT_CLASS = 'dx-list-slide-menu-content';
const SLIDE_MENU_BUTTONS_CONTAINER_CLASS = 'dx-list-slide-menu-buttons-container';

const SLIDE_MENU_BUTTONS_CLASS = 'dx-list-slide-menu-buttons';
const SLIDE_MENU_BUTTON_CLASS = 'dx-list-slide-menu-button';

const SLIDE_MENU_BUTTON_MENU_CLASS = 'dx-list-slide-menu-button-menu';
const SLIDE_MENU_BUTTON_DELETE_CLASS = 'dx-list-slide-menu-button-delete';

const SLIDE_MENU_ANIMATION_DURATION = 400;
const SLIDE_MENU_ANIMATION_EASING = 'cubic-bezier(0.075, 0.82, 0.165, 1)';

interface Positions {
  content: number;
  buttonsContainer: number;
  buttons: number;
}

class SwitchableEditDecoratorSlide extends SwitchableEditDecorator {
  _$buttonsContainer!: dxElementWrapper;

  _$buttons!: dxElementWrapper;

  _menu!: ActionSheet;

  _$cachedContent?: dxElementWrapper;

  _cachedButtonWidth!: number;

  _cachedItemWidth!: number;

  _cachedNode?: Element;

  _shouldHandleSwipe(): boolean {
    return true;
  }

  _init(): void {
    super._init();

    this._$buttonsContainer = $('<div>').addClass(SLIDE_MENU_BUTTONS_CONTAINER_CLASS);
    eventsEngine.on(this._$buttonsContainer, ACTIVE_EVENT_NAME, noop);

    this._$buttons = $('<div>')
      .addClass(SLIDE_MENU_BUTTONS_CLASS)
      .appendTo(this._$buttonsContainer);

    this._renderMenu();
    this._renderDeleteButton();
  }

  _renderMenu(): void {
    const { menuItems = [] } = this._list.option();
    if (!menuItems.length) {
      return;
    }

    if (menuItems.length === 1) {
      const menuItem = menuItems[0];

      this._renderMenuButton(menuItem.text ?? '', (e: DxEvent): void => {
        e.stopPropagation();
        this._fireAction(menuItem);
      });
    } else {
      const $menu = $('<div>').addClass(SLIDE_MENU_CLASS);
      this._menu = this._list._createComponent($menu, ActionSheet, {
        showTitle: false,
        items: menuItems,
        onItemClick: (
          args: NativeEventInfo<dxActionSheet<Item>, MouseEvent | PointerEvent> & ItemInfo<Item>,
        ): void => {
          this._fireAction(args.itemData);
        },
        // @ts-expect-error ts-error
        integrationOptions: {},
      });
      $menu.appendTo(this._list.$element());

      const $menuButton = this._renderMenuButton(messageLocalization.format('dxListEditDecorator-more'), (e: DxEvent): void => {
        e.stopPropagation();
        this._menu.show();
      });
      this._menu.option('target', $menuButton);
    }
  }

  _renderMenuButton(text: string, action: (e: DxEvent) => void): dxElementWrapper {
    const $menuButton = $('<div>')
      .addClass(SLIDE_MENU_BUTTON_CLASS)
      .addClass(SLIDE_MENU_BUTTON_MENU_CLASS)
      .text(text);

    this._$buttons.append($menuButton);
    eventsEngine.on($menuButton, CLICK_EVENT_NAME, action);

    return $menuButton;
  }

  _renderDeleteButton(): void {
    const { allowItemDeleting } = this._list.option();

    if (!allowItemDeleting) {
      return;
    }

    const $deleteButton = $('<div>')
      .addClass(SLIDE_MENU_BUTTON_CLASS)
      .addClass(SLIDE_MENU_BUTTON_DELETE_CLASS)
      .text(isMaterialBased(current())
        ? ''
        : messageLocalization.format('dxListEditDecorator-delete'));

    eventsEngine.on($deleteButton, CLICK_EVENT_NAME, (e: DxEvent): void => {
      e.stopPropagation();
      this._deleteItem();
    });

    this._$buttons.append($deleteButton);
  }

  _fireAction(menuItem): void {
    this._list._itemEventHandlerByHandler(
      $(this._cachedNode),
      menuItem.action,
      {},
      { excludeValidators: ['disabled', 'readOnly'] },
    );
    this._cancelDeleteReadyItem();
  }

  modifyElement(config: BagConfig): void {
    super.modifyElement(config);

    const { $itemElement } = config;

    $itemElement
      .addClass(SLIDE_MENU_WRAPPER_CLASS);

    const $slideMenuContent = $('<div>')
      .addClass(SLIDE_MENU_CONTENT_CLASS);

    $itemElement.wrapInner($slideMenuContent);
  }

  _getDeleteButtonContainer(): dxElementWrapper {
    return this._$buttonsContainer;
  }

  handleClick($itemElement: dxElementWrapper, e: DxEvent): boolean {
    if ($(e.target).closest(`.${SLIDE_MENU_CONTENT_CLASS}`).length) {
      return super.handleClick($itemElement, e);
    }
    return false;
  }

  _swipeStartHandler($itemElement: dxElementWrapper): void {
    this._enablePositioning($itemElement);
    this._cacheItemData($itemElement);
    this._setPositions(this._getPositions(0));
  }

  _swipeUpdateHandler(
    $itemElement: dxElementWrapper,
    e: DxEvent & SwipeUpdateArgs & Cancelable,
  ): void {
    const rtl = this._isRtlEnabled();
    const signCorrection = rtl ? -1 : 1;
    const isItemReadyToDelete = this._isReadyToDelete($itemElement);
    const moveJustStarted = this._getCurrentPositions().content
      === this._getStartPositions().content;

    if (moveJustStarted && !isItemReadyToDelete && e.offset * signCorrection > 0) {
      e.cancel = true;
      return;
    }

    const offset = this._cachedItemWidth * e.offset;
    const startOffset = isItemReadyToDelete ? -this._cachedButtonWidth * signCorrection : 0;
    const correctedOffset = (offset + startOffset) * signCorrection;
    const percent = correctedOffset < 0
      ? Math.abs((offset + startOffset) / this._cachedButtonWidth)
      : 0;

    this._setPositions(this._getPositions(percent));
  }

  _getStartPositions(): Positions {
    const rtl = this._isRtlEnabled();
    const signCorrection = rtl ? -1 : 1;

    return {
      content: 0,
      buttonsContainer: rtl ? -this._cachedButtonWidth : this._cachedItemWidth,
      buttons: -this._cachedButtonWidth * signCorrection,
    };
  }

  _getPositions(percent: number): Positions {
    const rtl = this._isRtlEnabled();
    const signCorrection = rtl ? -1 : 1;
    const startPositions = this._getStartPositions();

    return {
      content: startPositions.content - percent * this._cachedButtonWidth * signCorrection,
      buttonsContainer: startPositions.buttonsContainer
        - Math.min(percent, 1) * this._cachedButtonWidth * signCorrection,
      buttons: startPositions.buttons
        + Math.min(percent, 1) * this._cachedButtonWidth * signCorrection,
    };
  }

  _getCurrentPositions(): Positions {
    return {
      content: locate(this._$cachedContent).left,
      buttonsContainer: locate(this._$buttonsContainer).left,
      buttons: locate(this._$buttons).left,
    };
  }

  _setPositions(positions: Positions): void {
    move(this._$cachedContent, { left: positions.content });
    move(this._$buttonsContainer, { left: positions.buttonsContainer });
    move(this._$buttons, { left: positions.buttons });
  }

  _cacheItemData($itemElement: dxElementWrapper): void {
    if ($itemElement[0] === this._cachedNode) {
      return;
    }

    this._$cachedContent = $itemElement.find(`.${SLIDE_MENU_CONTENT_CLASS}`);
    this._cachedItemWidth = getOuterWidth($itemElement);
    this._cachedButtonWidth = this._cachedButtonWidth || getOuterWidth(this._$buttons);
    setWidth(this._$buttonsContainer, this._cachedButtonWidth);

    if (this._$cachedContent?.length) {
      this._cachedNode = $itemElement.get(0);
    }
  }

  _minButtonContainerLeftOffset(): number {
    return this._cachedItemWidth - this._cachedButtonWidth;
  }

  _swipeEndHandler($itemElement: dxElementWrapper, args: DxEvent & SwipeEndArgs): void {
    this._cacheItemData($itemElement);

    const signCorrection = this._isRtlEnabled() ? 1 : -1;
    const offset = this._cachedItemWidth * args.offset;
    const endedAtReadyToDelete = !this._isReadyToDelete($itemElement)
      && (offset * signCorrection > this._cachedButtonWidth * 0.2);
    const readyToDelete = args.targetOffset === signCorrection && endedAtReadyToDelete;

    this._toggleDeleteReady($itemElement, readyToDelete);
  }

  _enablePositioning($itemElement: dxElementWrapper): void {
    if (this._$cachedContent) {
      fx.stop(this._$cachedContent.get(0), true);
    }

    super._enablePositioning($itemElement);

    this._$buttonsContainer.appendTo($itemElement);
  }

  _disablePositioning($itemElement: dxElementWrapper): void {
    super._disablePositioning($itemElement);

    this._$buttonsContainer.detach();
  }

  _animatePrepareDeleteReady(): Promise<void> {
    return this._animateToPositions(this._getPositions(1));
  }

  _animateForgetDeleteReady($itemElement: dxElementWrapper): Promise<void> {
    this._cacheItemData($itemElement);

    return this._animateToPositions(this._getPositions(0));
  }

  _animateToPositions(positions: Positions): Promise<void> {
    const currentPosition = this._getCurrentPositions();
    const durationTimePart = Math.min(
      Math.abs(currentPosition.content - positions.content) / this._cachedButtonWidth,
      1,
    );
    return fx.animate($(this._$cachedContent).get(0), {
      // @ts-expect-error ts-error
      from: currentPosition,
      // @ts-expect-error ts-error
      to: positions,
      easing: SLIDE_MENU_ANIMATION_EASING,
      duration: SLIDE_MENU_ANIMATION_DURATION * durationTimePart,
      strategy: 'frame',
      draw: (drawPositions: Positions): void => {
        this._setPositions(drawPositions);
      },
    });
  }

  dispose(): void {
    if (this._menu) {
      this._menu.$element().remove();
    }
    if (this._$buttonsContainer) {
      this._$buttonsContainer.remove();
    }
    super.dispose();
  }
}

registerDecorator(
  'menu',
  'slide',
  SwitchableEditDecoratorSlide,
);
