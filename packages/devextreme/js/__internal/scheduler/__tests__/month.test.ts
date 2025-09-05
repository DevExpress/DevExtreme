import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

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
});
