import { within } from '@testing-library/dom';
import { ToolbarModel } from '@ts/scheduler/__tests__/__mock__/model/toolbar';

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
    const statusElement = this.container.querySelector('.dx-scheduler-a11y-status-container');
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

  getDateTableContent(): string[] {
    const cells = this.container.querySelectorAll('.dx-scheduler-date-table-cell');
    return getTexts(cells);
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
}

export const createSchedulerModel = (container: HTMLDivElement): SchedulerModel => {
  const model = new SchedulerModel(container);

  return model;
};
