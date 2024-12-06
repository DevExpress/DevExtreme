import { fx } from '@js/common/core/animation';
import { resetPosition } from '@js/common/core/animation/translator';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getHeight } from '@js/core/utils/size';
import { convertToLocation } from '@ts/ui/scroll_view/utils/convert_location';

import Scrollable from '../scroll_view/m_scrollable';

const DATEVIEW_ROLLER_CLASS = 'dx-dateviewroller';
const DATEVIEW_ROLLER_ACTIVE_CLASS = 'dx-state-active';
const DATEVIEW_ROLLER_CURRENT_CLASS = 'dx-dateviewroller-current';

const DATEVIEW_ROLLER_ITEM_CLASS = 'dx-dateview-item';
const DATEVIEW_ROLLER_ITEM_SELECTED_CLASS = 'dx-dateview-item-selected';
const DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS = 'dx-dateview-item-selected-frame';
const DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS = 'dx-dateview-item-selected-border';

class DateViewRoller extends Scrollable {
  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      showScrollbar: 'never',
      useNative: false,
      selectedIndex: 0,
      bounceEnabled: false,
      items: [],
      showOnClick: false,
      onClick: null,
      onSelectedIndexChanged: null,
      scrollByContent: true,
    });
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
    // @ts-expect-error
    this._renderSelectedValue();
    this._renderItemsClick();
    this._renderWheelEvent();

    this._renderSelectedIndexChanged();
  }

  _renderSelectedIndexChanged(): void {
    this._selectedIndexChanged = this._createActionByOption('onSelectedIndexChanged');
  }

  _renderWheelEvent(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eventsEngine.on($(this.container()), 'dxmousewheel', (e) => {
      this._isWheelScrolled = true;
    });
  }

  _renderContainerClick(): void {
    if (!this.option('showOnClick')) {
      return;
    }

    const eventName = addNamespace(clickEventName, this.NAME);

    const clickAction = this._createActionByOption('onClick');

    eventsEngine.off($(this.container()), eventName);
    eventsEngine.on($(this.container()), eventName, (e) => {
      clickAction({ event: e });
    });
  }

  _renderItems() {
    const items = this.option('items') || [];
    let $items = $();

    $(this.content()).empty();
    // NOTE: rendering ~166+30+12+24+60 <div>s >> 50mc
    items.forEach((item) => {
      $items = $items.add(
        // @ts-expect-error
        $('<div>')
          .addClass(DATEVIEW_ROLLER_ITEM_CLASS)
          .append(item),
      );
    });

    $(this.content()).append($items);
    this._$items = $items;
    this.update();
  }

  _renderSelectedItemFrame() {
    $('<div>')
      .addClass(DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS)
      .append($('<div>').addClass(DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS))
      .appendTo($(this.container()));
  }

  _renderSelectedValue(selectedIndex) {
    const index = this._fitIndex(selectedIndex ?? this.option('selectedIndex'));

    this._moveTo({ top: this._getItemPosition(index) });
    this._renderActiveStateItem();
  }

  _fitIndex(index) {
    const items = this.option('items') || [];
    const itemCount = items.length;

    if (index >= itemCount) {
      return itemCount - 1;
    }

    if (index < 0) {
      return 0;
    }

    return index;
  }

  _getItemPosition(index) {
    return Math.round(this._itemHeight() * index);
  }

  _renderItemsClick() {
    const itemSelector = this._getItemSelector();
    const eventName = addNamespace(clickEventName, this.NAME);

    eventsEngine.off(this.$element(), eventName, itemSelector);
    eventsEngine.on(this.$element(), eventName, itemSelector, this._itemClickHandler.bind(this));
  }

  _getItemSelector() {
    return `.${DATEVIEW_ROLLER_ITEM_CLASS}`;
  }

  _itemClickHandler(e) {
    this.option('selectedIndex', this._itemElementIndex(e.currentTarget));
  }

  _itemElementIndex(itemElement) {
    return this._itemElements().index(itemElement);
  }

  _itemElements() {
    return this.$element().find(this._getItemSelector());
  }

  _renderActiveStateItem() {
    const selectedIndex = this.option('selectedIndex');
    each(this._$items, function (index) {
      $(this).toggleClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS, selectedIndex === index);
    });
  }

  _shouldScrollToNeighborItem() {
    return devices.real().deviceType === 'desktop'
    && this._isWheelScrolled;
  }

  _moveTo(targetLocation): void {
    // @ts-expect-error
    const { top, left } = convertToLocation(targetLocation);

    const location = this.scrollOffset();
    const delta = {
      // @ts-expect-error
      x: location.left - left,
      // @ts-expect-error
      y: location.top - top,
    };

    if (this._isVisible() && (delta.x || delta.y)) {
      this._prepareDirections(true);

      if (this._animation && !this._shouldScrollToNeighborItem()) {
        const that = this;

        // @ts-expect-error
        fx.stop($(this.content()));
        // @ts-expect-error
        fx.animate($(this.content()), {
          duration: 200,
          type: 'slide',
          to: { top: Math.floor(delta.y) },
          complete() {
            resetPosition($(that.content()));
            that.handleMove({ delta });
          },
        });
        delete this._animation;
      } else {
        this.handleMove({ delta });
      }
    }
  }

  _validate(e) {
    return this._moveIsAllowed(e);
  }

  _fitSelectedIndexInRange(index) {
    const itemsCount = this.option('items').length;
    return Math.max(Math.min(index, itemsCount - 1), 0);
  }

  _isInNullNeighborhood(x) {
    const EPS = 0.1;
    return -EPS <= x && x <= EPS;
  }

  _getSelectedIndexAfterScroll(currentSelectedIndex): number {
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

  _getNewSelectedIndex(currentSelectedIndex): number {
    if (this._shouldScrollToNeighborItem()) {
      return this._getSelectedIndexAfterScroll(currentSelectedIndex);
    }

    this._animation = true;
    const ratio = this.scrollOffset().top / this._itemHeight();
    return Math.round(ratio);
  }

  _endActionHandler(): void {
    const currentSelectedIndex = this.option('selectedIndex');
    const newSelectedIndex = this._getNewSelectedIndex(currentSelectedIndex);

    if (newSelectedIndex === currentSelectedIndex) {
      this._renderSelectedValue(newSelectedIndex);
    } else {
      this.option('selectedIndex', newSelectedIndex);
    }

    this._isWheelScrolled = false;
  }

  _itemHeight() {
    const $item = this._$items.first();

    return getHeight($item);
  }

  _toggleActive(state: boolean): void {
    this.$element().toggleClass(DATEVIEW_ROLLER_ACTIVE_CLASS, state);
  }

  _isVisible(): boolean {
    return $(this.container()).is(':visible');
  }

  _fireSelectedIndexChanged(value, previousValue): void {
    this._selectedIndexChanged({
      value,
      previousValue,
      event: undefined,
    });
  }

  _visibilityChanged(visible): void {
    super._visibilityChanged(visible);
    this._visibilityChangedHandler(visible);
  }

  _visibilityChangedHandler(visible): void {
    if (visible) {
      // uses for purposes of renovated scrollable widget
      this._visibilityTimer = setTimeout(() => {
        this._renderSelectedValue(this.option('selectedIndex'));
      });
    }
    this.toggleActiveState(false);
  }

  toggleActiveState(state: boolean): void {
    this.$element().toggleClass(DATEVIEW_ROLLER_CURRENT_CLASS, state);
  }

  _refreshSelectedIndex(): void {
    const selectedIndex = this.option('selectedIndex');
    const fitIndex = this._fitIndex(selectedIndex);

    if (fitIndex === selectedIndex) {
      this._renderActiveStateItem();
    } else {
      this.option('selectedIndex', fitIndex);
    }
  }

  _optionChanged(args: Record<string, unknown>): void {
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
// @ts-expect-error ts-error
registerComponent('dxDateViewRoller', DateViewRoller);

export default DateViewRoller;
