import Scheduler from '@ts/scheduler/m_scheduler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Config = any;

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

export const createScheduler = async (config: Config): Promise<{
  container: HTMLDivElement;
  scheduler: Scheduler;
  POM: {
    getAppointment: () => HTMLDivElement | null;
    getAppointments: () => NodeListOf<HTMLDivElement>;
    getAppointmentColor: (view: string) => string;
    getDateTableContent: () => string[];
    getHeaderPanelContent: () => string[];
    getTimePanelContent: () => string[];
    getGroupTableContent: () => string[];
  };
  keydown: (element: Element, key: string) => void;
}> => {
  const container = document.createElement('div');
  document.body.append(container);
  const scheduler = new Scheduler(container, config);
  await new Promise(process.nextTick);

  return {
    container,
    scheduler,
    POM: {
      getAppointment(): HTMLDivElement | null {
        return container.querySelector('.dx-scheduler-appointment');
      },
      getAppointments(): NodeListOf<HTMLDivElement> {
        return container.querySelectorAll('.dx-scheduler-appointment');
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
    },
    keydown: (element: Element, key: string): void => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    },
  };
};
