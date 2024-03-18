import type { Appointment } from 'devextreme/ui/scheduler';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

export interface AppointmentData {
  startTime: string;
  endTime: string;
  endDateShiftDays?: number;
  text?: string;
  allDay?: boolean;
  recurrenceRule?: string;
}

const timeToText = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

const getIsoDate = (date: Date, additionalDays = 0): string => {
  const dateCopy = new Date(date.getTime() + additionalDays * MS_IN_DAY);
  const [dateISO] = dateCopy.toISOString().split('T');
  return dateISO;
};

export const generateAppointments = (
  startDateISO: string,
  endDateISO: string,
  appointments: AppointmentData[],
): Appointment[] => {
  const startDate = new Date(startDateISO);
  const endDate = new Date(endDateISO);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const daysCount = Math.ceil((diffTime / MS_IN_DAY) + 1);

  return new Array(daysCount)
    .fill(null)
    .map((_, dayIdx) => {
      const date = new Date(startDate.getTime() + MS_IN_DAY * dayIdx);

      return new Array(appointments.length)
        .fill(null)
        .map((__, timeIdx) => {
          const {
            startTime,
            endTime,
            endDateShiftDays,
            text,
            allDay,
            recurrenceRule,
          } = appointments[timeIdx];
          const appointmentIdx = dayIdx * appointments.length + timeIdx;
          const appointmentStartISO = getIsoDate(date);
          const appointmentEndISO = getIsoDate(date, endDateShiftDays ?? 0);
          const [, , dayISO] = appointmentStartISO.split('-');

          const titleText = `#${appointmentIdx}: ${dayISO.padStart(2, '0')} ${
            allDay
              ? 'All'
              : ''
          } ${
            !text
              ? `${timeToText(startTime)}-${timeToText(endTime)}`
              : text
          }`;

          return {
            startDate: `${appointmentStartISO}T${startTime}`,
            endDate: `${appointmentEndISO}T${endTime}`,
            text: titleText,
            allDay,
            recurrenceRule,
          };
        });
    })
    .flat();
};
