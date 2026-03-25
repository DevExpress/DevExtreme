import { fx } from '@js/common/core/animation';
import { resetPosition } from '@js/common/core/animation/translator';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getHeight } from '@js/core/utils/size';
import type { ScrollEventInfo } from '@js/ui/scroll_view/ui.scrollable';
import type { OptionChanged } from '@ts/core/widget/types';
import { convertToLocation } from '@ts/ui/scroll_view/utils/convert_location';

import type { ScrollableProperties } from '../scroll_view/scrollable';
import Scrollable from '../scroll_view/scrollable';
import type { DxMouseEvent } from '../scroll_view/types';

const DATEVIEW_ROLLER_CLASS = 'dx-dateviewroller';
const DATEVIEW_ROLLER_ACTIVE_CLASS = 'dx-state-active';
const DATEVIEW_ROLLER_CURRENT_CLASS = 'dx-dateviewroller-current';

const DATEVIEW_ROLLER_ITEM_CLASS = 'dx-dateview-item';
const DATEVIEW_ROLLER_ITEM_SELECTED_CLASS = 'dx-dateview-item-selected';
const DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS = 'dx-dateview-item-selected-frame';
const DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS = 'dx-dateview-item-selected-border';

export interface DateViewRollerProperties extends ScrollableProperties {
  selectedIndex?: number;

  items?: string[];

  showOnClick?: boolean;

  onClick?: ((e: { event: DxMouseEvent; component: DateViewRoller }) => void) | null;

  onStart?: ((e: ScrollEventInfo<DateViewRoller>) => void) | null;

  onEnd?: ((e: ScrollEventInfo<DateViewRoller>) => void) | null;

  onSelectedIndexChanged?: ((
    e: { component: DateViewRoller; previousValue: number; value: number },
  ) => void) | null;
}

class DateViewRoller extends Scrollable<DateViewRollerProperties> {
  // eslint-disable-next-line no-restricted-globals
  _visibilityTimer?: ReturnType<typeof setTimeout>;

  _selectedIndexChanged?: (e?: Record<string, unknown>) => void;

  _isWheelScrolled?: boolean;

  _$items!: dxElementWrapper;

  _animation?: boolean;

  _getDefaultOptions(): DateViewRollerProperties {
    return {
      ...super._getDefaultOptions(),
      showScrollbar: 'never',
      useNative: false,
      selectedIndex: 0,
      bounceEnabled: false,
      items: [],
      showOnClick: false,
      onClick: null,
      onSelectedIndexChanged: null,
      scrollByContent: true,
    };
  }

  _init(): void {
    super._init();

    this.option('onVisibilityChange', this._visibilityChangedHandler.bind(this));
    this.option('onEnd', this._endActionHandler.bind(this));
  }

  _render(): void {
    super._render();

    this._renderSelectedItemFrame();

    this.$element().addClass(DATEVIEW_ROLLER_CLASS);

    this._renderContainerClick();
    this._renderItems();
    this._renderSelectedValue();
    this._renderItemsClick();
    this._renderWheelEvent();

    this._renderSelectedIndexChanged();
  }

  _renderSelectedIndexChanged(): void {
    this._selectedIndexChanged = this._createActionByOption('onSelectedIndexChanged');
  }

  _renderWheelEvent(): void {
    eventsEngine.on($(this.container()), 'dxmousewheel', () => {
      this._isWheelScrolled = true;
    });
  }

  _renderContainerClick(): void {
    if (!this.option('showOnClick')) {
      return;
    }
    // @ts-expect-error ts-error
    const eventName = addNamespace(clickEventName, this.NAME);
    const clickAction = this._createActionByOption('onClick');

    eventsEngine.off($(this.container()), eventName);
    eventsEngine.on($(this.container()), eventName, (e) => {
      clickAction({ event: e });
    });
  }

  _renderItems(): void {
    const { items = [] } = this.option();
    let $items = $();

    $(this.content()).empty();
    // NOTE: rendering ~166+30+12+24+60 <div>s >> 50mc
    items.forEach((item) => {
      $items = $items.add(
        $('<div>')
          .addClass(DATEVIEW_ROLLER_ITEM_CLASS)
          .append(item),
      );
    });

    $(this.content()).append($items);
    this._$items = $items;
    this.update();
  }

  _renderSelectedItemFrame(): void {
    $('<div>')
      .addClass(DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS)
      .append($('<div>').addClass(DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS))
      .appendTo($(this.container()));
  }

  _renderSelectedValue(selectedIndex?: number): void {
    const { selectedIndex: oldSelectedIndex = 0 } = this.option();
    const index = this._fitIndex(selectedIndex ?? oldSelectedIndex);

    this._moveTo({ top: this._getItemPosition(index) });
    this._renderActiveStateItem();
  }

  _fitIndex(index: number): number {
    const { items = [] } = this.option();
    const itemCount = items.length;

    if (index >= itemCount) {
      return itemCount - 1;
    }

    if (index < 0) {
      return 0;
    }

    return index;
  }

  _getItemPosition(index: number): number {
    return Math.round(this._itemHeight() * index);
  }

  _renderItemsClick(): void {
    const itemSelector = this._getItemSelector();
    // @ts-expect-error ts-error
    const eventName = addNamespace(clickEventName, this.NAME);

    eventsEngine.off(this.$element(), eventName, itemSelector);
    eventsEngine.on(this.$element(), eventName, itemSelector, this._itemClickHandler.bind(this));
  }

  _getItemSelector(): string {
    return `.${DATEVIEW_ROLLER_ITEM_CLASS}`;
  }

  _itemClickHandler(e: { currentTarget: dxElementWrapper }): void {
    this.option('selectedIndex', this._itemElementIndex(e.currentTarget));
  }

  _itemElementIndex(itemElement: dxElementWrapper): number {
    return this._itemElements().index(itemElement);
  }

  _itemElements(): dxElementWrapper {
    return this.$element().find(this._getItemSelector());
  }

  _renderActiveStateItem(): void {
    const { selectedIndex } = this.option();

    this._$items.each((index, element) => {
      $(element).toggleClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS, selectedIndex === index);
      return true;
    });
  }

  _shouldScrollToNeighborItem(): boolean {
    return Boolean(devices.real().deviceType === 'desktop' && this._isWheelScrolled);
  }

  _moveTo(targetLocation: { top: number; }): void {
    // @ts-expect-error scrollable types should be extended
    const { top = 0, left = 0 } = convertToLocation(targetLocation);

    const location = this.scrollOffset();
    const delta = {
      x: location.left - left,
      y: location.top - top,
    };

    if (this._isVisible() && (delta.x || delta.y)) {
      this._prepareDirections(true);

      if (this._animation && !this._shouldScrollToNeighborItem()) {
        fx.stop($(this.content()).get(0), false);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fx.animate($(this.content()).get(0), {
          duration: 200,
          type: 'slide',
          to: { top: Math.floor(delta.y) },
          complete: () => {
            resetPosition($(this.content()));
            // @ts-expect-error scrollable types should be extended
            this.handleMove({ delta });
          },
        });
        delete this._animation;
      } else {
        // @ts-expect-error scrollable types should be extended
        this.handleMove({ delta });
      }
    }
  }

  _validate(e: DxMouseEvent): boolean {
    return this._moveIsAllowed(e);
  }

  _fitSelectedIndexInRange(index: number): number {
    const { items = [] } = this.option();
    const itemsCount = items.length;
    return Math.max(Math.min(index, itemsCount - 1), 0);
  }

  _isInNullNeighborhood(x: number): boolean {
    const EPS = 0.1;
    return -EPS <= x && x <= EPS;
  }

  _getSelectedIndexAfterScroll(currentSelectedIndex: number): number {
    const locationTop = this.scrollOffset().top;

    const currentSelectedIndexPosition = currentSelectedIndex * this._itemHeight();
    const dy = locationTop - currentSelectedIndexPosition;

    if (this._isInNullNeighborhood(dy)) {
      return currentSelectedIndex;
    }

    const direction = dy > 0 ? 1 : -1;
    const newSelectedIndex = this._fitSelectedIndexInRange(currentSelectedIndex + direction);

    return newSelectedIndex;
  }

  _getNewSelectedIndex(currentSelectedIndex: number): number {
    if (this._shouldScrollToNeighborItem()) {
      return this._getSelectedIndexAfterScroll(currentSelectedIndex);
    }

    this._animation = true;
    const ratio = this.scrollOffset().top / this._itemHeight();
    return Math.round(ratio);
  }

  _endActionHandler(): void {
    const { selectedIndex: currentSelectedIndex = 0 } = this.option();
    const newSelectedIndex = this._getNewSelectedIndex(currentSelectedIndex);

    if (newSelectedIndex === currentSelectedIndex) {
      this._renderSelectedValue(newSelectedIndex);
    } else {
      this.option('selectedIndex', newSelectedIndex);
    }

    this._isWheelScrolled = false;
  }

  _itemHeight(): number {
    const $item = this._$items.first();

    return getHeight($item) as number;
  }

  _toggleActive(state: boolean): void {
    this.$element().toggleClass(DATEVIEW_ROLLER_ACTIVE_CLASS, state);
  }

  _isVisible(): boolean {
    return $(this.container()).is(':visible');
  }

  _fireSelectedIndexChanged(value?: number, previousValue?: number): void {
    this._selectedIndexChanged?.({
      value,
      previousValue,
      event: undefined,
    });
  }

  _visibilityChanged(visible: boolean): void {
    super._visibilityChanged(visible);
    this._visibilityChangedHandler(visible);
  }

  _visibilityChangedHandler(visible: boolean): void {
    if (visible) {
      // uses for purposes of renovated scrollable widget
      // eslint-disable-next-line no-restricted-globals
      this._visibilityTimer = setTimeout(() => {
        const { selectedIndex } = this.option();
        this._renderSelectedValue(selectedIndex);
      });
    }
    this.toggleActiveState(false);
  }

  toggleActiveState(state: boolean): void {
    this.$element().toggleClass(DATEVIEW_ROLLER_CURRENT_CLASS, state);
  }

  _refreshSelectedIndex(): void {
    const { selectedIndex = 0 } = this.option();
    const fitIndex = this._fitIndex(selectedIndex);

    if (fitIndex === selectedIndex) {
      this._renderActiveStateItem();
    } else {
      this.option('selectedIndex', fitIndex);
    }
  }

  _optionChanged(args: OptionChanged<DateViewRollerProperties>): void {
    switch (args.name) {
      case 'selectedIndex':
        this._fireSelectedIndexChanged(args.value, args.previousValue);
        this._renderSelectedValue(args.value);
        break;
      case 'items':
        this._renderItems();
        this._refreshSelectedIndex();
        break;
      case 'onClick':
      case 'showOnClick':
        this._renderContainerClick();
        break;
      case 'onSelectedIndexChanged':
        this._renderSelectedIndexChanged();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _dispose(): void {
    clearTimeout(this._visibilityTimer);
    super._dispose();
  }
}

registerComponent('dxDateViewRoller', DateViewRoller);

export default DateViewRoller;
