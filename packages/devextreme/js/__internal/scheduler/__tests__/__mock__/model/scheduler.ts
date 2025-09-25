import { APPOINTMENT_POPUP_CLASS } from '../../../appointment_popup/m_popup';
import { POPUP_DIALOG_CLASS } from '../../../m_scheduler';
import type { AppointmentModel } from './appointment';
import { createAppointmentModel } from './appointment';
import { PopupModel } from './popup';

const getTexts = (
  cells: NodeListOf<Element>,
): string[] => Array.from(cells).map((cell) => cell.textContent?.trim() ?? '');

export class SchedulerModel {
  container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  get popup(): PopupModel {
    return this.getPopup();
  }

  getAppointment(text?: string): AppointmentModel<HTMLDivElement | null> {
    if (!text) {
      return createAppointmentModel(this.container.querySelector('.dx-scheduler-appointment'));
    }
    return this.getAppointments()
      .find((appointment) => appointment.getText() === text) ?? createAppointmentModel(null);
  }

  getAppointments(): AppointmentModel[] {
    return [...this.container.querySelectorAll('.dx-scheduler-appointment')].map(
      (element) => createAppointmentModel(element as HTMLDivElement),
    );
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
