import timeZoneUtils from '../../../../../ui/scheduler/utils.timeZone';

export type TConvertDirection = 'toUtc' | 'toLocal';

export const convertUTCDate = (
  date: Date | string,
  direction: TConvertDirection,
): Date | string => {
  if (!date) {
    return date;
  }

  const sourceDate = typeof date === 'string'
    ? new Date(date)
    : date;

  const offset = direction === 'toLocal'
    ? timeZoneUtils.getClientTimezoneOffset()
    : -1 * timeZoneUtils.getClientTimezoneOffset();

  return new Date(sourceDate.getTime() + offset);
};
