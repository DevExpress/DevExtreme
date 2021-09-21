import dxScheduler from '../../../ui/scheduler';
import { utils } from '../../../ui/scheduler/utils';
import { SchedulerProps } from './props';
import { DataAccessorType } from './types';

export const createDataAccessors = (
  instance: dxScheduler,
  props: SchedulerProps,
  dataAccessors: DataAccessorType,
  setDateSerializationFormat: (value: string) => void,
): DataAccessorType => {
  const result = utils.dataAccessors.create(
    instance,
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
      // disabled: this.props.disabledExpr // ?
    },
    dataAccessors,
    props.forceIsoDateParsing,
    () => props.dateSerializationFormat,
    setDateSerializationFormat,
  );

  return result as DataAccessorType;
};
