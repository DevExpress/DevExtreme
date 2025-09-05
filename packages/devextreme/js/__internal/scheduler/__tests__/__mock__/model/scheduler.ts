import type { AppointmentModel } from './appointment';
import { createAppointmentModel } from './appointment';

const getAppointmentColor = (container: HTMLDivElement): string => {
  const appointment = container.querySelector('.dx-scheduler-appointment') as HTMLDivElement;
  return appointment.style.backgroundColor;
};
const getAgendaAppointmentColor = (container: HTMLDivElement): string => {
  const appointment = container.querySelector('.dx-scheduler-agenda-appointment-marker') as HTMLDivElement;
  return appointment.style.backgroundColor;
};
const getTexts = (
  cells: NodeListOf<Element>,
): string[] => Array.from(cells).map((cell) => cell.textContent?.trim() ?? '');

export interface SchedulerModel {
  getAppointment: () => HTMLDivElement | null;
  getAppointments: () => AppointmentModel[];
  getCollectorTexts: () => string[];
  getAppointmentColor: (view: string) => string;
  getDateTableContent: () => string[];
  getHeaderPanelContent: () => string[];
  getTimePanelContent: () => string[];
  getGroupTableContent: () => string[];
}

export const createSchedulerModel = (container: HTMLDivElement): SchedulerModel => ({
  getAppointment(): HTMLDivElement | null {
    return container.querySelector('.dx-scheduler-appointment');
  },
  getAppointments(): AppointmentModel[] {
    return [...container.querySelectorAll('.dx-scheduler-appointment')].map(
      (element) => createAppointmentModel(element as HTMLDivElement),
    );
  },
  getCollectorTexts(): string[] {
    const collectors = container.querySelectorAll('.dx-scheduler-appointment-collector');
    return getTexts(collectors);
  },
  getAppointmentColor(view: string): string {
    return view === 'agenda'
      ? getAgendaAppointmentColor(container)
      : getAppointmentColor(container);
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
