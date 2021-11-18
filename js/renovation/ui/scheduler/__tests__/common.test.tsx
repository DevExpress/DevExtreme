import {
  createDataAccessors, isViewDataProviderConfigValid,
} from '../common';
import { SchedulerProps } from '../props';

describe('Scheduler common', () => {
  describe('createDataAccessors', () => {
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
      resources: [{
        fieldExpr: 'testFieldExpr',
      }],
    };

    it('should return dataAccessors with correct field expressions', () => {
      const dataAccessors = createDataAccessors(props, true);

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

      expect(dataAccessors.resources?.getter)
        .toBeDefined();

      expect(dataAccessors.resources?.setter)
        .toBeDefined();
    });

    it('should return correct dataAccessors for resources', () => {
      const testData = { testFieldExpr: 'test-field' };
      const dataAccessors = createDataAccessors(props, true);

      expect(dataAccessors.resources?.getter.testFieldExpr(testData))
        .toEqual(testData.testFieldExpr);

      dataAccessors.resources?.setter.testFieldExpr(testData, 'changed-test-field');

      expect(dataAccessors.resources?.getter.testFieldExpr(testData))
        .toEqual('changed-test-field');
    });

    it('should return dataAccessors with correct getters if forceIsoDateParsing is true', () => {
      const dataAccessors = createDataAccessors(props, true);
      const testData = {
        testStartDateExpr: '2021-09-21T11:11:00.000Z',
        testEndDateExpr: '2021-09-21T12:11:00.000Z',
      };

      expect(dataAccessors.getter.startDate(testData))
        .toEqual(new Date('2021-09-21T11:11:00.000Z'));
      expect(dataAccessors.getter.endDate(testData))
        .toEqual(new Date('2021-09-21T12:11:00.000Z'));
    });

    it('should return dataAccessors with correct getters if forceIsoDateParsing is false', () => {
      const dataAccessors = createDataAccessors(props, false);
      const testData = {
        testStartDateExpr: '2021-09-21T11:11:00.000Z',
        testEndDateExpr: '2021-09-21T12:11:00.000Z',
      };

      expect(dataAccessors.getter.startDate(testData))
        .toEqual('2021-09-21T11:11:00.000Z');
      expect(dataAccessors.getter.endDate(testData))
        .toEqual('2021-09-21T12:11:00.000Z');
    });

    it('should return dataAccessors with correct setters if forceIsoDateParsing is true', () => {
      const dataAccessors = createDataAccessors(props, true);
      const testData = {
        testStartDateExpr: '2021-09-21T11:11:00.000Z',
        testEndDateExpr: '2021-09-21T12:11:00.000Z',
      };

      dataAccessors.setter.startDate(testData, new Date(2021, 9, 2, 18, 47));
      const newStartDate = dataAccessors.getter.startDate(testData) as Date;

      expect(newStartDate.toLocaleDateString())
        .toEqual(new Date('2021-10-02T15:00:00').toLocaleDateString());
    });

    it('should return dataAccessors with correct setters if forceIsoDateParsing is false', () => {
      const dataAccessors = createDataAccessors(props, false);
      const testData = {
        testStartDateExpr: '2021-09-21T11:11:00.000Z',
        testEndDateExpr: '2021-09-21T12:11:00.000Z',
      };

      dataAccessors.setter.startDate(testData, '2021-10-02T18:47:00.123Z');

      expect(dataAccessors.getter.startDate(testData))
        .toEqual('2021-10-02T18:47:00.123Z');
    });
  });

  describe('isViewDataProviderConfigValid', () => {
    it('should return false when view config is undefined', () => {
      expect(isViewDataProviderConfigValid(undefined, {} as any))
        .toBe(false);
    });

    it('should return true if configs are identical', () => {
      const config = {
        intervalCount: 1,
        currentDate: new Date(),
        type: 'day' as any,
        hoursInterval: 0.5,
        startDayHour: 0,
        endDayHour: 24,
        groupOrientation: undefined,
        groupByDate: false,
        crossScrollingEnabled: false,
        firstDayOfWeek: 0,
        startDate: undefined,
        showAllDayPanel: true,
        allDayPanelExpanded: true,
        scrolling: { mode: 'virtual' } as any,
        cellDuration: 30,
        groups: [],
      };
      expect(isViewDataProviderConfigValid(
        { ...config },
        { ...config },
      ))
        .toBe(true);
    });

    it('should return false if some of the confi props are not identical by reference', () => {
      const workSpaceConfig = {
        intervalCount: 1,
        currentDate: new Date(),
        type: 'day' as any,
        hoursInterval: 0.5,
        startDayHour: 0,
        endDayHour: 24,
        groupOrientation: undefined,
        groupByDate: false,
        crossScrollingEnabled: false,
        firstDayOfWeek: 0,
        startDate: undefined,
        showAllDayPanel: true,
        allDayPanelExpanded: true,
        scrolling: { mode: 'virtual' } as any,
        cellDuration: 30,
        groups: [],
      };
      const schedulerConfig = {
        intervalCount: 1,
        currentDate: new Date(),
        type: 'day' as any,
        hoursInterval: 0.5,
        startDayHour: 0,
        endDayHour: 24,
        groupOrientation: undefined,
        groupByDate: false,
        crossScrollingEnabled: false,
        firstDayOfWeek: 0,
        startDate: undefined,
        showAllDayPanel: true,
        allDayPanelExpanded: true,
        scrolling: { mode: 'virtual' } as any,
        cellDuration: 30,
        groups: [],
      };

      expect(isViewDataProviderConfigValid(
        workSpaceConfig,
        schedulerConfig,
      ))
        .toBe(false);
    });

    it('should return true if configs are not identical by value', () => {
      const config = {
        intervalCount: 1,
        currentDate: new Date(),
        type: 'day' as any,
        hoursInterval: 0.5,
        startDayHour: 0,
        endDayHour: 24,
        groupOrientation: undefined,
        groupByDate: false,
        crossScrollingEnabled: false,
        firstDayOfWeek: 0,
        startDate: undefined,
        showAllDayPanel: true,
        allDayPanelExpanded: true,
        scrolling: { mode: 'virtual' } as any,
        cellDuration: 30,
        groups: [],
      };
      expect(isViewDataProviderConfigValid(
        { ...config },
        { ...config, type: 'week' },
      ))
        .toBe(false);
    });
  });
});
