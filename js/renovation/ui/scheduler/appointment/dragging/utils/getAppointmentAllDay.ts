export const getAppointmentAllDay = (
  appointmentAllDay: boolean,
  sourceCellAllDay: boolean,
  targetCellAllDay: boolean,
): boolean => (sourceCellAllDay
  ? targetCellAllDay && appointmentAllDay
  : targetCellAllDay
);
