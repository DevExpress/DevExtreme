import { AppointmentDataAccessor, type IFieldExpr } from '../utils';

export const mockFieldExpressions: IFieldExpr = {
  startDateExpr: 'startDate',
  endDateExpr: 'endDate',
  startDateTimeZoneExpr: 'startDateTimeZone',
  endDateTimeZoneExpr: 'endDateTimeZone',
  allDayExpr: 'allDay',
  textExpr: 'text',
  descriptionExpr: 'description',
  recurrenceRuleExpr: 'recurrenceRule',
  recurrenceExceptionExpr: 'recurrenceException',
  disabledExpr: 'disabled',
  visibleExpr: 'visible',
};

export const mockAppointmentDataAccessor = new AppointmentDataAccessor(mockFieldExpressions, true);
