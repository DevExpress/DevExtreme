import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';
import type { AppointmentModel } from './__mock__/model/appointment';

const ChicagoDST = [new Date('2025-03-08T00:00:00.000Z'), new Date('2025-11-01T00:00:00.000Z')]; // +1, -1
const SydneyDST = [new Date('2025-04-07T00:00:00.000Z'), new Date('2025-10-04T00:00:00.000Z')]; // -1, +1
const BelgradeDST = [new Date('2025-03-29T00:00:00.000Z'), new Date('2025-10-25T00:00:00.000Z')]; // +1, -1
const dailyAppointment = {
  startDate: new Date('2025-01-07T13:00:00.000Z'),
  endDate: new Date('2025-01-07T14:00:00.000Z'),
  startDateTimeZone: 'America/Chicago',
  endDateTimeZone: 'America/Chicago',
  recurrenceRule: 'FREQ=DAILY',
};
const views = [{ type: 'week', intervalCount: 2 }];

const getDisplayDates = (appointments: AppointmentModel[]): string[] => appointments
  .map((appointment) => appointment.getDisplayDate());
const reduceDates = (texts: string[]): string[] => texts
  .reduce<string[]>((result, time) => {
    if (result.at(-1) !== time) {
      result.push(time);
    }

    return result;
  }, []);

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
      currentView: 'week',
      currentDate: ChicagoDST[0],
    });

    const getDates = () => getDisplayDates(POM.getAppointments());

    const dates = getDates();
    scheduler.option('currentDate', ChicagoDST[1]);
    dates.push(...getDates());

    expect(reduceDates(dates)).toEqual([
      '7:00 AM - 8:00 AM',
    ]);
  });

  it('should change dates according to DST in target (Sydney) and appointment timezones (T1305659)', async () => {
    setupSchedulerTestEnvironment();
    const { POM, scheduler } = await createScheduler({
      timeZone: 'Australia/Sydney',
      dataSource: [dailyAppointment],
      views,
      currentView: 'week',
      currentDate: ChicagoDST[0],
    });

    const getDates = () => getDisplayDates(POM.getAppointments());

    const dates = getDates();
    scheduler.option('currentDate', SydneyDST[0]);
    dates.push(...getDates());
    scheduler.option('currentDate', SydneyDST[1]);
    dates.push(...getDates());
    scheduler.option('currentDate', ChicagoDST[1]);
    dates.push(...getDates());

    expect(reduceDates(dates)).toEqual([
      '12:00 AM - 1:00 AM',
      '11:00 PM - 12:00 AM',
      '10:00 PM - 11:00 PM',
      '11:00 PM - 12:00 AM',
      '12:00 AM - 1:00 AM',
    ]);
  });

  it('should change dates according to DST in target (Belgrade) and appointment timezones (T1305659)', async () => {
    setupSchedulerTestEnvironment();
    const { POM, scheduler } = await createScheduler({
      timeZone: 'Europe/Belgrade',
      dataSource: [dailyAppointment],
      views,
      currentView: 'week',
      currentDate: ChicagoDST[0],
    });

    const getDates = () => getDisplayDates(POM.getAppointments());

    const dates = getDates();
    scheduler.option('currentDate', BelgradeDST[0]);
    dates.push(...getDates());
    scheduler.option('currentDate', BelgradeDST[1]);
    dates.push(...getDates());
    scheduler.option('currentDate', ChicagoDST[1]);
    dates.push(...getDates());

    expect(reduceDates(dates)).toEqual([
      '2:00 PM - 3:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
    ]);
  });
});
