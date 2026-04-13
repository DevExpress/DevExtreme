import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import type { KeyboardKeyDownEvent } from '@ts/events/core/m_keyboard_processor';

import { getRawAppointmentGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import type { SortedEntity } from '../view_model/types';
import type { Appointments } from './appointments';

export class AppointmentsFocusController {
  private focusedIndex = -1;

  private needRestoreFocusIndex = -1;

  private get sortedAppointments(): SortedEntity[] {
    return this.appointments.option().getSortedAppointments();
  }

  private get isVirtualScrolling(): boolean {
    return this.appointments.option().isVirtualScrolling();
  }

  constructor(private readonly appointments: Appointments) { }

  public onAppointmentFocusIn(sortedIndex: number): void {
    this.focusedIndex = sortedIndex;
  }

  public onAppointmentFocusOut(e: DxEvent, sortedIndex: number): void {
    const focusEvent = e.originalEvent as FocusEvent;

    const $relatedTarget = $(focusEvent.relatedTarget as Element);
    const { $commonContainer, $allDayContainer } = this.appointments;

    const isFocusOutside = $relatedTarget.length === 0 || (
      $relatedTarget.closest($commonContainer).length === 0
      && $relatedTarget?.closest($allDayContainer ?? $()).length === 0
    );

    if (isFocusOutside) {
      this.focusedIndex = -1;
      this.resetTabIndex();
    }
  }

  public onAppointmentKeyDown(e: KeyboardKeyDownEvent, sortedIndex: number): void {
    if (e.key === 'Tab') {
      this.handleTabKeyDown(e, sortedIndex);
    }
  }

  public beforeRender(): void {
    // TODO: support case when appointment is deleted or updated

    // if (this.needRestoreFocusIndex === -1) {
    //   this.needRestoreFocusIndex = this.focusedIndex;
    // }
  }

  public resetTabIndex(): void {
    if (this.needRestoreFocusIndex >= 0) {
      const appointmentView = this.appointments.getViewItemBySortedIndex(
        this.needRestoreFocusIndex,
      );
      appointmentView?.focus();
      this.needRestoreFocusIndex = -1;
      return;
    }

    // TODO: in virtual scrolling no appointment may be rendered in the initial viewport
    this.appointments.getViewItemByIndex(0)?.makeFocusable();
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

  private focusByItemData(itemData: SortedEntity): void {
    if (this.isVirtualScrolling) {
      this.scrollToByItemData(itemData);
    }

    const appointmentView = this.appointments.getViewItemBySortedIndex(itemData.sortedIndex);

    if (appointmentView) {
      appointmentView.focus();
    } else if (this.isVirtualScrolling) {
      this.needRestoreFocusIndex = itemData.sortedIndex;
    }
  }

  private scrollToByItemData(itemData: SortedEntity): void {
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
