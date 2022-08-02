import { AppointmentFilter, DataAccessorType, ViewType } from '../../types';
import {
  AppointmentFilterBaseStrategy,
  AppointmentFilterVirtualStrategy,
} from '../../../../../ui/scheduler/appointments/dataProvider/appointmentFilter';
import { TimeZoneCalculator } from '../../timeZoneCalculator/utils';
import { Group, ViewDataProviderType } from '../../workspaces/types';
import { ResourceProps } from '../../props';
import { IAllDayPanelBehavior } from '../../appointment/allDayStrategy/index';

export const getFilterStrategy = (
  resources: ResourceProps[],
  startDayHour: number,
  endDayHour: number,
  cellDurationInMinutes: number,
  allDayPanelBehavior: IAllDayPanelBehavior,
  supportAllDayRow: boolean,
  firstDayOfWeek: number,
  viewType: ViewType,
  dateRange: Date[],
  groupCount: number,
  loadedResources: Group[],
  isVirtualScrolling: boolean,
  timeZoneCalculator: TimeZoneCalculator,
  dataAccessors: DataAccessorType,
  viewDataProvider: ViewDataProviderType,
): AppointmentFilter => {
  const filterOptions = {
    resources,
    startDayHour,
    endDayHour,
    appointmentDuration: cellDurationInMinutes,
    allDayPanelBehavior,
    supportAllDayRow,
    firstDayOfWeek,
    viewType,
    viewDirection: 'vertical', // TODO,
    dateRange,
    groupCount,
    loadedResources,
    isVirtualScrolling,
    timeZoneCalculator,
    dataSource: undefined,
    dataAccessors,
    viewDataProvider,
  };

  return isVirtualScrolling
    ? new AppointmentFilterVirtualStrategy(filterOptions)
    : new AppointmentFilterBaseStrategy(filterOptions);
};
