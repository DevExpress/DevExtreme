import type { Cancelable, NativeEventInfo } from '@js/common/core/events';
import { active } from '@js/common/core/events/core/emitter.feedback';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { getOuterHeight, setHeight } from '@js/core/utils/size';
import type { DxEvent } from '@js/events';
import type { ScrollInfo } from '@js/ui/list';
import type List from '@ts/ui/list/list.edit';
import EditDecorator from '@ts/ui/list/list.edit.decorator';

const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const POINTER_DOWN_EVENT_NAME = addNamespace(pointerEvents.down, LIST_EDIT_DECORATOR);
const ACTIVE_EVENT_NAME = addNamespace(active, LIST_EDIT_DECORATOR);

const LIST_ITEM_CONTENT_CLASS = 'dx-list-item-content';

const SWITCHABLE_DELETE_READY_CLASS = 'dx-list-switchable-delete-ready';
const SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS = 'dx-list-switchable-menu-shield-positioning';
const SWITCHABLE_DELETE_TOP_SHIELD_CLASS = 'dx-list-switchable-delete-top-shield';
const SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS = 'dx-list-switchable-delete-bottom-shield';
const SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS = 'dx-list-switchable-menu-item-shield-positioning';
const SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS = 'dx-list-switchable-delete-item-content-shield';
const SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-switchable-delete-button-container';

abstract class SwitchableEditDecorator extends EditDecorator {
  _$bottomShield!: dxElementWrapper;

  _$topShield!: dxElementWrapper;

  _$itemContentShield!: dxElementWrapper;

  _$readyToDeleteItem?: dxElementWrapper;

  _init(): void {
    this._$topShield = $('<div>').addClass(SWITCHABLE_DELETE_TOP_SHIELD_CLASS);
    this._$bottomShield = $('<div>').addClass(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS);
    this._$itemContentShield = $('<div>').addClass(SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS);

    eventsEngine.on(
      this._$topShield,
      POINTER_DOWN_EVENT_NAME,
      (): void => {
        this._cancelDeleteReadyItem();
      },
    );
    eventsEngine.on(
      this._$bottomShield,
      POINTER_DOWN_EVENT_NAME,
      (): void => {
        this._cancelDeleteReadyItem();
      },
    );

    this._list.$element()
      .append(this._$topShield.toggle(false))
      .append(this._$bottomShield.toggle(false));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleClick(_$itemElement: dxElementWrapper, _e: DxEvent): boolean {
    return this._cancelDeleteReadyItem();
  }

  _cancelDeleteReadyItem(): boolean {
    if (!this._$readyToDeleteItem) {
      return false;
    }

    this._cancelDelete(this._$readyToDeleteItem);
    return true;
  }

  _cancelDelete($itemElement: dxElementWrapper): void {
    this._toggleDeleteReady($itemElement, false);
  }

  _toggleDeleteReady($itemElement: dxElementWrapper, readyToDelete?: boolean): void {
    const isReadyToDelete = readyToDelete ?? !this._isReadyToDelete($itemElement);

    this._toggleShields($itemElement, isReadyToDelete);
    this._toggleScrolling(isReadyToDelete);
    this._cacheReadyToDeleteItem($itemElement, isReadyToDelete);
    this._animateToggleDelete($itemElement, isReadyToDelete);
  }

  _isReadyToDelete($itemElement: dxElementWrapper): boolean {
    return $itemElement.hasClass(SWITCHABLE_DELETE_READY_CLASS);
  }

  _toggleShields($itemElement: dxElementWrapper, enabled: boolean): void {
    this._list.$element().toggleClass(SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS, enabled);
    this._$topShield.toggle(enabled);
    this._$bottomShield.toggle(enabled);
    if (enabled) {
      this._updateShieldsHeight($itemElement);
    }

    this._toggleContentShield($itemElement, enabled);
  }

  _updateShieldsHeight($itemElement: dxElementWrapper): void {
    const $list = this._list.$element();

    const listTopOffset = $list.offset()?.top ?? 0;
    const listHeight = getOuterHeight($list);
    const itemTopOffset = $itemElement.offset()?.top ?? 0;
    const itemHeight = getOuterHeight($itemElement);

    const dirtyTopShieldHeight = itemTopOffset - listTopOffset;
    const dirtyBottomShieldHeight = listHeight - itemHeight - dirtyTopShieldHeight;

    setHeight(this._$topShield, Math.max(dirtyTopShieldHeight, 0));
    setHeight(this._$bottomShield, Math.max(dirtyBottomShieldHeight, 0));
  }

  _toggleContentShield($itemElement: dxElementWrapper, enabled: boolean): void {
    if (enabled) {
      $itemElement
        .find(`.${LIST_ITEM_CONTENT_CLASS}`)
        .first()
        .append(this._$itemContentShield);
    } else {
      this._$itemContentShield.detach();
    }
  }

  _toggleScrolling(readyToDelete: boolean): void {
    const scrollView = this._list._scrollView;

    if (readyToDelete) {
      scrollView.on('start', this._cancelScrolling);
    } else {
      scrollView.off('start', this._cancelScrolling);
    }
  }

  _cancelScrolling(args: NativeEventInfo<List, DxEvent & Cancelable> & ScrollInfo): void {
    if (args.event) {
      args.event.cancel = true;
    }
  }

  _cacheReadyToDeleteItem($itemElement: dxElementWrapper, cache: boolean): void {
    if (cache) {
      this._$readyToDeleteItem = $itemElement;
    } else {
      delete this._$readyToDeleteItem;
    }
  }

  _animateToggleDelete($itemElement: dxElementWrapper, readyToDelete: boolean): void {
    if (readyToDelete) {
      this._enablePositioning($itemElement);
      this._prepareDeleteReady($itemElement);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._animatePrepareDeleteReady($itemElement);
      eventsEngine.off($itemElement, pointerEvents.up);
    } else {
      this._forgetDeleteReady($itemElement);
      this._animateForgetDeleteReady($itemElement)
        // @ts-expect-error ts-error
        .done(this._disablePositioning.bind(this, $itemElement));
    }
  }

  _enablePositioning($itemElement: dxElementWrapper): void {
    $itemElement.addClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS);
    eventsEngine.on($itemElement, ACTIVE_EVENT_NAME, noop);
    eventsEngine.one(
      $itemElement,
      pointerEvents.up,
      this._disablePositioning.bind(this, $itemElement),
    );
  }

  _disablePositioning($itemElement: dxElementWrapper): void {
    $itemElement.removeClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS);
    eventsEngine.off($itemElement, ACTIVE_EVENT_NAME);
  }

  _prepareDeleteReady($itemElement: dxElementWrapper): void {
    $itemElement.addClass(SWITCHABLE_DELETE_READY_CLASS);
  }

  _forgetDeleteReady($itemElement: dxElementWrapper): void {
    $itemElement.removeClass(SWITCHABLE_DELETE_READY_CLASS);
  }

  abstract _animatePrepareDeleteReady($element: dxElementWrapper): Promise<void>;

  abstract _animateForgetDeleteReady($itemElement?: dxElementWrapper): Promise<void>;

  _getDeleteButtonContainer($itemElement: dxElementWrapper): dxElementWrapper {
    const $element = $itemElement || this._$readyToDeleteItem;

    return $element.children(`.${SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS}`);
  }

  _deleteItem($itemElement?: dxElementWrapper): void {
    const $element = $itemElement ?? this._$readyToDeleteItem;
    if (!$element) {
      return;
    }
    this._getDeleteButtonContainer($element).detach();

    if ($element.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    this._list.deleteItem($element.get(0))
      // @ts-expect-error ts-error
      .always(this._cancelDelete.bind(this, $element));
  }

  _isRtlEnabled(): boolean {
    const { rtlEnabled = false } = this._list.option();

    return rtlEnabled;
  }

  dispose(): void {
    if (this._$topShield) {
      this._$topShield.remove();
    }
    if (this._$bottomShield) {
      this._$bottomShield.remove();
    }
    super.dispose();
  }
}

export default SwitchableEditDecorator;
