import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  end as swipeEventEnd,
  start as swipeEventStart,
  swipe as swipeEventSwipe,
} from '@js/common/core/events/swipe';
import { addNamespace } from '@js/common/core/events/utils/index';
import Class from '@js/core/class';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';

const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const SWIPE_START_EVENT_NAME = addNamespace(swipeEventStart, LIST_EDIT_DECORATOR);
const SWIPE_UPDATE_EVENT_NAME = addNamespace(swipeEventSwipe, LIST_EDIT_DECORATOR);
const SWIPE_END_EVENT_NAME = addNamespace(swipeEventEnd, LIST_EDIT_DECORATOR);

// @ts-expect-error dxClass inheritance issue
class EditDecorator extends (Class.inherit({}) as new() => {}) {
  _clearSwipeCache?: boolean;

  _list?: any;

  ctor(list): void {
    this._list = list;

    this._init();
  }

  // eslint-disable-next-line class-methods-use-this
  _shouldHandleSwipe(): boolean {
    return false;
  }

  _init(): void {}

  _attachSwipeEvent(config): void {
    const swipeConfig = {
      itemSizeFunc: function () {
        if (this._clearSwipeCache) {
          this._itemWidthCache = getWidth(this._list.$element());
          this._clearSwipeCache = false;
        }
        return this._itemWidthCache;
      }.bind(this),
    };

    eventsEngine.on(config.$itemElement, SWIPE_START_EVENT_NAME, swipeConfig, this._itemSwipeStartHandler.bind(this));
    eventsEngine.on(config.$itemElement, SWIPE_UPDATE_EVENT_NAME, this._itemSwipeUpdateHandler.bind(this));
    eventsEngine.on(config.$itemElement, SWIPE_END_EVENT_NAME, this._itemSwipeEndHandler.bind(this));
  }

  _itemSwipeStartHandler(e): void {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      e.cancel = true;
      return;
    }

    clearTimeout(this._list._inkRippleTimer);

    this._swipeStartHandler($itemElement, e);
  }

  _itemSwipeUpdateHandler(e): void {
    const $itemElement = $(e.currentTarget);

    this._swipeUpdateHandler($itemElement, e);
  }

  _itemSwipeEndHandler(e): void {
    const $itemElement = $(e.currentTarget);

    this._swipeEndHandler($itemElement, e);

    this._clearSwipeCache = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeBag(config): void {}

  afterBag(): void {}

  _commonOptions() {
    return {
      activeStateEnabled: this._list.option('activeStateEnabled'),
      hoverStateEnabled: this._list.option('hoverStateEnabled'),
      focusStateEnabled: this._list.option('focusStateEnabled'),
    };
  }

  modifyElement(config): void {
    if (this._shouldHandleSwipe()) {
      this._attachSwipeEvent(config);
      this._clearSwipeCache = true;
    }
  }

  afterRender(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleClick($itemElement, e): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleKeyboardEvents(currentFocusedIndex, moveFocusUp): void {}

  handleEnterPressing(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleContextMenu($itemElement): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _swipeStartHandler($element, event): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _swipeUpdateHandler($element, event): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _swipeEndHandler($element, event): void {}

  visibilityChange(): void {}

  getExcludedSelectors(): void {}

  dispose(): void {}
}

export default EditDecorator;
