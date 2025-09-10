import { dateUtils } from '@ts/core/utils/m_date';

import type { DateInterval } from '../../types';

const toMs = dateUtils.dateToMilliseconds;

export const getIntervalDaysCount = (
  interval: DateInterval,
): number => Math.round((interval.max - interval.min) / toMs('day'));
