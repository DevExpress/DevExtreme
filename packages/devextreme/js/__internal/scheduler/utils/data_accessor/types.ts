export interface IFieldExpr extends Record<string, string> {
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

export type DataAccessorGetter<T> = (obj: T) => unknown;
export type DataAccessorSetter<T> = (obj: T, value: unknown) => void;
