import timeZoneUtils from '../../../utils_time_zone';
import type ViewDataProvider from '../../../workspaces/view_model/m_view_data_provider';
import { isAppointmentMatchedIntervals } from '../../common/is_appointment_matched_intervals';
import type { ListEntity } from '../../types';

export const filterByVirtualScreen = <T extends ListEntity>(
  entities: T[],
  viewDataProvider: ViewDataProvider,
  isVirtualScrolling: boolean,
): T[] => {
  if (!isVirtualScrolling) {
    return entities;
  }

  const groupsInfo = viewDataProvider.getCompletedGroupsInfo();
  const groupIntervalsMap = new Map<number, { min: number; max: number }>();
  groupsInfo.forEach((group) => {
    groupIntervalsMap.set(group.groupIndex, {
      min: (timeZoneUtils.createUTCDateWithLocalOffset(group.startDate) as Date).getTime(),
      max: (timeZoneUtils.createUTCDateWithLocalOffset(group.endDate) as Date).getTime(),
    });
  });

  return entities.filter((appointment) => {
    const groupInterval = groupIntervalsMap.get(appointment.groupIndex);
    if (!groupInterval) {
      return false;
    }
    if (appointment.isAllDayPanelOccupied) {
      return true;
    }

    return isAppointmentMatchedIntervals(
      { startDate: appointment.startDateUTC, endDate: appointment.endDateUTC },
      [groupInterval],
    );
  });
};
