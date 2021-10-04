import { utils } from '../../../ui/scheduler/utils';
import { SchedulerProps } from './props';
import { DataAccessorType, ViewType } from './types';
import { TimeZoneCalculator } from './timeZoneCalculator/utils';
import timeZoneUtils from '../../../ui/scheduler/utils.timeZone';
import { AppointmentDataProvider } from '../../../ui/scheduler/appointments/DataProvider/appointmentDataProvider';
import { CurrentViewConfigType } from './workspaces/props';
import { Group, ViewDataProviderType } from './workspaces/types';
import { getGroupCount } from '../../../ui/scheduler/resources/utils';

export const createDataAccessors = (
  props: SchedulerProps,
  forceIsoDateParsing = false,
): DataAccessorType => utils.dataAccessors.create(
  {
    startDate: props.startDateExpr,
    endDate: props.endDateExpr,
    startDateTimeZone: props.startDateTimeZoneExpr,
    endDateTimeZone: props.endDateTimeZoneExpr,
    allDay: props.allDayExpr,
    text: props.textExpr,
    description: props.descriptionExpr,
    recurrenceRule: props.recurrenceRuleExpr,
    recurrenceException: props.recurrenceExceptionExpr,
  },
  null,
  forceIsoDateParsing,
  props.dateSerializationFormat,
) as DataAccessorType;

export const createTimeZoneCalculator = (
  currentTimeZone: string,
): TimeZoneCalculator => new TimeZoneCalculator({
  getClientOffset: (date: Date): number => timeZoneUtils.getClientTimezoneOffset(date),
  getCommonOffset: (
    date: Date,
  ): number => timeZoneUtils.calculateTimezoneByValue(
    currentTimeZone,
    date,
  ) as number,
  getAppointmentOffset: (
    date: Date,
    appointmentTimezone: string | undefined,
  ): number => timeZoneUtils.calculateTimezoneByValue(
    appointmentTimezone,
    date,
  ) as number,
});

export const createAppointmentDataProvider = (
  schedulerConfig: SchedulerProps,
  viewConfig: CurrentViewConfigType,
  isVirtualScrolling: boolean,
  loadedResources: Group[],
  dataAccessors: DataAccessorType,
  timeZoneCalculator: TimeZoneCalculator,
  viewDataProvider: ViewDataProviderType,
): unknown => new AppointmentDataProvider({
  dataSource: schedulerConfig.dataSource,
  dataAccessors,
  timeZoneCalculator,
  dateSerializationFormat: schedulerConfig.dateSerializationFormat,
  resources: schedulerConfig.resources,
  showAllDayPanel: schedulerConfig.showAllDayPanel,
  startDayHour: viewConfig.startDayHour,
  endDayHour: viewConfig.endDayHour,
  appointmentDuration: viewConfig.cellDuration,
  getLoadedResources: (): Group[] => loadedResources,
  getIsVirtualScrolling: (): boolean => isVirtualScrolling,
  getSupportAllDayRow: (): boolean => viewConfig.showAllDayPanel,
  getViewType: (): ViewType => viewConfig.type,
  getViewDirection: (): string => 'vertical', // TODO
  getDateRange: (): Date[] => [ // TODO get rid of dateRange
    viewDataProvider.getStartViewDate(),
    viewDataProvider.getLastViewDateByEndDayHour(viewConfig.endDayHour),
  ],
  getGroupCount: (): number => getGroupCount(schedulerConfig.groups),
  getViewDataProvider: (): ViewDataProviderType => viewDataProvider,
});
