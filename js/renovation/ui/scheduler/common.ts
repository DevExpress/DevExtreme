import { utils } from '../../../ui/scheduler/utils';
import { SchedulerProps } from './props';
import { DataAccessorType } from './types';

export const createDataAccessors = (
  props: SchedulerProps,
): DataAccessorType => {
  const result = utils.dataAccessors.create(
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
  );

  return result as DataAccessorType;
};
