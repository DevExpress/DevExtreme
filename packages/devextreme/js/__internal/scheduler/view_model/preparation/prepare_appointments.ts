import type { Appointment } from '@js/ui/scheduler';

import type Scheduler from '../../m_scheduler';
import type { MinimalAppointmentEntity } from '../types';
import { getMinimalAppointments } from './utils/get_minimal_appointments';
import { replaceIncorrectEndDate } from './utils/replace_incorrect_end_date';

export const prepareAppointments = (
  schedulerStore: Scheduler,
  items?: Appointment[],
): MinimalAppointmentEntity[] => {
  const cellDurationInMinutes = schedulerStore.getViewOption('cellDuration');
  const { dataAccessors } = schedulerStore;
  const safeItems = replaceIncorrectEndDate(
    items,
    cellDurationInMinutes,
    dataAccessors,
  );

  return getMinimalAppointments(safeItems, {
    dataAccessors,
    timeZoneCalculator: schedulerStore.timeZoneCalculator,
  });
};
