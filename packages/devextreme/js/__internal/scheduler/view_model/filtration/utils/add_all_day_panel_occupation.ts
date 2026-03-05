import { isAppointmentTakesAllDay } from '../../../r1/utils/base';
import type { AllDayPanelOccupation, FilterOptions, MinimalAppointmentEntity } from '../../types';

export const addAllDayPanelOccupation = <T extends MinimalAppointmentEntity>(
  appointments: T[],
  { supportAllDayPanel, allDayPanelMode }: FilterOptions,
): (T & AllDayPanelOccupation)[] => appointments.map((appointment) => {
  const isAllDayPanelOccupied = supportAllDayPanel && isAppointmentTakesAllDay(
    {
      allDay: appointment.allDay,
      startDate: new Date(appointment.source.startDate),
      endDate: new Date(appointment.source.endDate),
    },
    allDayPanelMode,
  );

  return {
    ...appointment,
    isAllDayPanelOccupied,
  };
});
