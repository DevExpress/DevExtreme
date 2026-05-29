const EMPTY_POSITION = {
  top: 0, left: 0, width: 0, height: 0,
};

type Position = typeof EMPTY_POSITION;
export interface AppointmentModel<T = HTMLDivElement> {
  element: T;
  getText: () => string;
  getDisplayDate: () => string;
  getAriaLabel: () => string;
  getAriaDescription: () => string;
  getGeometry: () => Position;
  getColor: (view: string) => string | undefined;
  getSnapshot: () => object;
  isFocused: () => boolean;
  isDragSource: () => boolean;
}

const getColor = (appointment: HTMLDivElement): string => appointment.style.backgroundColor;
const getAgendaColor = (appointment: HTMLDivElement): string => {
  const marker = appointment.querySelector('.dx-scheduler-agenda-appointment-marker') as HTMLDivElement;
  return getColor(marker);
};
const getText = (element: HTMLDivElement | null): string => element?.querySelector('.dx-scheduler-appointment-title')?.textContent ?? '';
const getDisplayDate = (element: HTMLDivElement | null): string => element?.querySelector('.dx-scheduler-appointment-content-date')?.textContent ?? '';
const getGeometry = (element: HTMLDivElement | null): Position => {
  if (!element) {
    return EMPTY_POSITION;
  }

  const match = /translate\(([0-9.]*)px, ([0-9.]*)px\)/.exec(element.style.transform);
  if (!match) {
    return EMPTY_POSITION;
  }

  return {
    top: parseInt(match[2], 10),
    left: parseInt(match[1], 10),
    width: parseInt(element.style.width, 10),
    height: parseInt(element.style.height, 10),
  };
};

export const createAppointmentModel = <T extends HTMLDivElement | null>(
  element: T,
): AppointmentModel<T> => ({
  element,
  getText: () => getText(element),
  getDisplayDate: () => getDisplayDate(element),
  getAriaLabel: () => element?.getAttribute('aria-label') ?? '',
  getAriaDescription: (): string => {
    const id = element?.getAttribute('aria-describedby') ?? '';
    const descriptionElement = id ? document.getElementById(id) : null;
    return descriptionElement?.textContent ?? '';
  },
  getGeometry: () => getGeometry(element),
  getColor(view: string): string | undefined {
    if (!element) {
      return undefined;
    }

    return view === 'agenda'
      ? getAgendaColor(element)
      : getColor(element);
  },
  getSnapshot: (): object => ({
    text: getText(element),
    date: getDisplayDate(element),
    ...getGeometry(element),
  }),
  isFocused: () => element?.classList.contains('dx-state-focused') ?? false,
  isDragSource: () => element?.classList.contains('dx-scheduler-appointment-drag-source') ?? false,
});
