import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

const ChicagoDST = [new Date(2025, 2, 8), new Date(2025, 10, 1)]; // +1, -1
const SydneyDST = [new Date(2025, 3, 7), new Date(2025, 9, 4)]; // -1, +1
const BelgradeDST = [new Date(2025, 2, 29), new Date(2025, 9, 25)]; // +1, -1
const dailyAppointment = {
  startDate: new Date(2025, 0, 7, 7),
  endDate: new Date(2025, 0, 7, 8),
  startDateTimeZone: 'America/Chicago',
  endDateTimeZone: 'America/Chicago',
  recurrenceRule: 'FREQ=DAILY',
};
const views = [{ type: 'day', intervalCount: 3 }];

/*
 * NOTE:
 * display date = source date - source time zone offset + target time zone offset
 *
 * Chicago: UTC-6h, UTC-5h, UTC-6h
 * Sydney: UTC+11h, UTC+10h, UTC+11h
 * Belgrade: UTC+1h, UTC+2h, UTC+1h
 *
 * Chicago to Chicago: should keep the same display date
 * Chicago to Sydney:   +17h, +16h, +15h, +16h, +17h
 * Chicago to Belgrade:  +7h,  +6h,  +7h,  +6h,  +7h
 */
describe('Recurrence appointments', () => {
  it('should change dates according to DST in target (Chicago) and appointment timezones (T1305659)', async () => {
    setupSchedulerTestEnvironment();
    const { POM, scheduler } = await createScheduler({
      timeZone: 'America/Chicago',
      dataSource: [dailyAppointment],
      views,
      currentView: 'day',
      currentDate: ChicagoDST[0],
    });

    const getDates = () => POM.getAppointments().map((appointment) => appointment.getDisplayDate());

    const dates = getDates();
    scheduler.option('currentDate', ChicagoDST[1]);
    dates.push(...getDates());

    expect(dates).toMatchSnapshot();
  });

  it('should change dates according to DST in target (Sydney) and appointment timezones (T1305659)', async () => {
    setupSchedulerTestEnvironment();
    const { POM, scheduler } = await createScheduler({
      timeZone: 'Australia/Sydney',
      dataSource: [dailyAppointment],
      views,
      currentView: 'day',
      currentDate: ChicagoDST[0],
    });

    const getDates = () => POM.getAppointments().map((appointment) => appointment.getDisplayDate());

    const dates = getDates();
    scheduler.option('currentDate', SydneyDST[0]);
    dates.push(...getDates());
    scheduler.option('currentDate', SydneyDST[1]);
    dates.push(...getDates());
    scheduler.option('currentDate', ChicagoDST[1]);
    dates.push(...getDates());

    expect(dates).toMatchSnapshot();
  });

  it('should change dates according to DST in target (Belgrade) and appointment timezones (T1305659)', async () => {
    setupSchedulerTestEnvironment();
    const { POM, scheduler } = await createScheduler({
      timeZone: 'Europe/Belgrade',
      dataSource: [dailyAppointment],
      views,
      currentView: 'day',
      currentDate: ChicagoDST[0],
    });

    const getDates = () => POM.getAppointments().map((appointment) => appointment.getDisplayDate());

    const dates = getDates();
    scheduler.option('currentDate', BelgradeDST[0]);
    dates.push(...getDates());
    scheduler.option('currentDate', BelgradeDST[1]);
    dates.push(...getDates());
    scheduler.option('currentDate', ChicagoDST[1]);
    dates.push(...getDates());

    expect(dates).toMatchSnapshot();
  });
});
