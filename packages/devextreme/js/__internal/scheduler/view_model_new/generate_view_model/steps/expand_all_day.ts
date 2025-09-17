import { dateUtils } from '@ts/core/utils/m_date';

import type { ListEntity } from '../../types';

const toMs = dateUtils.dateToMilliseconds;
const MINUTE_MS = toMs('minute');

// NOTE: if all day appointment ends at 00:00 make it longer to occupy next cells day
export const expandAllDayAllDayPanel = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC' | 'allDay'>>(
  entities: T[],
  endDayHour: number,
): T[] => entities.map((entity) => {
    if (!entity.allDay) {
      return entity;
    }

    // NOTE: For case of start date higher than endDayHour:
    // (0 hours) [startHour, endHour] (appointment start, end) (24 hours)
    const minStartDate = new Date(entity.startDateUTC)
      .setUTCHours(endDayHour, 0, 0, 0)
      - MINUTE_MS;
    const maxEndDate = new Date(entity.endDateUTC)
      .setUTCHours(endDayHour, 0, 0, 0)
      - MINUTE_MS;

    return {
      ...entity,
      startDateUTC: Math.min(entity.startDateUTC, minStartDate),
      endDateUTC: Math.max(entity.endDateUTC, maxEndDate),
    };
  });
