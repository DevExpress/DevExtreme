import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';
import { focus } from '@ts/events/m_short';

import { getRawAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import type { SortedEntity } from '../view_model/types';
import type { Appointments } from './appointments';
import type { ViewItem } from './view_item';

export class AppointmentsFocusController {
  private focusableSortedIndex = 0;

  private needRestoreFocusIndex = -1;

  private get sortedAppointments(): SortedEntity[] {
    return this.appointments.option().getSortedAppointments();
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
        this.handleDeleteKeyDown(viewItem.option().sortedIndex);
        break;
      case e.key === 'Home':
        this.handleHomeKeyDown();
        break;
      case e.key === 'End':
        this.handleEndKeyDown();
        break;
      case e.key === 'Enter':
        this.handleEnterKeyDown(viewItem.option().sortedIndex);
        break;
      case e.key === ' ':
        this.handleEnterKeyDown(viewItem.option().sortedIndex);
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
    this.focusByItemData(nextItemData);
  }

  private handleDeleteKeyDown(sortedIndex: number): void {
    const { allowDelete, onDeleteKeyPress, getDataAccessor } = this.appointments.option();
    if (!allowDelete) { return; }

    const entity = this.sortedAppointments[sortedIndex];
    if (!entity) { return; }

    const occurrence = { ...entity.itemData };
    getDataAccessor().set('startDate', occurrence, new Date(entity.source.startDate));

    onDeleteKeyPress({ appointment: entity.itemData, occurrence });
  }

  private handleHomeKeyDown(): void {
    const firstAppointment = this.sortedAppointments[0];
    if (firstAppointment) { this.focusByItemData(firstAppointment); }
  }

  private handleEndKeyDown(): void {
    const lastAppointment = this.sortedAppointments[this.sortedAppointments.length - 1];
    if (lastAppointment) { this.focusByItemData(lastAppointment); }
  }

  private handleEnterKeyDown(sortedIndex: number): void {
    const { onItemActivate } = this.appointments.option();
    const entity = this.sortedAppointments[sortedIndex];
    onItemActivate({ data: entity?.itemData, target: null });
  }

  private focusByItemData(itemData: SortedEntity): void {
    if (this.isVirtualScrolling) {
      this.scrollToItem(itemData);
    }

    const viewItem = this.appointments.getViewItemBySortedIndex(itemData.sortedIndex);

    if (viewItem) {
      this.focusViewItem(viewItem);
    } else if (this.isVirtualScrolling) {
      this.needRestoreFocusIndex = itemData.sortedIndex;
    }
  }

  private focusViewItem(viewItem: ViewItem): void {
    this.resetTabIndex(viewItem.option().sortedIndex);
    focus.trigger(viewItem?.$element());
  }

  private scrollToItem(itemData: SortedEntity): void {
    const { getStartViewDate, getResourceManager, scrollTo } = this.appointments.option();

    const date = new Date(Math.max(
      getStartViewDate().getTime(),
      itemData.source.startDate,
    ));

    const group = getRawAppointmentGroupValues(
      itemData.itemData,
      getResourceManager().resources,
    );

    scrollTo(date, { group, allDay: itemData.allDay });
  }
}
