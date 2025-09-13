import timeZoneUtils from '../../../m_utils_time_zone';
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
  // NOTE: all groups are the same because screen is rectangle
  const groupIntervals = [{
    min: timeZoneUtils.createUTCDateWithLocalOffset(groupsInfo[0].startDate).getTime(),
    max: timeZoneUtils.createUTCDateWithLocalOffset(groupsInfo[0].endDate).getTime(),
  }];
  const groupIndexes = new Set(groupsInfo.map((group) => group.groupIndex));

  // NOTE: All day panel filter only by groupIndex, because it always fully visible
  return entities.filter((appointment) => groupIndexes.has(appointment.groupIndex) && (
    appointment.isAllDayPanelOccupied
      || isAppointmentMatchedIntervals(
        { startDate: appointment.startDateUTC, endDate: appointment.endDateUTC },
        groupIntervals,
      )
  ));
};
