import { utils } from '../../../ui/scheduler/utils';
import { SchedulerProps } from './props';
import { DataAccessorType } from './types';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type SchedulerDataAccessorsType = Pick<
SchedulerProps,
'startDateExpr'
| 'endDateExpr'
| 'startDateTimeZoneExpr'
| 'endDateTimeZoneExpr'
| 'allDayExpr'
| 'textExpr'
| 'descriptionExpr'
| 'recurrenceRuleExpr'
| 'recurrenceExceptionExpr'
| 'forceIsoDateParsing'
| 'dateSerializationFormat'
>;

export const createDataAccessors = (
  instance: unknown,
  props: SchedulerDataAccessorsType,
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
