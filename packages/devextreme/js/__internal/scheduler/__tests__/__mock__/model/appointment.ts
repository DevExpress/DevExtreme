export interface AppointmentModel {
  element: HTMLDivElement;
  getText: () => string;
}

export const createAppointmentModel = (element: HTMLDivElement): AppointmentModel => ({
  element,
  getText(): string {
    return element.querySelector('.dx-scheduler-appointment-title')?.textContent ?? '';
  },
});
