import type { AppointmentModel } from './appointment';
import { createAppointmentModel } from './appointment';

const getTexts = (
  cells: NodeListOf<Element>,
): string[] => Array.from(cells).map((cell) => cell.textContent?.trim() ?? '');

export interface SchedulerModel {
  getAppointment: () => AppointmentModel<HTMLDivElement | null>;
  getAppointments: () => AppointmentModel[];
  getDateTableContent: () => string[];
  getHeaderPanelContent: () => string[];
  getTimePanelContent: () => string[];
  getGroupTableContent: () => string[];
}

export const createSchedulerModel = (container: HTMLDivElement): SchedulerModel => ({
  getAppointment(): AppointmentModel<HTMLDivElement | null> {
    return createAppointmentModel(container.querySelector('.dx-scheduler-appointment'));
  },
  getAppointments(): AppointmentModel[] {
    return [...container.querySelectorAll('.dx-scheduler-appointment')].map(
      (element) => createAppointmentModel(element as HTMLDivElement),
    );
  },
  getDateTableContent(): string[] {
    const cells = container.querySelectorAll('.dx-scheduler-date-table-cell');
    return getTexts(cells);
  },
  getHeaderPanelContent(): string[] {
    const cells = container.querySelectorAll('.dx-scheduler-header-panel-cell');
    return getTexts(cells);
  },
  getTimePanelContent(): string[] {
    const cells = container.querySelectorAll('.dx-scheduler-time-panel-cell');
    return getTexts(cells);
  },
  getGroupTableContent(): string[] {
    const cells = container.querySelectorAll('.dx-scheduler-group-header');
    return getTexts(cells);
  },
});
