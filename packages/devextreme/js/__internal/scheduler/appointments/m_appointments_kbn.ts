import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events/events.types';
import { getPublicElement } from '@ts/core/m_element';
import type { SupportedKeys } from '@ts/core/widget/widget';
import eventsEngine from '@ts/events/core/m_events_engine';

import type SchedulerAppointments from './m_appointment_collection';
import { getNextElement, getPrevElement } from './utils/sorted_index_utils';

export class AppointmentsKeyboardNavigation {
  private readonly _collection: SchedulerAppointments;

  public $focusedItem: dxElementWrapper | null = null;

  constructor(collection: SchedulerAppointments) {
    this._collection = collection;
  }

  public getFocusableItems(): dxElementWrapper {
    const appts = this._collection._itemElements().not('.dx-state-disabled');
    const collectors = this._collection.$element().find('.dx-scheduler-appointment-collector');

    // @ts-expect-error
    return appts.add(collectors);
  }

  public getFocusableItemBySortedIndex(sortedIndex: number): dxElementWrapper {
    const $items = this.getFocusableItems();
    const itemElement = $items.toArray().filter((itemElement: Element) => {
      const $item = $(itemElement);
      const itemData = this._collection.getAppointmentSettings($item);
      return itemData.sortedIndex === sortedIndex;
    });

    return $(itemElement);
  }

  public focus(): void {
    if (this.$focusedItem) {
      const focusedElement = getPublicElement(this.$focusedItem);

      this._collection.option('focusedElement', focusedElement);
      eventsEngine.trigger(focusedElement, 'focus');
    }
  }

  public focusInHandler(e: DxEvent): void {
    this.$focusedItem = $(e.target);
    this._collection.option('focusedElement', getPublicElement(this.$focusedItem));
  }

  public focusOutHandler(): void {
    const $item = this.getFocusableItemBySortedIndex(0);
    this._collection.option('focusedElement', getPublicElement($item));
  }

  public getSupportedKeys(): SupportedKeys {
    return {
      escape: this.escHandler.bind(this),
      del: this.delHandler.bind(this),
      tab: this.tabHandler.bind(this),
    };
  }

  public resetTabIndex($appointment: dxElementWrapper): void {
    this.getFocusableItems().attr('tabIndex', -1);
    $appointment.attr('tabIndex', this._collection.option('tabIndex'));
  }

  private tabHandler(e): void {
    if (!this.$focusedItem) {
      return;
    }

    const $focusableItems = this.getFocusableItems();
    let index = this._collection.getAppointmentSettings(this.$focusedItem).sortedIndex;
    let $nextAppointment = e.shiftKey
      ? getPrevElement(index, this._collection.renderedElementsBySortedIndex)
      : getNextElement(index, this._collection.renderedElementsBySortedIndex);
    const lastIndex = $focusableItems.length - 1;

    if ($nextAppointment || (index > 0 && e.shiftKey) || (index < lastIndex && !e.shiftKey)) {
      e.preventDefault();

      if (!$nextAppointment) {
        e.shiftKey ? index-- : index++;
        $nextAppointment = this.getFocusableItemBySortedIndex(index);
      }

      this.resetTabIndex($nextAppointment);
      eventsEngine.trigger($nextAppointment, 'focus');
    }
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

    const resizableInstance = (this.$focusedItem as any).dxResizable('instance');

    if (resizableInstance) {
      resizableInstance._detachEventHandlers();
      resizableInstance._attachEventHandlers();
      resizableInstance._toggleResizingClass(false);
    }
  }
}
