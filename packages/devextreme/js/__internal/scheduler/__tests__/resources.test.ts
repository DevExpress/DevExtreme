/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  describe, expect, it,
} from '@jest/globals';
import { DataSource } from '@ts/data/data_source/m_data_source';
import CustomStore from '@ts/data/m_custom_store';

import Scheduler from '../m_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

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
const getAppointmentColor = (container: HTMLDivElement): string => {
  const appointment = container.querySelector('.dx-scheduler-appointment') as HTMLDivElement;
  return appointment.style.backgroundColor;
};

describe('Resources', () => {
  it('should render correct appointment color for remote datasource (T1300252)', async () => {
    setupSchedulerTestEnvironment();

    const dataPromise = new Promise((resolve) => {
      setTimeout(resolve, 100, rooms);
    });
    const container = document.createElement('div');
    const scheduler = new Scheduler(container, {
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2024, 8, 8),
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
    } as any);
    await dataPromise;
    await new Promise(process.nextTick);

    expect(getAppointmentColor(container)).toBe(rooms[0].color);
  });

  it('should render correct appointment color for local datasource (T1300252)', async () => {
    setupSchedulerTestEnvironment();

    const container = document.createElement('div');
    const scheduler = new Scheduler(container, {
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2024, 8, 8),
      dataSource,
      resources: [{
        fieldExpr: 'roomId',
        label: 'Room',
        dataSource: rooms,
      }],
    } as any);
    await new Promise(process.nextTick);

    expect(getAppointmentColor(container)).toBe(rooms[0].color);
  });
});
