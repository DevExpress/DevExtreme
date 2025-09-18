import type { DateInterval } from '../types';

export const trimInterval = ({
  min,
  max,
}: DateInterval): DateInterval => {
  const maxMinusDay = new Date(max - 1).setUTCHours(0, 0, 0, 0);
  const maxMinusDayDate = new Date(maxMinusDay);

  return {
    min: new Date(min).setUTCHours(0, 0, 0, 0),
    max: maxMinusDayDate.setDate(maxMinusDayDate.getDate() + 1),
  };
};
