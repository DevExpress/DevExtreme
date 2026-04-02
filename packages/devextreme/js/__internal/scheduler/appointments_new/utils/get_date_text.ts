import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';
import { getGlobalFormatByDataType } from '@ts/core/m_global_format_config';

import type { TargetedAppointment, ViewType } from '../../types';

const formatTooltipDatePart = (date: Date): string => {
  const globalFormat = getGlobalFormatByDataType('date');

  if (globalFormat) {
    return dateLocalization.format(date, globalFormat) as string;
  }

  return String(dateLocalization.format(date, 'monthandday'));
};

const formatTooltipTimePart = (date: Date): string => {
  const globalFormat = getGlobalFormatByDataType('time');

  if (globalFormat) {
    return dateLocalization.format(date, globalFormat) as string;
  }

  return String(dateLocalization.format(date, 'shorttime'));
};

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
  const isSameDate = dateUtils.sameDate(startDate, endDate);

  switch (formatType) {
    case DateFormatType.DATETIME:
      return [
        formatTooltipDatePart(startDate),
        ' ',
        formatTooltipTimePart(startDate),
        ' - ',
        isSameDate ? '' : `${formatTooltipDatePart(endDate)} `,
        formatTooltipTimePart(endDate),
      ].join('');
    case DateFormatType.TIME:
      return `${formatTooltipTimePart(startDate)} - ${formatTooltipTimePart(endDate)}`;
    case DateFormatType.DATE:
      return `${formatTooltipDatePart(startDate)}${isSameDate ? '' : ` - ${formatTooltipDatePart(endDate)}`}`;
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
