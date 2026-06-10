/**
 * @timezone America/Santiago
 */

import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_TIMELINE_CELL_HEIGHT, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const dataSource = [
  {
    startDate: new Date(2024, 8, 7, 0, 0),
    endDate: new Date(2024, 8, 7, 8, 0),
    text: 'Install New Database',
  },
  {
    startDate: new Date(2024, 8, 8, 1, 30),
    endDate: new Date(2024, 8, 8, 9, 30),
    text: 'Approve New Online Marketing Strategy',
  },
];
const views = [
  {
    view: { name: 'Month', type: 'month', intervalCount: 1 },
    result: {
      hasTimePanel: false, hasHeaderPanel: true, hasCellContent: true, appointmentAmount: 2,
    },
  },
  {
    view: { name: 'Month 2 interval', type: 'month', intervalCount: 2 },
    result: {
      hasTimePanel: false, hasHeaderPanel: true, hasCellContent: true, appointmentAmount: 2,
    },
  },
  {
    view: { name: 'Timeline  Month', type: 'timelineMonth', intervalCount: 1 },
    result: {
      hasTimePanel: false, hasHeaderPanel: true, hasCellContent: false, appointmentAmount: 2,
    },
  },
  {
    view: {
      name: 'Work Week started at Wed', type: 'workWeek', intervalCount: 2, firstDayOfWeek: 3,
    },
    result: {
      hasTimePanel: true, hasHeaderPanel: true, hasCellContent: false, appointmentAmount: 0,
    },
  },
  {
    view: {
      name: 'Timeline Work Week at Tue', type: 'timelineWorkWeek', intervalCount: 1, firstDayOfWeek: 2, cellDuration: 6 * 60,
    },
    result: {
      hasTimePanel: false, hasHeaderPanel: true, hasCellContent: false, appointmentAmount: 0,
    },
  },
  {
    view: { name: 'Week', type: 'week', intervalCount: 1 },
    result: {
      hasTimePanel: true, hasHeaderPanel: true, hasCellContent: false, appointmentAmount: 2,
    },
  },
  {
    view: { name: 'Week started at Sun', type: 'week', firstDayOfWeek: 0 },
    result: {
      hasTimePanel: true, hasHeaderPanel: true, hasCellContent: false, appointmentAmount: 1,
    },
  },
  {
    view: {
      name: 'Timeline Week at Sun', type: 'timelineWeek', firstDayOfWeek: 0, cellDuration: 6 * 60,
    },
    result: {
      hasTimePanel: false, hasHeaderPanel: true, hasCellContent: false, appointmentAmount: 1,
    },
  },
  {
    view: { name: 'Timeline Day', type: 'timelineDay', intervalCount: 1 },
    result: {
      hasTimePanel: false, hasHeaderPanel: true, hasCellContent: false, appointmentAmount: 1,
    },
  },
  {
    view: { name: 'Day before DST', type: 'day', currentDate: new Date(2024, 8, 7) },
    result: {
      hasTimePanel: true, hasHeaderPanel: false, hasCellContent: false, appointmentAmount: 1,
    },
  },
  {
    view: { name: 'Day DST', type: 'day' },
    result: {
      hasTimePanel: true, hasHeaderPanel: false, hasCellContent: false, appointmentAmount: 1,
    },
  },
];

describe('scheduler', () => {
  it.each(views)('should render correct workspace in Santiago DST for view: $view.name', async ({ view, result }) => {
    setupSchedulerTestEnvironment({ height: DEFAULT_TIMELINE_CELL_HEIGHT });

    const { POM } = await createScheduler({
      views: [view],
      currentView: view.name,
      currentDate: new Date(2024, 8, 8),
      height: 600,
      cellDuration: 60,
      firstDayOfWeek: 1,
      dataSource,
    });

    if (result.hasCellContent) {
      expect(POM.getDateTableContent()).toMatchSnapshot();
    }
    if (result.hasHeaderPanel) {
      expect(POM.getHeaderPanelContent()).toMatchSnapshot();
    }
    if (result.hasTimePanel) {
      expect(POM.getTimePanelContent()).toMatchSnapshot();
    }

    expect(POM.getAppointments()).toHaveLength(result.appointmentAmount);
  });
});
