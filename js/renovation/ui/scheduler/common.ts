import { utils } from '../../../ui/scheduler/utils';
import { SchedulerProps } from './props';
import { DataAccessorType } from './types';
import { TimeZoneCalculator } from './timeZoneCalculator/utils';
import timeZoneUtils from '../../../ui/scheduler/utils.timeZone';
import { AppointmentsConfigType } from './model/types';
import { Group, ViewDataProviderType, ViewDataProviderValidationOptions } from './workspaces/types';
import {
  AppointmentFilterBaseStrategy,
  AppointmentFilterVirtualStrategy,
} from '../../../ui/scheduler/appointments/dataProvider/appointmentFilter';
import type { Appointment } from '../../../ui/scheduler';
import { createExpressions } from '../../../ui/scheduler/resources/utils';
import getPreparedDataItems from './utils/data';

export const createDataAccessors = (
  props: SchedulerProps,
  forceIsoDateParsing = false,
): DataAccessorType => {
  const dataAccessors = utils.dataAccessors.create(
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

  // TODO move to the 'utils.dataAccessors.create'
  dataAccessors.resources = createExpressions(props.resources) as DataAccessorType;

  return dataAccessors;
};

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

export const filterAppointments = (
  appointmentsConfig: AppointmentsConfigType | undefined,
  dataItems: Appointment[],
  dataAccessors: DataAccessorType,
  timeZoneCalculator: TimeZoneCalculator,
  loadedResources: Group[],
  viewDataProvider?: ViewDataProviderType,
): Appointment[] => {
  if (!appointmentsConfig) {
    return [] as Appointment[];
  }

  const filterOptions = {
    resources: appointmentsConfig.resources,
    startDayHour: appointmentsConfig.startDayHour,
    endDayHour: appointmentsConfig.endDayHour,
    appointmentDuration: appointmentsConfig.cellDurationInMinutes,
    showAllDayPanel: appointmentsConfig.showAllDayPanel,
    supportAllDayRow: appointmentsConfig.supportAllDayRow,
    firstDayOfWeek: appointmentsConfig.firstDayOfWeek,
    viewType: appointmentsConfig.viewType,
    viewDirection: 'vertical', // TODO,
    dateRange: appointmentsConfig.dateRange,
    groupCount: appointmentsConfig.groupCount,
    //
    timeZoneCalculator,
    dataSource: undefined,
    dataAccessors,
    loadedResources,
    viewDataProvider,
  };

  const preparedDataItems = getPreparedDataItems(
    dataItems,
    dataAccessors,
    appointmentsConfig.cellDurationInMinutes,
    timeZoneCalculator,
  );

  const filterStrategy = appointmentsConfig.isVirtualScrolling
    ? new AppointmentFilterVirtualStrategy(filterOptions)
    : new AppointmentFilterBaseStrategy(filterOptions);

  const filteredItems = filterStrategy.filter(preparedDataItems);

  return filteredItems as Appointment[];
};

export const isViewDataProviderConfigValid = (
  viewDataProviderConfig: ViewDataProviderValidationOptions | undefined,
  currentViewOptions: ViewDataProviderValidationOptions,
): boolean => {
  if (!viewDataProviderConfig) {
    return false;
  }

  let result = true;

  Object.entries(viewDataProviderConfig).forEach(([key, value]) => {
    if (value !== currentViewOptions[key]) {
      result = false;
    }
  });

  return result;
};
