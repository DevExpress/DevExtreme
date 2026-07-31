import dateLocalization from '@js/common/core/localization/date';
import { getGlobalFormatByDataType } from '@ts/core/m_global_format_config';

export const formatImplicitSchedulerDate = (date: Date): string => {
  const globalDateFormat = getGlobalFormatByDataType('date');

  if (globalDateFormat) {
    return dateLocalization.format(date, globalDateFormat) as string;
  }

  return `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`;
};

export const formatImplicitSchedulerMonth = (date: Date): string => {
  const globalDateFormat = getGlobalFormatByDataType('date');

  if (globalDateFormat) {
    return dateLocalization.format(date, globalDateFormat) as string;
  }

  return String(dateLocalization.format(date, 'monthAndYear'));
};

export const formatImplicitSchedulerTime = (date: Date): string => {
  const globalTimeFormat = getGlobalFormatByDataType('time');

  return dateLocalization.format(date, globalTimeFormat || 'shorttime') as string;
};
