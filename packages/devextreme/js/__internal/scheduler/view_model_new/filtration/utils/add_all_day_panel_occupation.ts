import { isAppointmentTakesAllDay } from '../../../r1/utils/base';
import type { AllDayPanelOccupation, FilterOptions, MinimalAppointmentEntity } from '../../types';

export const addAllDayPanelOccupation = <T extends MinimalAppointmentEntity>(
  entities: T[],
  { supportAllDayPanel, allDayPanelMode }: FilterOptions,
): (T & AllDayPanelOccupation)[] => entities.map((entity) => {
    const isAllDayPanelOccupied = supportAllDayPanel && isAppointmentTakesAllDay(
      {
        allDay: entity.allDay,
        startDate: new Date(entity.startDate),
        endDate: new Date(entity.endDate),
      },
      allDayPanelMode,
    );

    return {
      ...entity,
      isAllDayPanelOccupied,
    };
  });
