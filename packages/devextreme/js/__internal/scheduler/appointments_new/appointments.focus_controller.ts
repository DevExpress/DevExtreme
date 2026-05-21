import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import { focus } from '@ts/events/m_short';

import { getRawAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import type { SortedEntity } from '../view_model/types';
import type { BaseAppointmentView } from './appointment/base_appointment';
import { AppointmentCollector } from './appointment_collector';
import type { Appointments } from './appointments';
import type { ViewItem } from './view_item';

export class AppointmentsFocusController {
  private focusableSortedIndex = 0;

  private needRestoreFocusIndex = -1;

  private get sortedAppointments(): SortedEntity[] {
    return this.appointments.option().getSortedItems();
  }

  private get isVirtualScrolling(): boolean {
    return this.appointments.option().isVirtualScrolling();
  }

  private get tabIndex(): number | undefined {
    return this.appointments.option().tabIndex;
  }

  constructor(private readonly appointments: Appointments) { }

  public onViewItemClick(viewItem: ViewItem): void {
    this.focusViewItem(viewItem);
  }

  public onViewItemFocusIn(): void { }

  public onViewItemFocusOut(e: DxEvent): void {
    const focusEvent = e.originalEvent as FocusEvent;

    const $relatedTarget = $(focusEvent.relatedTarget as Element);
    const { $commonContainer, $allDayContainer } = this.appointments;

    const isFocusOutside = $relatedTarget.length === 0 || (
      $relatedTarget.closest($commonContainer).length === 0
      && $relatedTarget?.closest($allDayContainer ?? $()).length === 0
    );

    if (isFocusOutside) {
      this.resetTabIndex(0);
    }
  }

  public onViewItemKeyDown(viewItem: ViewItem, e: KeyboardKeyDownEvent): void {
    switch (true) {
      case e.key === 'Tab':
        this.handleTabKeyDown(e, viewItem.option().sortedIndex);
        break;
      case e.key === 'Delete':
        this.handleDeleteKeyDown(viewItem);
        break;
      case e.key === 'Home':
        this.handleHomeKeyDown(e);
        break;
      case e.key === 'End':
        this.handleEndKeyDown(e);
        break;
      case e.key === 'Enter':
        this.handleEnterKeyDown(viewItem, e);
        break;
      case e.key === ' ':
        this.handleEnterKeyDown(viewItem, e);
        break;
      default:
        break;
    }
  }

  public resetTabIndex(newFocusableIndex?: number): void {
    if (this.needRestoreFocusIndex >= 0) {
      const viewItem = this.appointments.getViewItemBySortedIndex(
        this.needRestoreFocusIndex,
      );

      viewItem?.setTabIndex(this.tabIndex);
      focus.trigger(viewItem?.$element());

      this.focusableSortedIndex = this.needRestoreFocusIndex;
      this.needRestoreFocusIndex = -1;
      return;
    }

    if (newFocusableIndex !== undefined) {
      this.appointments.getViewItemBySortedIndex(this.focusableSortedIndex)?.setTabIndex(-1);
      this.focusableSortedIndex = newFocusableIndex;
    }

    // TODO: in virtual scrolling no appointment may be rendered in the initial viewport
    this.appointments
      .getViewItemBySortedIndex(this.focusableSortedIndex)
      ?.setTabIndex(this.tabIndex);
  }

  private handleTabKeyDown(e: KeyboardKeyDownEvent, sortedIndex: number): void {
    const nextIndex = sortedIndex + (e.shift ? -1 : 1);
    const nextItemData = this.sortedAppointments[nextIndex];

    if (!nextItemData) {
      return;
    }

    e.originalEvent.preventDefault();
    this.focusBySortedItem(nextItemData);
  }

  private handleDeleteKeyDown(viewItem: ViewItem): void {
    if (viewItem instanceof AppointmentCollector) { return; }

    const { allowDelete, onDeleteKeyPress } = this.appointments.option();
    if (!allowDelete) { return; }

    const sortedItem = this.sortedAppointments[viewItem.option().sortedIndex];
    if (!sortedItem) { return; }

    const appointmentViewItem = viewItem as BaseAppointmentView;
    onDeleteKeyPress({
      appointmentData: sortedItem.itemData,
      targetedAppointmentData: appointmentViewItem.targetedAppointmentData,
    });
  }

  private handleHomeKeyDown(e: KeyboardKeyDownEvent): void {
    const firstSortedItem = this.sortedAppointments[0];
    if (firstSortedItem) {
      e.originalEvent.preventDefault();
      this.focusBySortedItem(firstSortedItem);
    }
  }

  private handleEndKeyDown(e: KeyboardKeyDownEvent): void {
    const lastSortedItem = this.sortedAppointments[this.sortedAppointments.length - 1];
    if (lastSortedItem) {
      e.originalEvent.preventDefault();
      this.focusBySortedItem(lastSortedItem);
    }
  }

  private handleEnterKeyDown(viewItem: ViewItem, e: KeyboardKeyDownEvent): void {
    const { onItemActivate } = this.appointments.option();
    const sortedItem = this.sortedAppointments[viewItem.option().sortedIndex];
    if (!sortedItem) { return; }
    e.originalEvent.preventDefault();
    const appointmentViewItem = viewItem as BaseAppointmentView;
    onItemActivate({
      data: sortedItem.itemData,
      targetedAppointmentData: appointmentViewItem.targetedAppointmentData,
    });
  }

  private focusBySortedItem(sortedItem: SortedEntity): void {
    if (this.isVirtualScrolling) {
      this.scrollToItem(sortedItem);
    }

    const viewItem = this.appointments.getViewItemBySortedIndex(sortedItem.sortedIndex);

    if (viewItem) {
      this.focusViewItem(viewItem);
    } else if (this.isVirtualScrolling) {
      this.needRestoreFocusIndex = sortedItem.sortedIndex;
    }
  }

  private focusViewItem(viewItem: ViewItem): void {
    this.resetTabIndex(viewItem.option().sortedIndex);
    focus.trigger(viewItem?.$element());
  }

  private scrollToItem(sortedItem: SortedEntity): void {
    const { getStartViewDate, getResourceManager, scrollTo } = this.appointments.option();

    const date = new Date(Math.max(
      getStartViewDate().getTime(),
      sortedItem.source.startDate,
    ));

    const group = getRawAppointmentGroupValues(
      sortedItem.itemData,
      getResourceManager().resources,
    );

    scrollTo(date, { group, allDay: sortedItem.allDay });
  }
}
