import { AppointmentDataAccessor } from '__internal/scheduler/utils/data_accessor/appointment_data_accessor';

export const mockDataAccessor = new AppointmentDataAccessor({
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
}, true);
