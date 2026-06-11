import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import {
  DEFAULT_CELL_WIDTH,
  DEFAULT_TIMELINE_CELL_HEIGHT,
  setupSchedulerTestEnvironment,
} from './__mock__/mock_scheduler';

describe('month', () => {
  it('should render long appointments with parts and hide smaller ones into spread collectors', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [{
        startDate: new Date(2020, 11, 12),
        endDate: new Date(2020, 11, 15, 3),
        text: '1',
      }, {
        startDate: new Date(2020, 11, 12),
        endDate: new Date(2020, 11, 15, 3),
        text: '2',
      }, {
        startDate: new Date(2020, 11, 12),
        endDate: new Date(2020, 11, 15, 3),
        text: '3',
      }, {
        startDate: new Date(2020, 11, 12),
        endDate: new Date(2020, 11, 20, 3),
        text: '4',
      }, {
        startDate: new Date(2020, 11, 12),
        endDate: new Date(2020, 11, 20, 3),
        text: '5',
      }, {
        startDate: new Date(2020, 11, 12),
        endDate: new Date(2020, 11, 20, 3),
        text: '6',
      }],
      maxAppointmentsPerCell: 1,
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2020, 11, 25),
      height: 600,
    });

    const appointments = POM.getAppointments();
    const texts = appointments.map((item) => item.getText());
    expect(texts).toEqual(['4', '4', '4']);
    expect(POM.getCollectorTexts()).toMatchSnapshot();
  });

  ['month', 'timelineMonth'].forEach((currentView) => {
    it(`should render appointment cropped by startDayHour and endDayHour to occupy only one cell [${currentView}]`, async () => {
      setupSchedulerTestEnvironment({ height: DEFAULT_TIMELINE_CELL_HEIGHT });
      const { POM } = await createScheduler({
        dataSource: [{
          startDate: new Date(2020, 11, 12, 22),
          endDate: new Date(2020, 11, 14, 5),
          text: '1',
        }],
        startDayHour: 10,
        endDayHour: 20,
        views: [currentView],
        currentView,
        currentDate: new Date(2020, 11, 12),
        height: 600,
      });

      const appointment = POM.getAppointment();
      expect(appointment.getGeometry().width).toBe(DEFAULT_CELL_WIDTH);
    });
  });
});
