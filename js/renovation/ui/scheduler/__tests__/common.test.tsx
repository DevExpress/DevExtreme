import { compileGetter, compileSetter } from '../../../../core/utils/data';
import ViewDataProvider from '../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import {
  createDataAccessors, createTimeZoneCalculator, filterAppointments,
} from '../common';
import { getAppointmentsConfig } from '../model/appointments';
import { AppointmentsConfigType } from '../model/types';
import { SchedulerProps } from '../props';
import { TimeZoneCalculator } from '../timeZoneCalculator/utils';
import { DataAccessorType, ViewType } from '../types';
import { prepareGenerationOptions } from '../workspaces/base/work_space';
import { getViewRenderConfigByType } from '../workspaces/base/work_space_config';
import { WorkSpaceProps } from '../workspaces/props';
import { CellsMetaData, ViewDataProviderType } from '../workspaces/types';
import type { Appointment } from '../../../../ui/scheduler';

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

  describe('filterAppointments', () => {
    const defaultDataAccessors: DataAccessorType = {
      getter: {
        startDate: compileGetter('startDate') as any,
        endDate: compileGetter('endDate') as any,
      },
      setter: {
        startDate: compileSetter('startDate') as any,
        endDate: compileSetter('endDate') as any,
      },
      expr: {
        startDateExpr: 'startDate',
        endDateExpr: 'endDate',
      },
    };

    const prepareInstances = (
      viewType: ViewType,
      currentDate: Date,
      intervalCount: number,
    ): {
      appointmentsConfig: AppointmentsConfigType;
      timeZoneCalculator: TimeZoneCalculator;
      viewDataProvider: ViewDataProviderType;
      DOMMetaData: CellsMetaData;
    } => {
      const schedulerProps = new SchedulerProps();
      schedulerProps.currentDate = currentDate;
      const workspaceProps = new WorkSpaceProps();
      workspaceProps.type = viewType;
      workspaceProps.intervalCount = intervalCount;
      workspaceProps.currentDate = currentDate;
      workspaceProps.startDate = currentDate;

      // TODO: convert ViewdataProvider to TS
      const viewDataProvider = (new ViewDataProvider('week') as unknown) as ViewDataProviderType;
      const viewRenderConfig = getViewRenderConfigByType(
        workspaceProps.type,
        workspaceProps.crossScrollingEnabled,
        workspaceProps.intervalCount,
        workspaceProps.groupOrientation === 'vertical',
      );
      const generationOptions = prepareGenerationOptions(
        workspaceProps,
        viewRenderConfig,
        false,
      );
      viewDataProvider.update(generationOptions, true);
      const DOMMetaData = {
        allDayPanelCellsMeta: [],
        dateTableCellsMeta: [
          [],
          [{
            left: 0, top: 0, width: 100, height: 200,
          }],
          [], [], [], [], [], [], [], [], [],
          [], [], [], [], [], [], [], [], [],
          [ // Row #20
            { }, { }, { }, { },
            { // Cell #4
              left: 100, top: 200, width: 50, height: 60,
            },
          ],
          [],
          [ // Row #22
            { }, { }, { }, { }, { },
            { // Cell #5
              left: 100, top: 300, width: 50, height: 60,
            },
          ],
        ],
      };

      const appointmentsConfig = getAppointmentsConfig(
        schedulerProps,
        workspaceProps,
        [],
        viewDataProvider,
        true,
      );

      const timeZoneCalculator = createTimeZoneCalculator('');

      return {
        timeZoneCalculator,
        viewDataProvider,
        appointmentsConfig,
        DOMMetaData: DOMMetaData as any,
      };
    };

    it('should filtered appointments correctly', () => {
      const instances = prepareInstances(
        'day',
        new Date(2021, 8, 24),
        1,
      );

      const dataItems = [{
        startDate: new Date(2021, 8, 23, 10),
        endDate: new Date(2021, 8, 23, 11),
      }, {
        startDate: new Date(2021, 8, 24, 11),
        endDate: new Date(2021, 8, 24, 12),
      }];

      const filteredItems = filterAppointments(
        instances.appointmentsConfig,
        dataItems as Appointment[],
        defaultDataAccessors,
        instances.timeZoneCalculator,
        instances.appointmentsConfig.loadedResources,
        instances.viewDataProvider,
      );

      expect(filteredItems)
        .toMatchObject([{
          startDate: new Date(2021, 8, 24, 11),
          endDate: new Date(2021, 8, 24, 12),
        }]);
    });

    it('should filtered appointments correctly if virtual scrolling', () => {
      const instances = prepareInstances(
        'day',
        new Date(2021, 8, 24),
        1,
      );

      const dataItems = [{
        startDate: new Date(2021, 8, 23, 10),
        endDate: new Date(2021, 8, 23, 11),
      }, {
        startDate: new Date(2021, 8, 24, 11),
        endDate: new Date(2021, 8, 24, 12),
      }];

      instances.appointmentsConfig.isVirtualScrolling = true;

      const filteredItems = filterAppointments(
        instances.appointmentsConfig,
        dataItems as Appointment[],
        defaultDataAccessors,
        instances.timeZoneCalculator,
        instances.appointmentsConfig.loadedResources,
        instances.viewDataProvider,
      );

      expect(filteredItems)
        .toHaveLength(0);
    });

    it('should return empty array if appointmentsConfig is not exists', () => {
      const instances = prepareInstances(
        'day',
        new Date(2021, 8, 24),
        1,
      );

      const dataItems = [{
        startDate: new Date(2021, 8, 23, 10),
        endDate: new Date(2021, 8, 23, 11),
      }, {
        startDate: new Date(2021, 8, 24, 11),
        endDate: new Date(2021, 8, 24, 12),
      }];

      const filteredItems = filterAppointments(
        undefined,
        dataItems as Appointment[],
        defaultDataAccessors,
        instances.timeZoneCalculator,
        instances.appointmentsConfig.loadedResources,
        instances.viewDataProvider,
      );

      expect(filteredItems)
        .toHaveLength(0);
    });
  });
});
