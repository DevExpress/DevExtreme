import $ from '@js/core/renderer';
import { within } from '@testing-library/dom';
import { ToolbarModel } from '@ts/scheduler/__tests__/__mock__/model/toolbar';
import List from '@ts/ui/list/list.edit';

import { APPOINTMENT_POPUP_CLASS } from '../../../appointment_popup/m_popup';
import { POPUP_DIALOG_CLASS } from '../../../m_scheduler';
import type { AppointmentModel } from './appointment';
import { createAppointmentModel } from './appointment';
import { PopupModel } from './popup';

const getTexts = (
  cells: ArrayLike<Element>,
): string[] => Array.from(cells).map((cell) => cell.textContent?.trim() ?? '');

export class SchedulerModel {
  container: HTMLDivElement;

  private readonly queries: ReturnType<typeof within>;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.queries = within(container);
  }

  get popup(): PopupModel {
    return this.getPopup();
  }

  get toolbar(): ToolbarModel {
    return new ToolbarModel(this.queries.getByRole('toolbar'));
  }

  getStatusContent(): string {
    const statusElement = this.container.querySelector('.dx-screen-reader-only');
    return statusElement?.textContent ?? '';
  }

  getAppointment(text?: string): AppointmentModel<HTMLDivElement | null> {
    if (!text) {
      const appointments = this.getAppointments();
      return appointments.length > 0 ? appointments[0] : createAppointmentModel(null);
    }
    return this.getAppointments()
      .find((appointment) => appointment.getText() === text) ?? createAppointmentModel(null);
  }

  getAppointments(): AppointmentModel[] {
    const allButtons = this.queries.queryAllByRole('button') as HTMLElement[];
    const appointments = allButtons.filter((btn) => btn.classList.contains('dx-scheduler-appointment'));
    return appointments.map((element) => createAppointmentModel(element as HTMLDivElement));
  }

  getCollectorTexts(): string[] {
    const allButtons = this.queries.queryAllByRole('button') as HTMLElement[];
    const collectors = allButtons.filter((btn) => btn.classList.contains('dx-scheduler-appointment-collector'));
    return getTexts(collectors);
  }

  getCollectorButton(index = 0): HTMLElement {
    const allButtons = this.queries.queryAllByRole('button') as HTMLElement[];
    const collectors = allButtons.filter((btn) => btn.classList.contains('dx-scheduler-appointment-collector'));

    if (collectors.length === 0) {
      throw new Error('Collector button not found');
    }

    return collectors[index];
  }

  isTooltipVisible(): boolean {
    return document.querySelector('.dx-overlay-wrapper.dx-scheduler-appointment-tooltip-wrapper') !== null;
  }

  getTooltipDeleteButton(index = 0): HTMLElement {
    const buttons = document.querySelectorAll<HTMLElement>('.dx-tooltip-appointment-item-delete-button');

    if (buttons.length === 0) {
      throw new Error('Tooltip delete button not found');
    }

    return buttons[index];
  }

  pressDeleteOnTooltipItem(index = 0): void {
    const wrapper = document.querySelector('.dx-overlay-wrapper.dx-scheduler-appointment-tooltip-wrapper');
    const listScrollable = wrapper?.querySelector('.dx-scrollable');

    if (!listScrollable) {
      throw new Error('Tooltip list not found');
    }

    const listItems = wrapper?.querySelectorAll<HTMLElement>('.dx-list-item');
    if (!listItems || listItems?.length === 0) {
      throw new Error('Tooltip list item not found');
    }

    const listInstance = List.getInstance($(listScrollable));
    const targetItem = listItems[index];
    listInstance.option('focusedElement', $(targetItem));

    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Delete',
      which: 46,
      keyCode: 46,
      bubbles: true,
    });
    const keyboardOptions = {
      keyName: 'del',
      key: 'Delete',
      code: 'Delete',
      which: 46,
      ctrl: false,
      shift: false,
      alt: false,
      metaKey: false,
      location: 0,
      originalEvent: keyEvent,
    };
    listInstance._keyboardHandler(keyboardOptions);
  }

  getDateTableContent(): string[] {
    const cells = this.container.querySelectorAll('.dx-scheduler-date-table-cell');
    return getTexts(cells);
  }

  getDateTableCell(rowIndex = 0, cellIndex = 0): HTMLElement {
    const rowSelector = `.dx-scheduler-date-table-row:nth-child(${rowIndex + 1})`;
    const cellSelector = `.dx-scheduler-date-table-cell:nth-child(${cellIndex + 1})`;
    const selector = `${rowSelector} ${cellSelector}`;

    const result = this.container.querySelector(selector);

    if (!result) {
      throw new Error(`Date cell in row ${rowIndex} and column ${cellIndex} not found`);
    }

    return result as HTMLElement;
  }

  getAllDayTableCell(cellIndex = 0): HTMLElement {
    const cellSelector = `.dx-scheduler-all-day-table-cell:nth-child(${cellIndex + 1})`;
    const result = this.container.querySelector(cellSelector);

    if (!result) {
      throw new Error(`All-day cell in column ${cellIndex} not found`);
    }

    return result as HTMLElement;
  }

  getHeaderPanelContent(): string[] {
    const cells = this.container.querySelectorAll('.dx-scheduler-header-panel-cell');
    return getTexts(cells);
  }

  getTimePanelContent(): string[] {
    const cells = this.container.querySelectorAll('.dx-scheduler-time-panel-cell');
    return getTexts(cells);
  }

  getGroupTableContent(): string[] {
    const cells = this.container.querySelectorAll('.dx-scheduler-group-header');
    return getTexts(cells);
  }

  private getPopup(): PopupModel {
    const elements = this.getPopups();

    if (elements.length === 0) {
      throw new Error('Popup is not rendered');
    }

    const popupElement = elements[0] as HTMLDivElement;

    return new PopupModel(popupElement);
  }

  isPopupVisible(): boolean {
    return this.getPopups().length > 0;
  }

  getPopups = (): NodeListOf<Element> => document.querySelectorAll(`.dx-overlay-wrapper.${APPOINTMENT_POPUP_CLASS}, .dx-overlay-wrapper.${POPUP_DIALOG_CLASS}`);

  getLoadPanel = (): HTMLElement | null => document.querySelector('.dx-loadpanel');

  getTooltipAppointment = (): HTMLElement | null => document.querySelector('.dx-tooltip-appointment-item');

  openPopupByDblClick(text?: string): AppointmentModel {
    const appointment = this.getAppointment(text) as AppointmentModel;

    if (!appointment?.element) {
      throw new Error(`Appointment "${text}" not found`);
    }

    appointment.element.click();
    appointment.element.click();

    return appointment;
  }

  dblClickDateTableCell(rowIndex = 0, cellIndex = 0): void {
    const cellElement = this.getDateTableCell(rowIndex, cellIndex);

    cellElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    cellElement.click();
    cellElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    cellElement.click();
  }

  dblClickAllDayTableCell(cellIndex = 0): void {
    const cellElement = this.getAllDayTableCell(cellIndex);

    cellElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    cellElement.click();
    cellElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    cellElement.click();
  }
}

export const createSchedulerModel = (container: HTMLDivElement): SchedulerModel => {
  const model = new SchedulerModel(container);

  return model;
};
