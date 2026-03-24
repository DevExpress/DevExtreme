import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';

import type { TargetedAppointment, ViewType } from '../../types';

export enum DateFormatType {
  DATETIME = 'DATETIME',
  TIME = 'TIME',
  DATE = 'DATE',
}

export const getDateFormatType = (
  startDate: Date,
  endDate: Date,
  isAllDay?: boolean,
  viewType?: ViewType,
): DateFormatType => {
  if (isAllDay) {
    return DateFormatType.DATE;
  }
  if (viewType !== 'month' && dateUtils.sameDate(startDate, endDate)) {
    return DateFormatType.TIME;
  }
  return DateFormatType.DATETIME;
};

export const getDateText = (startDate: Date, endDate: Date, formatType: DateFormatType): string => {
  const dateFormat = 'monthandday';
  const timeFormat = 'shorttime';
  const isSameDate = startDate.getDate() === endDate.getDate();

  switch (formatType) {
    case DateFormatType.DATETIME:
      return [
        dateLocalization.format(startDate, dateFormat),
        ' ',
        dateLocalization.format(startDate, timeFormat),
        ' - ',
        isSameDate ? '' : `${dateLocalization.format(endDate, dateFormat)} `,
        dateLocalization.format(endDate, timeFormat),
      ].join('');
    case DateFormatType.TIME:
      return `${dateLocalization.format(startDate, timeFormat)} - ${dateLocalization.format(endDate, timeFormat)}`;
    case DateFormatType.DATE:
      return `${dateLocalization.format(startDate, dateFormat)}${isSameDate ? '' : ` - ${dateLocalization.format(endDate, dateFormat)}`}`;
    default:
      return '';
  }
};

export const getDateTextFromTargetAppointment = (
  targetedAppointmentData: TargetedAppointment,
  format?: DateFormatType,
  viewType?: ViewType,
): string => {
  const { displayStartDate: startDate, displayEndDate: endDate, allDay } = targetedAppointmentData;
  const formatType = format ?? getDateFormatType(startDate, endDate, allDay, viewType);

  return getDateText(startDate, endDate, formatType);
};
