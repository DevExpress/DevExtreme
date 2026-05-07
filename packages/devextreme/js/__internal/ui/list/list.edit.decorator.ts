import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  end as swipeEventEnd,
  start as swipeEventStart,
  swipe as swipeEventSwipe,
} from '@js/common/core/events/swipe';
import { addNamespace } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';
import type { Cancelable, DxEvent } from '@js/events';
import type { ListBaseProperties } from '@ts/ui/list/list.base';
import type List from '@ts/ui/list/list.edit';

const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const SWIPE_START_EVENT_NAME = addNamespace(swipeEventStart, LIST_EDIT_DECORATOR);
const SWIPE_UPDATE_EVENT_NAME = addNamespace(swipeEventSwipe, LIST_EDIT_DECORATOR);
const SWIPE_END_EVENT_NAME = addNamespace(swipeEventEnd, LIST_EDIT_DECORATOR);

export interface BagConfig {
  $itemElement: dxElementWrapper;
  $container: dxElementWrapper;
}

export type CommonControlOptions = Pick<ListBaseProperties, 'activeStateEnabled' | 'hoverStateEnabled' | 'focusStateEnabled'>;

export interface SwipeUpdateArgs { offset: number }
export interface SwipeEndArgs { offset: number; targetOffset: number }

class EditDecorator {
  _clearSwipeCache?: boolean;

  _itemWidthCache = 0;

  _list!: List;

  constructor(list: List) {
    this._list = list;

    this._init();
  }

  _shouldHandleSwipe(): boolean {
    return false;
  }

  _init(): void {}

  _attachSwipeEvent(config: BagConfig): void {
    const swipeConfig = {
      itemSizeFunc: (): number => {
        if (this._clearSwipeCache) {
          this._itemWidthCache = getWidth(this._list.$element());
          this._clearSwipeCache = false;
        }
        return this._itemWidthCache;
      },
    };

    eventsEngine.on(
      config.$itemElement,
      SWIPE_START_EVENT_NAME,
      swipeConfig,
      (e: DxEvent): void => {
        this._itemSwipeStartHandler(e);
      },
    );
    eventsEngine.on(
      config.$itemElement,
      SWIPE_UPDATE_EVENT_NAME,
      (e: DxEvent & SwipeUpdateArgs): void => {
        this._itemSwipeUpdateHandler(e);
      },
    );
    eventsEngine.on(
      config.$itemElement,
      SWIPE_END_EVENT_NAME,
      (e: DxEvent & SwipeEndArgs): void => {
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

  _itemSwipeUpdateHandler(e: DxEvent & SwipeUpdateArgs): void {
    const target = e.currentTarget;
    if (target instanceof Element) {
      const $itemElement = $(target);
      this._swipeUpdateHandler($itemElement, e);
    }
  }

  _itemSwipeEndHandler(e: DxEvent & SwipeEndArgs): void {
    const target = e.currentTarget;
    if (target instanceof Element) {
      const $itemElement = $(target);
      this._swipeEndHandler($itemElement, e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeBag(config: BagConfig): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterBag(config: BagConfig): void {}

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

  afterRender(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleClick($itemElement: dxElementWrapper, e: DxEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleKeyboardEvents(currentFocusedIndex: number, moveFocusUp: boolean | undefined): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleEnterPressing(e: KeyboardEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleContextMenu($itemElement: dxElementWrapper): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _swipeStartHandler($element: dxElementWrapper): void {}

  _swipeUpdateHandler(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $element: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: DxEvent & SwipeUpdateArgs & Cancelable,
  ): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _swipeEndHandler($element: dxElementWrapper, event: DxEvent & SwipeEndArgs): void {}

  visibilityChange(): void {}

  getExcludedSelectors(): void {}

  dispose(): void {}
}

export default EditDecorator;
