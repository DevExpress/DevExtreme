const EMPTY_POSITION = {
  top: 0, left: 0, width: 0, height: 0,
};

type Position = typeof EMPTY_POSITION;
export interface AppointmentModel<T = HTMLDivElement> {
  element: T;
  getText: () => string;
  getDisplayDate: () => string;
  getPosition: () => Position;
  getSnapshot: () => object;
}

const getText = (element: HTMLDivElement | null): string => element?.querySelector('.dx-scheduler-appointment-title')?.textContent ?? '';
const getDisplayDate = (element: HTMLDivElement | null): string => element?.querySelector('.dx-scheduler-appointment-content-date')?.textContent ?? '';
const getPosition = (element: HTMLDivElement | null): Position => {
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
    getPosition: () => getPosition(element),
    getSnapshot: (): object => ({
      text: getText(element),
      date: getDisplayDate(element),
      ...getPosition(element),
    }),
  });
