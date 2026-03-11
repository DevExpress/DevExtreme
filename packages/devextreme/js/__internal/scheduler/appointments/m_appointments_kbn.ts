import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events/events.types';
import { getPublicElement } from '@ts/core/m_element';
import type { SupportedKeys } from '@ts/core/widget/widget';
import eventsEngine from '@ts/events/core/m_events_engine';

import type { SortedEntity } from '../view_model/types';
import type SchedulerAppointments from './m_appointment_collection';

export class AppointmentsKeyboardNavigation {
  private readonly _collection: SchedulerAppointments;

  public focusedItemSortIndex = -1;

  public isNavigating = false;

  constructor(collection: SchedulerAppointments) {
    this._collection = collection;
  }

  // TODO: make disabled appointments focusable and remove this method
  public getFocusableItems(): dxElementWrapper {
    const appts = this._collection._itemElements().not('.dx-state-disabled');
    const collectors = this._collection.$element().find('.dx-scheduler-appointment-collector');

    return appts.add(collectors);
  }

  public focus($item?: dxElementWrapper): void {
    const $target = $item ?? this.$focusTarget();

    if ($target.length) {
      eventsEngine.trigger($target, 'focus');
    }
  }

  public $focusTarget(): dxElementWrapper {
    const $items = this._collection.$itemBySortedIndex;

    if (!$items) {
      return $();
    }

    const $item = $items[this.focusedItemSortIndex];
    return $item || $();
  }

  public resetTabIndex($item?: dxElementWrapper): void {
    const $target = $item ?? this.$focusTarget();

    this.getFocusableItems().attr('tabIndex', -1);
    $target.attr('tabIndex', this._collection.option('tabIndex'));
  }

  public focusInHandler(e: DxEvent): void {
    const $target = $(e.target);
    const itemData = this._collection.getAppointmentSettings($target);

    if (!itemData) {
      return;
    }

    this.focusedItemSortIndex = itemData.sortedIndex;
    this._collection.option('focusedElement', getPublicElement(e.target));
  }

  public focusOutHandler(): void {
    this._collection.option('focusedElement', this.getFirstVisibleItem());
  }

  public getSupportedKeys(): SupportedKeys {
    return {
      escape: this.escHandler.bind(this),
      del: this.delHandler.bind(this),
      tab: this.tabHandler.bind(this),
      home: this.homeHandler.bind(this),
      end: this.endHandler.bind(this),
    };
  }

  private delHandler(e: DxEvent): void {
    if (this._collection.option('allowDelete')) {
      e.preventDefault();
      const data = this._collection.getAppointmentSettings($(e.target)).itemData;
      this._collection.notifyObserver('onDeleteButtonPress', { data, target: e.target });
    }
  }

  private escHandler(): void {
    if (!this._collection.isResizing) {
      return;
    }

    this._collection.moveAppointmentBack();

    const resizableInstance = (this.$focusTarget() as any).dxResizable('instance');

    if (resizableInstance) {
      resizableInstance._detachEventHandlers();
      resizableInstance._attachEventHandlers();
      resizableInstance._toggleResizingClass(false);
    }
  }

  private tabHandler(e: DxEvent<KeyboardEvent>): void {
    const items = this._collection.sortedItems;
    const nextIndex = this.focusedItemSortIndex + (e.shiftKey ? -1 : 1);
    const nextItemData = items[nextIndex];

    if (!nextItemData) {
      return;
    }

    e.preventDefault();
    this.focusByItemData(nextItemData);
  }

  private homeHandler(e: DxEvent<KeyboardEvent>): void {
    const items = this._collection.sortedItems;
    const nextItemData = items[0];

    if (!nextItemData) {
      return;
    }

    e.preventDefault();
    this.focusByItemData(nextItemData);
  }

  private endHandler(e: DxEvent<KeyboardEvent>): void {
    const items = this._collection.sortedItems;
    const nextItemData = items[items.length - 1];

    if (!nextItemData) {
      return;
    }

    e.preventDefault();
    this.focusByItemData(nextItemData);
  }

  private focusByItemData(itemData: SortedEntity): void {
    this.focusedItemSortIndex = itemData.sortedIndex;

    if (this._collection.isVirtualScrolling) {
      this.isNavigating = true;
      this.scrollToByItemData(itemData);
    }

    this.focus();
  }

  private scrollToByItemData(itemData: SortedEntity): void {
    const date = new Date(Math.max(
      this._collection.invoke('getStartViewDate').getTime(),
      itemData.source.startDate,
    ));

    this._collection.option('scrollTo')(
      date,
      {
        group: itemData.itemData,
        allDay: itemData.allDay,
      },
    );
  }

  public getFirstVisibleItem(): dxElementWrapper {
    const $items = this._collection.$itemBySortedIndex;
    const $itemsPlainArray = Object.values($items);

    const $firstItem = this._collection.isVirtualScrolling
      ? $itemsPlainArray.find(($item) => this.isItemVisibleInViewport($item)) ?? $()
      : $($itemsPlainArray[0]);

    return $firstItem;
  }

  private isItemVisibleInViewport($item: dxElementWrapper): boolean {
    const $container = this._collection.$element().closest('.dx-scrollable-container');
    const containerRect = $container.get(0).getBoundingClientRect();
    const itemRect = $item.get(0).getBoundingClientRect();

    return (itemRect.top < containerRect.bottom
      && itemRect.bottom > containerRect.top
      && itemRect.left < containerRect.right
      && itemRect.right > containerRect.left);
  }
}
