import { createDataAccessors } from '../common';
import { SchedulerProps } from '../props';

describe('Scheduler common', () => {
  describe('createDataAccessors', () => {
    it('should create correct dataAccessors', () => {
      const testData = {
        testStartDateExpr: '2021-09-21T11:11:00',
        testEndDateExpr: '2021-09-21T12:11:00',
      };
      const props = {
        ...new SchedulerProps(),
        startDateExpr: 'testStartDateExpr',
        endDateExpr: 'testEndDateExpr',
        startDateTimeZoneExpr: 'test-startDateTimeZoneExpr-expr',
        endDateTimeZoneExpr: 'test-endDateTimeZoneExpr-expr',
        allDayExpr: 'test-allDay-expr',
        textExpr: 'test-text-expr',
        descriptionExpr: 'test-description-expr',
        recurrenceRuleExpr: 'test-recurrenceRule-expr',
        recurrenceExceptionExpr: 'test-recurrenceException-expr',
        dateSerializationFormat: '',
        forceIsoDateParsing: true,
      };
      const dataAccessors = createDataAccessors(
        props,
      );

      const startDate = dataAccessors.getter.startDate(testData);
      const endDate = dataAccessors.getter.endDate(testData);

      expect(startDate)
        .toEqual('2021-09-21T11:11:00');

      expect(endDate)
        .toEqual('2021-09-21T12:11:00');

      expect(dataAccessors.expr)
        .toEqual({
          allDayExpr: 'test-allDay-expr',
          descriptionExpr: 'test-description-expr',
          endDateExpr: 'testEndDateExpr',
          endDateTimeZoneExpr: 'test-endDateTimeZoneExpr-expr',
          recurrenceExceptionExpr: 'test-recurrenceException-expr',
          recurrenceRuleExpr: 'test-recurrenceRule-expr',
          startDateExpr: 'testStartDateExpr',
          startDateTimeZoneExpr: 'test-startDateTimeZoneExpr-expr',
          textExpr: 'test-text-expr',
        });
    });
  });
});
