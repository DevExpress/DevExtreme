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
    if (e.key === 'Tab') {
      this.handleTabKeyDown(e, viewItem.option().sortedIndex);
    } else if (e.key === 'Delete') {
      this.handleDeleteKeyDown(viewItem.option().sortedIndex);
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
    const { allowDelete, onDeleteKeyPress } = this.appointments.option();
    if (!allowDelete) { return; }

    const itemData = this.sortedAppointments.find((s) => s.sortedIndex === sortedIndex)?.itemData;
    if (!itemData) { return; }
    onDeleteKeyPress({ data: itemData, target: null });
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
