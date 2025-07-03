import { dateUtilsTs } from '@ts/core/utils/date';

import type { TimeZoneCalculator } from '../../../r1/timezone_calculator';
import { isAppointmentTakesAllDay } from '../../../r1/utils';
import type { AllDayPanelModeType, AppointmentDataItem } from '../../../types';
import type { ResourceLoader } from '../../../utils/loader/resource_loader';
import { isAppointmentMatchedDateTime } from './isAppointmentMatchedDateTime';
import { isAppointmentMatchedResources } from './isAppointmentMatchedResources';
import { isRecurrenceAppointmentMatchedDateTime } from './isRecurrenceAppointmentMatchedDateTime';

interface Options {
  startDayHour: number;
  endDayHour: number;
  viewOffset: number;
  resources: ResourceLoader[];
  firstDayOfWeek: number;
  isTimeDateView: boolean;
  min: Date | number | string;
  max: Date | number | string;
  allDay?: boolean;
  allDayPanelMode: AllDayPanelModeType;
}

export const getAppointmentFilter = (
  filterOptions: Options,
  timeZoneCalculator: TimeZoneCalculator,
) => {
  const min = new Date(filterOptions.min);
  const max = new Date(filterOptions.max);
  const {
    startDayHour,
    endDayHour,
    viewOffset,
    resources,
    firstDayOfWeek,
    isTimeDateView,
    allDay,
    allDayPanelMode,
  } = filterOptions;

  return (appointment: AppointmentDataItem): boolean => {
    const appointmentVisible = appointment.visible ?? true;
    if (!appointmentVisible) {
      return false;
    }

    const isAppointmentOccupiesAllDayPanel = isAppointmentTakesAllDay(
      appointment,
      allDayPanelMode,
    );
    if (isAppointmentOccupiesAllDayPanel && allDay === false) {
      return false;
    }

    if (!isAppointmentMatchedResources(appointment.rawAppointment, resources)) {
      return false;
    }

    const startDate = dateUtilsTs.addOffsets(appointment.startDate, [-viewOffset]);
    const endDate = dateUtilsTs.addOffsets(appointment.endDate, [-viewOffset]);
    const appointmentToCompare: AppointmentDataItem = {
      ...appointment,
      startDate,
      endDate,
      allDay: isAppointmentOccupiesAllDayPanel,
    };
    const isOnlyDateCheck = !isTimeDateView || appointmentToCompare.allDay;

    if (appointment.hasRecurrenceRule) {
      return isRecurrenceAppointmentMatchedDateTime(
        appointmentToCompare,
        {
          firstDayOfWeek,
          startDayHour,
          endDayHour,
          min,
          max,
          isOnlyDateCheck,
        },
        timeZoneCalculator,
      );
    }

    return isAppointmentMatchedDateTime(appointmentToCompare, {
      startDayHour,
      endDayHour,
      min,
      max,
      isOnlyDateCheck,
    });
  };
};
