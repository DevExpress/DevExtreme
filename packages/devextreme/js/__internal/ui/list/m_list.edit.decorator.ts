import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  end as swipeEventEnd,
  start as swipeEventStart,
  swipe as swipeEventSwipe,
  type SwipeEndEvent,
  type SwipeUpdateEvent,
} from '@js/common/core/events/swipe';
import { addNamespace } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';
import type { Cancelable, DxEvent } from '@js/events';

import type { ListBaseProperties } from './m_list.base';
import type List from './m_list.edit';

const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const SWIPE_START_EVENT_NAME = addNamespace(swipeEventStart, LIST_EDIT_DECORATOR);
const SWIPE_UPDATE_EVENT_NAME = addNamespace(swipeEventSwipe, LIST_EDIT_DECORATOR);
const SWIPE_END_EVENT_NAME = addNamespace(swipeEventEnd, LIST_EDIT_DECORATOR);

export interface BagConfig {
  $itemElement: dxElementWrapper;
  $container?: dxElementWrapper;
}

export type CommonControlOptions = Pick<ListBaseProperties, 'activeStateEnabled' | 'hoverStateEnabled' | 'focusStateEnabled'>;

class EditDecorator {
  _clearSwipeCache?: boolean;

  _list!: List;

  constructor(list: List) {
    this._list = list;

    this._init();
  }

  // eslint-disable-next-line class-methods-use-this
  _shouldHandleSwipe(): boolean {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  _init(): void {}

  _attachSwipeEvent(config: BagConfig): void {
    const swipeConfig = {
      // eslint-disable-next-line func-names
      itemSizeFunc: function (): number {
        if (this._clearSwipeCache) {
          this._itemWidthCache = getWidth(this._list.$element());
          this._clearSwipeCache = false;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._itemWidthCache;
      }.bind(this),
    };

    eventsEngine.on(
      config.$itemElement,
      SWIPE_START_EVENT_NAME,
      swipeConfig,
      (e): void => {
        this._itemSwipeStartHandler(e);
      },
    );
    eventsEngine.on(
      config.$itemElement,
      SWIPE_UPDATE_EVENT_NAME,
      (e): void => {
        this._itemSwipeUpdateHandler(e);
      },
    );
    eventsEngine.on(
      config.$itemElement,
      SWIPE_END_EVENT_NAME,
      (e): void => {
        this._itemSwipeEndHandler(e);
      },
    );
  }

  _itemSwipeStartHandler(e: DxEvent & Cancelable): void {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      e.cancel = true;
      return;
    }

    clearTimeout(this._list._inkRippleTimer);

    this._swipeStartHandler($itemElement);
  }

  _itemSwipeUpdateHandler(e: SwipeUpdateEvent['event']): void {
    const target = e.currentTarget;
    if (target instanceof Element) {
      const $itemElement = $(target);
      this._swipeUpdateHandler($itemElement, e);
    }
  }

  _itemSwipeEndHandler(e: SwipeEndEvent['event']): void {
    const target = e.currentTarget;
    if (target instanceof Element) {
      const $itemElement = $(target);
      this._swipeEndHandler($itemElement, e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  beforeBag(config: Required<BagConfig>): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  afterBag(config: Required<BagConfig>): void {}

  _commonOptions(): CommonControlOptions {
    const { activeStateEnabled, hoverStateEnabled, focusStateEnabled } = this._list.option();

    return {
      activeStateEnabled,
      hoverStateEnabled,
      focusStateEnabled,
    };
  }

  modifyElement(config: BagConfig): void {
    if (this._shouldHandleSwipe()) {
      this._attachSwipeEvent(config);
      this._clearSwipeCache = true;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  afterRender(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  handleClick($itemElement: dxElementWrapper, e: DxEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  handleKeyboardEvents(currentFocusedIndex: number, moveFocusUp: boolean | undefined): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  handleEnterPressing(e: KeyboardEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  handleContextMenu($itemElement: dxElementWrapper): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  _swipeStartHandler($element: dxElementWrapper): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  _swipeUpdateHandler($element: dxElementWrapper, event: SwipeUpdateEvent['event']): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  _swipeEndHandler($element: dxElementWrapper, event: SwipeEndEvent['event']): void {}

  // eslint-disable-next-line class-methods-use-this
  visibilityChange(): void {}

  // eslint-disable-next-line class-methods-use-this
  getExcludedSelectors(): void {}

  // eslint-disable-next-line class-methods-use-this
  dispose(): void {}
}

export default EditDecorator;
