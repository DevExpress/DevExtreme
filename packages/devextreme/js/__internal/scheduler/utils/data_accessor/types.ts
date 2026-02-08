export interface IFieldExpr {
  startDateExpr: string;
  endDateExpr: string;
  startDateTimeZoneExpr: string;
  endDateTimeZoneExpr: string;
  allDayExpr: string;
  textExpr: string;
  descriptionExpr: string;
  recurrenceRuleExpr: string;
  recurrenceExceptionExpr: string;
  disabledExpr: string;
  visibleExpr: string;
}

export type DataAccessorGetter<T, D = unknown> = (obj: T) => D;
export type DataAccessorSetter<T, D = unknown> = (obj: T, value: D) => void;
