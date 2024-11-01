import dateLocalization from '@js/common/core/localization/date';

export const formatWeekday = (date: Date): string => dateLocalization
  .getDayNames('abbreviated')[date.getDay()];

export const formatWeekdayAndDay = (date: Date): string => `${formatWeekday(date)} ${dateLocalization.format(date, 'day')}`;
