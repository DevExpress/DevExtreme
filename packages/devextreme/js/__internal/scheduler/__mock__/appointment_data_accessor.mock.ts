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

export const mockAppointmentDataAccessor = new AppointmentDataAccessor(mockFieldExpressions, true);
