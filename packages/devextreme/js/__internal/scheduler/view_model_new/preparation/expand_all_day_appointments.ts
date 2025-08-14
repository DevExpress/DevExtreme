import type { MinimalAppointmentEntity } from '../types';

export const expandAllDayAppointments = (
  items: MinimalAppointmentEntity[],
  viewOffset: number,
): MinimalAppointmentEntity[] => items.map((item) => {
  const {
    startDate, endDate, allDay, isAllDayPanelOccupied,
  } = item;
  if (!isAllDayPanelOccupied && !allDay) {
    return item;
  }

  const trimmedStartDate = new Date(startDate).setHours(0, 0, 0, 0);
  const trimmedEndDate = new Date(endDate - 1).setHours(24, 0, 0, 0);
  return {
    ...item,
    startDate: trimmedStartDate + viewOffset,
    endDate: trimmedEndDate + viewOffset,
    duration: trimmedEndDate - trimmedStartDate,
  };
});
