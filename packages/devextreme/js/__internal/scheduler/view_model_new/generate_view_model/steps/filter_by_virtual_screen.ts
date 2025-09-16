import timeZoneUtils from '../../../m_utils_time_zone';
import type ViewDataProvider from '../../../workspaces/view_model/m_view_data_provider';
import { isAppointmentMatchedIntervals } from '../../common/is_appointment_matched_intervals';
import type { ListEntity } from '../../types';

interface GroupInfo {
  allDay: boolean;
  startDate: Date;
  endDate: Date;
  groupIndex: number;
}

export const filterByVirtualScreen = <T extends ListEntity>(
  entities: T[],
  viewDataProvider: ViewDataProvider,
  isVirtualScrolling: boolean,
): T[] => {
  if (!isVirtualScrolling) {
    return entities;
  }

  const groupsInfo = viewDataProvider.getCompletedGroupsInfo();
  const groupMap = new Map<number, GroupInfo>();
  groupsInfo.forEach((group) => {
    groupMap.set(group.groupIndex, group);
  });

  return entities.filter((appointment) => {
    const groupInfo = groupMap.get(appointment.groupIndex);
    if (!groupInfo) {
      return false;
    }
    if (appointment.isAllDayPanelOccupied) {
      return true;
    }

    const groupInterval = {
      min: timeZoneUtils.createUTCDateWithLocalOffset(groupInfo.startDate).getTime(),
      max: timeZoneUtils.createUTCDateWithLocalOffset(groupInfo.endDate).getTime(),
    };

    return isAppointmentMatchedIntervals(
      { startDate: appointment.startDateUTC, endDate: appointment.endDateUTC },
      [groupInterval],
    );
  });
};
