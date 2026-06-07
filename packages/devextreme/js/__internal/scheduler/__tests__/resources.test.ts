import {
  describe, expect, it,
} from '@jest/globals';
import { DataSource } from '@ts/data/data_source/m_data_source';
import CustomStore from '@ts/data/m_custom_store';
import { createScheduler } from '@ts/scheduler/__tests__/__mock__/create_scheduler';

import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const dataSource = [
  {
    startDate: new Date(2024, 8, 7, 0, 0),
    endDate: new Date(2024, 8, 7, 8, 0),
    roomId: 1,
    priorityId: 1,
    text: 'Install New Database',
  },
];
const rooms = [
  { id: 1, text: 'Room 2', color: 'rgb(142, 205, 60)' },
];
const rooms2 = [
  { id: 1, text: 'Room 2', color: 'rgb(60, 154, 205)' },
];

describe('Resources', () => {
  describe.each([
    'month',
    'agenda',
  ])('%s view', (view) => {
    it('should render correct appointment color for remote datasource (T1300252)', async () => {
      setupSchedulerTestEnvironment();

      const dataPromise = new Promise((resolve) => {
        setTimeout(resolve, 100, rooms);
      });
      const { POM } = await createScheduler({
        views: [view],
        currentView: view,
        currentDate: new Date(2024, 8, 7),
        dataSource,
        resources: [{
          fieldExpr: 'roomId',
          label: 'Room',
          dataSource: new DataSource({
            store: new CustomStore({
              load: () => dataPromise,
            }),
            paginate: false,
          }),
        }],
      });
      await dataPromise;
      await new Promise(process.nextTick);

      expect(POM.getAppointment().getColor(view)).toBe(rooms[0].color);
    });

    it('should render correct appointment color for local datasource (T1300252)', async () => {
      setupSchedulerTestEnvironment();

      const { POM } = await createScheduler({
        views: [view],
        currentView: view,
        currentDate: new Date(2024, 8, 7),
        dataSource,
        resources: [{
          fieldExpr: 'roomId',
          label: 'Room',
          dataSource: rooms,
        }],
      });

      expect(POM.getAppointment().getColor(view)).toBe(rooms[0].color);
    });

    it('should render appointments after resources update (T1301345)', async () => {
      setupSchedulerTestEnvironment();

      const { POM, scheduler } = await createScheduler({
        views: [view],
        currentView: view,
        currentDate: new Date(2024, 8, 7),
        dataSource,
        resources: [{
          fieldExpr: 'roomId',
          label: 'Room',
          dataSource: rooms,
        }],
      });
      scheduler.option('resources', [{
        fieldExpr: 'roomId',
        label: 'Room',
        dataSource: rooms2,
      }]);
      await new Promise(process.nextTick);

      expect(POM.getAppointment().getColor(view)).toBe(rooms2[0].color);
    });
  });
});
