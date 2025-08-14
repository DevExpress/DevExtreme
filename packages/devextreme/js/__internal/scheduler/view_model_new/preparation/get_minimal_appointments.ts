import { isDefined } from '@js/core/utils/type';
import type { AllDayPanelMode, Appointment } from '@js/ui/scheduler';

import type { TimeZoneCalculator } from '../../r1/timezone_calculator';
import { isAppointmentTakesAllDay } from '../../r1/utils/base';
import { AppointmentAdapter } from '../../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import type { MinimalAppointmentEntity } from '../types';
import { replaceIncorrectEndDate } from './replace_incorrect_end_date';

interface Options {
  allDayPanelMode: AllDayPanelMode;
  supportAllDayPanel: boolean;
  dataAccessors: AppointmentDataAccessor;
  cellDurationInMinutes: number;
  timeZoneCalculator: TimeZoneCalculator;
}

export const getMinimalAppointments = (
  dataItems: Appointment[] | undefined,
  {
    allDayPanelMode,
    supportAllDayPanel,
    dataAccessors,
    cellDurationInMinutes,
    timeZoneCalculator,
  }: Options,
): MinimalAppointmentEntity[] => {
  const safeItems = replaceIncorrectEndDate(
    dataItems,
    cellDurationInMinutes,
    dataAccessors,
  );

  return safeItems.map((rawAppointment) => {
    const adapter = new AppointmentAdapter(rawAppointment, dataAccessors);
    const { startDate, endDate } = adapter.getCalculatedDates(timeZoneCalculator, 'toGrid');
    const { recurrenceRule } = adapter;
    const hasRecurrenceRule = adapter.isRecurrent;
    const allDayHidden = Boolean(
      supportAllDayPanel
      && rawAppointment.allDay
      && allDayPanelMode === 'hidden',
    );
    const hidden = allDayHidden
      || (isDefined(rawAppointment.visible) && !rawAppointment.visible);
    const { allDay } = adapter;
    const isAllDayPanelOccupied = supportAllDayPanel && isAppointmentTakesAllDay(
      { allDay, startDate, endDate },
      allDayPanelMode,
    );
    const startDateMs = startDate.getTime();
    const endDateMs = endDate.getTime();

    return {
      allDay,
      isAllDayPanelOccupied,
      startDate: startDateMs,
      startDateTimeZone: rawAppointment.startDateTimeZone,
      endDate: endDateMs,
      endDateTimeZone: rawAppointment.endDateTimeZone,
      duration: endDateMs - startDateMs,
      recurrenceRule,
      recurrenceException: adapter.recurrenceException,
      hasRecurrenceRule,
      visible: !hidden,
      itemData: rawAppointment,
    };
  });
};
