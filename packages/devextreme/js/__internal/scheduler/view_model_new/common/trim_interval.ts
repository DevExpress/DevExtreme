import { getDatesWithoutTime } from '../../r1/utils';
import type { DateInterval } from '../types';

export const trimInterval = ({
  min,
  max,
}: DateInterval): DateInterval => {
  const [trimMin, trimMax] = getDatesWithoutTime(min, max);

  return { min: trimMin.getTime(), max: trimMax.getTime() };
};
