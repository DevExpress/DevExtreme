/**
 * @timezone America/Santiago
 */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  describe, expect, it,
} from '@jest/globals';

import Scheduler from '../m_scheduler';

const dataSource = [
  {
    priorityId: 2,
    startDate: new Date(2024, 8, 7, 0, 0),
    endDate: new Date(2024, 8, 7, 8, 0),
    text: 'Install New Database',
  },
  {
    priorityId: 2,
    startDate: new Date(2024, 8, 8, 1, 30),
    endDate: new Date(2024, 8, 8, 9, 30),
    text: 'Approve New Online Marketing Strategy',
  },
  {
    priorityId: 1,
    startDate: new Date(2024, 8, 7, 0, 0),
    endDate: new Date(2024, 8, 7, 8, 0),
    text: 'Install New Database 2',
  },
  {
    priorityId: 1,
    startDate: new Date(2024, 8, 8, 1, 30),
    endDate: new Date(2024, 8, 8, 9, 30),
    text: 'Approve New Online Marketing Strategy 2',
  },
];
const priorities = [
  {
    text: 'High',
    id: 1,
    color: '#cc5c53',
  }, {
    text: 'Low',
    id: 2,
    color: '#ff9747',
  },
];
const views = [
  { name: 'Month', type: 'month', intervalCount: 1 },
  { name: 'Month 2 interval', type: 'month', intervalCount: 2 },
  { name: 'Timeline  Month', type: 'timelineMonth', intervalCount: 1 },
  {
    name: 'Work Week started at Wed', type: 'workWeek', intervalCount: 2, firstDayOfWeek: 3,
  },
  {
    name: 'Timeline Work Week at Tue', type: 'timelineWorkWeek', intervalCount: 1, firstDayOfWeek: 2,
  },
  { name: 'Week', type: 'week', intervalCount: 1 },
  { name: 'Week started at Sun', type: 'week', firstDayOfWeek: 0 },
  {
    name: 'Month', type: 'timelineWeek', intervalCount: 1, cellDuration: 60,
  },
  {
    name: 'Timeline Week 8 hour cell duration', type: 'timelineWeek', firstDayOfWeek: 0, cellDuration: 8 * 60,
  },
  { name: 'Timeline Day', type: 'timelineDay', intervalCount: 1 },
  { name: 'Day', type: 'day' },
];
const viewsNames = views.map((view) => view.name);

describe('scheduler', () => {
  it.each(viewsNames)('should render correct workspace in Santiago DST for view: %s', async () => {
    const container = document.createElement('div');
    const scheduler = new Scheduler(container, {
      views,
      groups: ['priorityId'],
      currentView: 'week',
      currentDate: new Date(2024, 8, 8),
      height: 600,
      firstDayOfWeek: 1,
      resources: [{
        fieldExpr: 'priorityId',
        dataSource: priorities,
        label: 'Priority',
      }],
      dataSource,
    } as any);
    await new Promise(process.nextTick);

    const workspace = container.querySelector('.dx-scheduler-work-space') as HTMLDivElement;

    expect(workspace).toMatchSnapshot();
  });
});
