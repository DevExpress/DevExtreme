import { AppointmentFilter, DataAccessorType } from '../../types';
import {
  AppointmentFilterBaseStrategy,
  AppointmentFilterVirtualStrategy,
} from '../../../../../__internal/scheduler/appointments/data_provider/m_appointment_filter';
import { ResourceProps } from '../../props';
import { Group, ViewDataProviderType, ViewType } from '../../../../../__internal/scheduler/__migration/types';
import { TimeZoneCalculator } from '../../../../../__internal/scheduler/__migration/timezone_calculator/index';

export const getFilterStrategy = (
  resources: ResourceProps[],
  startDayHour: number,
  endDayHour: number,
  cellDurationInMinutes: number,
  showAllDayPanel: boolean,
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
    showAllDayPanel,
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
