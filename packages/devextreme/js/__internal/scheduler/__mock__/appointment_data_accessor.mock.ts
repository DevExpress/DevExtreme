import { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import type { IFieldExpr } from '../utils/data_accessor/types';

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

export const mockUppercaseFieldExpressions: IFieldExpr = {
  startDateExpr: 'StartDate',
  endDateExpr: 'EndDate',
  startDateTimeZoneExpr: 'StartDateTimeZone',
  endDateTimeZoneExpr: 'EndDateTimeZone',
  allDayExpr: 'AllDay',
  textExpr: 'Text',
  descriptionExpr: 'Description',
  recurrenceRuleExpr: 'RecurrenceRule',
  recurrenceExceptionExpr: 'RecurrenceException',
  disabledExpr: 'Disabled',
  visibleExpr: 'Visible',
};

export const mockAppointmentDataAccessor = new AppointmentDataAccessor(mockFieldExpressions, true);
