import {
  describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';
import { DataSource } from '@ts/data/data_source/m_data_source';

import { createScheduler } from '../__tests__/__mock__/create_scheduler';

const currentDate = new Date(2015, 1, 9, 1, 0);
const recurrenceRuleFilter = ['recurrenceRule', 'startswith', 'freq'];

describe('data processor', () => {
  describe('Server side filtering', () => {
    it('Appointment filterByDate should filter dataSource', async () => {
      const data = [
        {
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 1, 0),
          endDate: new Date(2015, 1, 9, 2, 0),
        },
        {
          text: 'Appointment 2',
          startDate: new Date(2015, 1, 10, 11, 0),
          endDate: new Date(2015, 1, 10, 13, 0),
        },
      ];

      const dataSource = new DataSource({
        store: data,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 10, 10),
        new Date(2015, 1, 10, 13),
        true,
        undefined,
      );

      dataSource.load();

      expect(dataSource.items()).toEqual([data[1]]);
    });

    it('Appointment filterByDate should filter dataSource correctly after changing user filter', async () => {
      const data = [
        {
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 1, 0),
          endDate: new Date(2015, 1, 9, 2, 0),
        },
        {
          text: 'Appointment 2',
          startDate: new Date(2015, 1, 10, 11, 0),
          endDate: new Date(2015, 1, 10, 13, 0),
        },
      ];
      const dataSource = new DataSource({
        store: data,
        filter: ['text', '=', 'Appointment 2'],
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
      });
      const dateFilter = [
        [
          ['endDate', '>=', new Date(2015, 1, 9, 0)],
          ['startDate', '<', new Date(2015, 1, 11)],
        ],
        'or',
        recurrenceRuleFilter,
        'or',
        [
          ['endDate', new Date(2015, 1, 9)],
          ['startDate', new Date(2015, 1, 9)],
        ],
      ];

      scheduler.setRemoteFilter(
        new Date(2015, 1, 9, 0),
        new Date(2015, 1, 10, 13),
        true,
        undefined,
      );

      let expectedFilter = [dateFilter, [
        'text',
        '=',
        'Appointment 2',
      ]];
      let actualFilter = dataSource.filter();
      expect(expectedFilter).toEqual(actualFilter);

      const changedDataSource = new DataSource({
        store: data,
      });
      scheduler.option('dataSource', changedDataSource);
      scheduler.setRemoteFilter(
        new Date(2015, 1, 9, 0),
        new Date(2015, 1, 10, 13),
        true,
        undefined,
      );

      expectedFilter = [dateFilter];
      actualFilter = changedDataSource.filter();
      expect(actualFilter).toEqual(expectedFilter);
    });

    it('Appointment should clear the internal user filter after dataSource has been filtered (T866593)', async () => {
      const appointments = [
        {
          text: 'a', StartDate: new Date(2015, 0, 1, 1), EndDate: new Date(2015, 0, 1, 2), priorityId: 2,
        },
        {
          text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1,
        },
        {
          text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1,
        },
      ];

      const dataSource = new DataSource({
        store: appointments,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
        startDateTimeZoneExpr: 'StartDateTimeZone',
        endDateTimeZoneExpr: 'EndDateTimeZone',
      });

      scheduler.setRemoteFilter(
        new Date(2015, 0, 1, 1),
        new Date(2015, 0, 2),
      );

      dataSource.load().done(() => {
        dataSource.filter('priorityId', '=', 1);

        scheduler.setRemoteFilter(
          new Date(2015, 0, 1, 1),
          new Date(2015, 0, 2),
          true,
        );

        expect(dataSource.filter().length).toBe(2);
        expect(dataSource.filter()[1]).toEqual(['priorityId', '=', 1]);

        dataSource.filter(null);

        scheduler.setRemoteFilter(
          new Date(2015, 0, 1, 1),
          new Date(2015, 0, 2),
          true,
        );

        expect(dataSource.filter().length).toBe(1);
      });
    });

    it('Appointment filterByDate should filter dataSource correctly without copying dateFilter', async () => {
      const dateFilter = [
        [
          ['endDate', '>=', new Date(2015, 1, 9, 0)],
          ['startDate', '<', new Date(2015, 1, 11)],
        ],
        'or',
        [
          ['endDate', new Date(2015, 1, 9)],
          ['startDate', new Date(2015, 1, 9)],
        ],
      ];

      const dataSource = new DataSource({
        store: [],
        filter: [dateFilter, ['text', '=', 'Appointment 2']],
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 9, 0),
        new Date(2015, 1, 10, 13),
        true,
      );

      const expectedFilter = [
        [[
          ['endDate', '>=', new Date(2015, 1, 9, 0)],
          ['startDate', '<', new Date(2015, 1, 11, 0)],
        ],
        'or',
        recurrenceRuleFilter,
        'or',
        [
          ['endDate', new Date(2015, 1, 9)],
          ['startDate', new Date(2015, 1, 9)],
        ]],
        [dateFilter, ['text', '=', 'Appointment 2']],
      ];

      const actualFilter = dataSource.filter();

      expect(expectedFilter).toEqual(actualFilter);
    });

    it('Appointment filterByDate should return filter with dateSerializationFormat and without forceIsoDateParsing', async () => {
      const defaultForceIsoDateParsing = config().forceIsoDateParsing;
      config().forceIsoDateParsing = false;
      try {
        const dataSource = new DataSource({
          store: [
            {
              text: 'Appointment 1',
              startDate: new Date(2015, 1, 9, 1, 0),
              endDate: new Date(2015, 1, 9, 2, 0),
            },
            {
              text: 'Appointment 2',
              startDate: new Date(2015, 1, 10, 11, 0),
              endDate: new Date(2015, 1, 10, 13, 0),
            },
          ],
        });
        const { scheduler } = await createScheduler({
          dataSource,
          currentView: 'week',
          currentDate,
        });

        scheduler.setRemoteFilter(
          new Date(2015, 1, 10, 10),
          new Date(2015, 1, 10, 13),
          true,
          'yyyy-MM-ddTHH:mm:ss',
        );

        const expectedFilter = [[
          [
            ['endDate', '>=', new Date(2015, 1, 10)],
            ['startDate', '<', new Date(2015, 1, 11)],
          ],
          'or',
          recurrenceRuleFilter,
          'or',
          [
            ['endDate', new Date(2015, 1, 10)],
            ['startDate', new Date(2015, 1, 10)],
          ],
        ]];
        const actualFilter = dataSource.filter();
        expect(actualFilter).toEqual(expectedFilter);
      } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
      }
    });

    it('Appointment filterByDate should return filter with dateSerializationFormat and forceIsoDateParsing', async () => {
      const defaultForceIsoDateParsing = config().forceIsoDateParsing;
      config().forceIsoDateParsing = true;
      try {
        const dataSource = new DataSource({
          store: [
            {
              text: 'Appointment 1',
              startDate: new Date(2015, 1, 9, 1, 0),
              endDate: new Date(2015, 1, 9, 2, 0),
            },
            {
              text: 'Appointment 2',
              startDate: new Date(2015, 1, 10, 11, 0),
              endDate: new Date(2015, 1, 10, 13, 0),
            },
          ],
        });
        const { scheduler } = await createScheduler({
          dataSource,
          currentView: 'week',
          currentDate,
        });

        scheduler.setRemoteFilter(
          new Date(2015, 1, 10, 10),
          new Date(2015, 1, 10, 13),
          true,
          'yyyy-MM-ddTHH:mm:ss',
        );

        const expectedFilter = [[
          [
            ['endDate', '>=', '2015-02-10T00:00:00'],
            ['startDate', '<', '2015-02-11T00:00:00'],
          ],
          'or',
          recurrenceRuleFilter,
          'or',
          [
            ['endDate', '2015-02-10T00:00:00'],
            ['startDate', '2015-02-10T00:00:00'],
          ],
        ]];
        const actualFilter = dataSource.filter();
        expect(actualFilter).toEqual(expectedFilter);
      } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
      }
    });

    it('Start date of appt lower than first filter date & end appt date higher than second filter date', async () => {
      const data = [{
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 1, 0),
        endDate: new Date(2015, 1, 9, 2, 0),
      },
      {
        text: 'Appointment 2',
        startDate: new Date(2015, 1, 10, 11, 0),
        endDate: new Date(2015, 1, 10, 13, 0),
      }];

      const dataSource = new DataSource({
        store: data,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 10, 11, 5),
        new Date(2015, 1, 10, 11, 45),
        true,
      );
      dataSource.load();

      expect(dataSource.items()).toEqual([data[1]]);
    });

    it('Appointment should be filtered correctly by custom startDate field', async () => {
      const dataSource = new DataSource({
        store: [{
          text: 'Appointment 1',
          Start: new Date(2015, 1, 12, 5),
          End: new Date(2015, 1, 12, 5, 30),
        }],
      });

      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 9),
        new Date(2015, 1, 20),
      );
      dataSource.load();

      expect(dataSource.items().length).toBe(1);
    });

    it('AllDay appointment should not be filtered by min date in range', async () => {
      const tasks = [{
        text: 'Appointment 2',
        startDate: new Date(2015, 1, 10, 11, 0),
        endDate: new Date(2015, 1, 10, 11, 30),
        AllDay: true,
      }];

      const dataSource = new DataSource({
        store: tasks,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
        allDayExpr: 'AllDay',
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 10, 12),
        new Date(2015, 1, 11),
        true,
      );
      dataSource.load();

      expect(dataSource.items()).toEqual([tasks[0]]);
    });

    it('AllDay appointment should be filtered when its endDate is equal to filter min', async () => {
      const tasks = [{
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 10),
        endDate: new Date(2015, 1, 11),
        allDay: true,
      }];
      const dataSource = new DataSource({
        store: tasks,
      });

      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 11),
        new Date(2015, 1, 11, 11),
        true,
      );
      dataSource.load();

      expect(dataSource.items().length).toBe(1);
    });

    it('Appointment filterByDate should correctly filter items with recurrenceRule, if recurrenceRuleExpr!=null', async () => {
      const recurrentAppts = [
        {
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 1, 0),
          endDate: new Date(2015, 1, 9, 2, 0),
          _recurrenceRule: 'FREQ=DAILY',
        },
        {
          text: 'Appointment 2',
          startDate: new Date(2015, 1, 10, 11, 0),
          endDate: new Date(2015, 1, 10, 13, 0),
        },
      ];

      const dataSource = new DataSource({
        store: recurrentAppts,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
        recurrenceRuleExpr: '_recurrenceRule',
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 10),
        new Date(2015, 1, 10, 13),
        true,
      );
      dataSource.load();

      expect(dataSource.items()).toEqual(recurrentAppts);
    });

    it('Appointment filterByDate should ignore items with recurrenceRule, if recurrenceRuleExpr=null', async () => {
      const appts = [
        {
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 1, 0),
          endDate: new Date(2015, 1, 9, 2, 0),
          recurrenceRule: 'FREQ=DAILY',
        },
        {
          text: 'Appointment 2',
          startDate: new Date(2015, 1, 10, 11, 0),
          endDate: new Date(2015, 1, 10, 13, 0),
        }];

      const dataSource = new DataSource({
        store: appts,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
        recurrenceRuleExpr: null,
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 10),
        new Date(2015, 1, 10, 13),
        true,
      );
      dataSource.load();

      expect(dataSource.items()).toEqual([appts[1]]);
      expect(dataSource.filter()[0].length).toBe(3);
    });

    it('Appointment filterByDate should ignore items with recurrenceRule, if recurrenceRuleExpr=""', async () => {
      const appts = [
        {
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 1, 0),
          endDate: new Date(2015, 1, 9, 2, 0),
          _recurrenceRule: 'FREQ=DAILY',
        },
        {
          text: 'Appointment 2',
          startDate: new Date(2015, 1, 10, 11, 0),
          endDate: new Date(2015, 1, 10, 13, 0),
        }];

      const dataSource = new DataSource({
        store: appts,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
        recurrenceRuleExpr: '',
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 10),
        new Date(2015, 1, 10, 13),
        true,
      );
      dataSource.load();

      expect(dataSource.items()).toEqual([appts[1]]);
      expect(dataSource.filter()[0].length).toBe(3);
    });

    it('Appointment should be loaded if date range equals to 24 hours', async () => {
      const appts = [{
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 1, 0),
        endDate: new Date(2015, 1, 9, 2, 0),
      }];

      const dataSource = new DataSource({
        store: appts,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate,
        recurrenceRuleExpr: '',
      });

      scheduler.setRemoteFilter(
        new Date(2015, 1, 9, 0),
        new Date(2015, 1, 9, 23, 59),
      );
      dataSource.load();

      expect(dataSource.items()).toEqual([appts[0]]);
    });

    it('Scheduler filter expression must be saved, after a user override the filter', async () => {
      const appointments = [
        {
          text: 'a', StartDate: new Date(2015, 0, 1, 1), EndDate: new Date(2015, 0, 1, 2), priorityId: 2,
        },
        {
          text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1,
        },
        {
          text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1,
        },
      ];

      const dataSource = new DataSource({
        store: appointments,
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate: appointments[1].StartDate,
        startDayHour: 3,
        endDayHour: 7,
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.setRemoteFilter(
        new Date(2015, 0, 1, 0),
        new Date(2015, 0, 3),
      );
      dataSource.load();

      dataSource.filter('priorityId', '=', 1);
      dataSource.load();

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([{
        text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6), priorityId: 1,
      }]);
    });

    it('User filter must be constantly overwritten', async () => {
      const appointments = [
        {
          text: 'a', StartDate: new Date(2014, 11, 29, 1), EndDate: new Date(2014, 11, 29, 2), priorityId: 2,
        },
        {
          text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1,
        },
        {
          text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1,
        },
      ];

      const dataSource = new DataSource({
        store: appointments,
        filter: ['priorityId', '=', 1],
      });
      const { scheduler } = await createScheduler({
        dataSource,
        currentView: 'week',
        currentDate: appointments[0].StartDate,
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.setRemoteFilter(
        new Date(2015, 0, 1, 0),
        new Date(2015, 0, 3),
        true,
      );
      dataSource.load();

      const existingFilter = dataSource.filter();
      const newUserFilter = ['priorityId', '=', 2];

      existingFilter[1] = newUserFilter;
      dataSource.filter(existingFilter);
      scheduler.setRemoteFilter(
        new Date(2014, 11, 29, 0),
        new Date(2014, 11, 30),
        true,
      );
      dataSource.load();

      expect(dataSource.items()).toEqual([{
        text: 'a', StartDate: new Date(2014, 11, 29, 1), EndDate: new Date(2014, 11, 29, 2), priorityId: 2,
      }]);
    });
  });

  describe('Client side after filtering', () => {
    it('Loaded appointments should be filtered by start & end day hours', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 3,
        endDayHour: 7,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 0, 1, 1),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.appointmentDataSource.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
      scheduler.appointmentDataSource.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6, 0).toString() });
      scheduler.appointmentDataSource.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() }]);
    });

    it('Loaded appointments on the borders should be filtered by start & end day hours', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 3,
        endDayHour: 7,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 0, 1, 1),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.appointmentDataSource.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 3).toString() });
      scheduler.appointmentDataSource.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 45).toString(), EndDate: new Date(2015, 0, 1, 3, 50).toString() });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 45).toString(), EndDate: new Date(2015, 0, 1, 3, 50).toString() }]);
    });

    it('Loaded appointments should be filtered by shifted start & end day hours', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 3,
        endDayHour: 7,
        offset: 30,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 0, 1, 1),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.appointmentDataSource.add({ text: 'a', StartDate: new Date(2015, 0, 1, 3).toString(), EndDate: new Date(2015, 0, 1, 3, 10).toString() });
      scheduler.appointmentDataSource.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 40).toString(), EndDate: new Date(2015, 0, 1, 7, 20).toString() });
      scheduler.appointmentDataSource.add({ text: 'c', StartDate: new Date(2015, 0, 1, 7, 35).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 40).toString(), EndDate: new Date(2015, 0, 1, 7, 20).toString() }]);
    });

    it('Loaded appointments should be filtered by recurrence rule', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 3,
        endDayHour: 7,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 0, 1, 1),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecRule',
        recurrenceExceptionExpr: 'RecException',
      });

      scheduler.appointmentDataSource.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
      scheduler.appointmentDataSource.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() });
      scheduler.appointmentDataSource.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
      scheduler.appointmentDataSource.add({
        text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=WE',
      });
      scheduler.appointmentDataSource.add({
        text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), RecRule: 'FREQ=WEEKLY,BYDAY=TH',
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([
        { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
        {
          text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=WE',
        },
      ]);
    });

    it('Loaded appointments should be filtered by recurrence rule correctly, if appointment startDate.getHours < starDayHour', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 3,
        endDayHour: 7,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 0, 5, 2, 0),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecRule',
        recurrenceExceptionExpr: 'RecException',
      });

      scheduler.appointmentDataSource.add({
        text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO',
      });
      scheduler.appointmentDataSource.add({
        text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO',
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([
        {
          text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO',
        },
        {
          text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO',
        },
      ]);
    });

    it('Loaded appointments should be filtered by recurrence rule correctly for day interval', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 3,
        endDayHour: 7,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 0, 5, 2, 0),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecRule',
        recurrenceExceptionExpr: 'RecException',
      });

      scheduler.appointmentDataSource.add({
        text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO',
      });
      scheduler.appointmentDataSource.add({
        text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO',
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([
        {
          text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO',
        },
        {
          text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO',
        },
      ]);
    });

    it('Loaded appointments should be filtered by resources', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 2,
        endDayHour: 5,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 2, 16, 2),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecRule',
        recurrenceExceptionExpr: 'RecException',
        groups: ['ownerId', 'roomId'],
        resources: [
          {
            fieldExpr: 'ownerId',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }],
          },
          {
            fieldExpr: 'roomId',
            dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }],
          },
        ],
      });

      scheduler.appointmentDataSource.add({
        text: 'a', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: [1, 2],
      });
      scheduler.appointmentDataSource.add({
        text: 'b', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2], managerId: 4,
      });
      scheduler.appointmentDataSource.add({
        text: 'c', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 3, roomId: [1, 2],
      });
      scheduler.appointmentDataSource.add({
        text: 'd', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2, 3],
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toHaveLength(4);
      expect([appts[0], appts[2]]).toEqual([
        {
          text: 'b', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2], managerId: 4,
        },
        {
          text: 'd', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2, 3],
        },
      ]);
    });

    it('Loaded appointments should be filtered by allDay field', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 3,
        endDayHour: 7,
        dataSource,
        showAllDayPanel: false,
        currentView: 'week',
        currentDate: new Date(2015, 0, 1, 4),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.appointmentDataSource.add({
        text: 'a', StartDate: new Date(2015, 0, 1, 4).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: true,
      });
      scheduler.appointmentDataSource.add({
        text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: false,
      });
      scheduler.appointmentDataSource.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
      scheduler.appointmentDataSource.add({ text: 'd', StartDate: new Date(2015, 0, 1, 4).toString(), EndDate: new Date(2015, 0, 3, 6).toString() });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([{
        text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: false,
      }]);
    });

    it('Loaded recurrent allDay appointments should not be filtered by start/endDayHour', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 3,
        endDayHour: 10,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 0, 1),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      const appointment = {
        text: 'a',
        StartDate: new Date(2015, 0, 1).toString(),
        EndDate: new Date(2015, 0, 2).toString(),
        AllDay: true,
        RecurrenceRule: 'FREQ=DAILY',
      };
      scheduler.appointmentDataSource.add(appointment);

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems;

      expect(appts).toHaveLength(3);
      expect(appts[0].itemData).toEqual(appointment);
    });

    [
      { visible: true, expectedVisibility: true },
      { visible: false, expectedVisibility: false },
      { visible: null, expectedVisibility: true },
      { visible: undefined, expectedVisibility: true },
    ].forEach(({ visible, expectedVisibility }) => {
      it(`Appointment should be correctly filtered by visible state if visible=${visible}`, async () => {
        const dataSource = new DataSource({ store: [] });
        const { scheduler } = await createScheduler({
          startDayHour: 3,
          endDayHour: 10,
          dataSource,
          currentView: 'week',
          currentDate: new Date(2015, 0, 1),
          startDateExpr: 'StartDate',
          endDateExpr: 'EndDate',
          allDayExpr: 'AllDay',
          recurrenceRuleExpr: 'RecurrenceRule',
          recurrenceExceptionExpr: 'Exception',
        });

        const appointment = {
          text: 'a',
          StartDate: new Date(2015, 0, 1).toString(),
          EndDate: new Date(2015, 0, 2).toString(),
          AllDay: true,
          RecurrenceRule: 'FREQ=DAILY',
          visible,
        };
        scheduler.appointmentDataSource.add(appointment);
        scheduler.repaint();

        const appts = scheduler._layoutManager.filteredItems;

        if (expectedVisibility) {
          expect(appts).toHaveLength(3);
          expect(appts[0].itemData).toEqual(appointment);
        } else {
          expect(appts).toHaveLength(0);
        }
      });
    });

    it('Appointment should be filtered if startDate, endDate are at the edge of the trimmed end view date', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 0,
        endDayHour: 24,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 0, 1),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.appointmentDataSource.add({
        text: 'a',
        startDate: new Date(2020, 6, 16, 0),
        endDate: new Date(2020, 6, 16, 1),
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts.length).toBe(0);
    });

    it('The part of long appointment should be filtered by start/endDayHour, with endDate < startDayHour(T339519)', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 1,
        endDayHour: 10,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 1, 28),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.appointmentDataSource.add({
        text: 'a',
        StartDate: new Date(2015, 2, 1, 10, 30),
        EndDate: new Date(2015, 2, 2, 5, 0),
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([]);
    });

    it('The part of long appointment should be filtered by start/endDayHour, with startDate < startDayHour(T339519)', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 1,
        endDayHour: 10,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 1, 28),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.appointmentDataSource.add({
        text: 'a',
        StartDate: new Date(2015, 2, 1, 7, 0),
        EndDate: new Date(2015, 2, 2, 0, 30),
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([]);
    });

    it('Appointment between days should be filtered by start/endDayHour (T339519)', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 1,
        endDayHour: 10,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 1, 28),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.appointmentDataSource.add({
        text: 'a',
        StartDate: new Date(2015, 2, 1, 11, 0),
        EndDate: new Date(2015, 2, 2, 1, 0),
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts).toEqual([]);
    });

    it('Wrong endDate of appointment should be replaced before filtering', async () => {
      const dataSource = new DataSource({ store: [] });
      const { scheduler } = await createScheduler({
        startDayHour: 0,
        endDayHour: 24,
        dataSource,
        currentView: 'week',
        currentDate: new Date(2015, 2, 1),
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
        cellDuration: 60,
      });

      scheduler.appointmentDataSource.add({
        text: 'a',
        StartDate: new Date(2015, 2, 1, 11, 0),
        EndDate: new Date(2015, 2, 1, 1, 0),
      });

      scheduler.repaint();
      const appts = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(appts[0].EndDate).toEqual(new Date(2015, 2, 1, 12, 0));
    });
  });

  describe('API', () => {
    [
      {
        item: {
          text: 'all day appointment',
          StartDate: new Date(2015, 2, 1, 11, 0),
          AllDay123: true,
        },
        expected: true,
      },
      {
        item: {
          text: 'not all day appointment',
          StartDate: new Date(2015, 2, 1, 11, 0),
        },
        expected: false,
      },
      {
        item: {
          text: 'not all day appointment',
          StartDate: new Date(2015, 2, 1, 11, 0),
          allDay: true,
        },
        expected: false,
      },
    ].forEach(({ item, expected }) => {
      it(`hasAllDayAppointments() should return correct result if all day is ${expected}`, async () => {
        const dataSource = new DataSource({ store: [] });
        const { scheduler } = await createScheduler({
          dataSource,
          currentView: 'week',
          currentDate: item.StartDate,
          startDateExpr: 'StartDate',
          endDateExpr: 'EndDate',
          allDayExpr: 'AllDay123',
          cellDuration: 60,
        });

        scheduler.appointmentDataSource.add(item);

        const result = scheduler._layoutManager.hasAllDayAppointments();

        expect(result).toBe(expected);
      });
    });
  });

  describe('Virtual Scrolling', () => {
    it('Appointment model should take into account startDayHour, endDayHour of the current view', async () => {
      const appointments = [
        {
          text: 'a',
          StartDate: new Date(2021, 8, 6, 9, 30),
          EndDate: new Date(2021, 8, 6, 11, 30),
        },
      ];

      const dataSource = new DataSource({
        store: appointments,
      });
      const { scheduler } = await createScheduler({
        startDayHour: 9,
        endDayHour: 18,
        viewOffset: 0,
        showAllDayPanel: false,
        dataSource,
        currentView: 'week',
        currentDate: appointments[0].StartDate,
        startDateExpr: 'StartDate',
        endDateExpr: 'EndDate',
        allDayExpr: 'AllDay',
        recurrenceRuleExpr: 'RecurrenceRule',
        recurrenceExceptionExpr: 'Exception',
      });

      scheduler.setRemoteFilter(
        new Date(2021, 8, 6, 9),
        new Date(2021, 8, 6, 12),
      );
      dataSource.load();
      scheduler.repaint();

      const result = scheduler._layoutManager.filteredItems.map((item) => item.itemData);

      expect(result).toEqual(appointments);
    });
  });
});
