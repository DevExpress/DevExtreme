import url from '../../../helpers/getPageUrl';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import createWidget from '../../../helpers/createWidget';
import { screenshotTestFunc } from './timezoneTestingUtils';

const SCREENSHOT_BASE_NAME = 'recurrent-appointment-cross-dst__';
const SCHEDULER_SELECTOR = '#container';
const TEST_APPOINTMENT_TEXT = 'Watercolor Landscape';
const TEST_TIMEZONES = ['America/Los_Angeles', 'Etc/GMT', 'Asia/Tokyo'];
const SCHEDULER_DATETIME = {
  winter: new Date('2020-11-03T20:00:00.000Z'),
  summer: new Date('2020-03-10T20:00:00.000Z'),
};
const APPOINTMENT_DATETIME = {
  early: {
    winter: {
      start: new Date('2020-10-01T02:30:00.000Z'),
      end: new Date('2020-10-01T04:00:00.000Z'),
    },
    summer: {
      start: new Date('2020-03-01T01:30:00.000Z'),
      end: new Date('2020-03-01T03:00:00.000Z'),
    },
  },
  middle: {
    winter: {
      start: new Date('2020-10-01T17:30:00.000Z'),
      end: new Date('2020-10-01T19:00:00.000Z'),
    },
    summer: {
      start: new Date('2020-03-01T16:30:00.000Z'),
      end: new Date('2020-03-01T18:00:00.000Z'),
    },
  },
  late: {
    winter: {
      start: new Date('2020-10-01T21:30:00.000Z'),
      end: new Date('2020-10-01T23:00:00.000Z'),
    },
    summer: {
      start: new Date('2020-03-01T20:30:00.000Z'),
      end: new Date('2020-03-01T22:00:00.000Z'),
    },
  },
  longEarly: {
    winter: {
      start: new Date('2020-10-01T02:30:00.000Z'),
      end: new Date('2020-10-01T19:00:00.000Z'),
    },
    summer: {
      start: new Date('2020-03-01T01:30:00.000Z'),
      end: new Date('2020-03-01T18:00:00.000Z'),
    },
  },
  long: {
    winter: {
      start: new Date('2020-10-01T02:30:00.000Z'),
      end: new Date('2020-10-01T23:00:00.000Z'),
    },
    summer: {
      start: new Date('2020-03-01T01:30:00.000Z'),
      end: new Date('2020-03-01T22:00:00.000Z'),
    },
  },
  longLate: {
    winter: {
      start: new Date('2020-10-01T17:30:00.000Z'),
      end: new Date('2020-10-01T23:00:00.000Z'),
    },
    summer: {
      start: new Date('2020-03-01T16:30:00.000Z'),
      end: new Date('2020-03-01T22:00:00.000Z'),
    },
  },
};

async function configureScheduler(t: TestController,
  { start, end, appointmentTimezone }: { start: Date; end: Date; appointmentTimezone: string },
  { current, schedulerTimezone }: { current: Date; schedulerTimezone: string }) {
  await restoreBrowserSize(t);

  await createWidget('dxScheduler', {
    dataSource: [{
      startDate: start,
      endDate: end,
      startDateTimeZone: appointmentTimezone,
      endDateTimeZone: appointmentTimezone,
      text: TEST_APPOINTMENT_TEXT,
      recurrenceRule: 'FREQ=DAILY',
    }],
    timeZone: schedulerTimezone,
    views: ['week'],
    currentView: 'week',
    currentDate: current,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
}

fixture`Recurrence appointments in DST`
  .page(url(__dirname, '../../container.html'));

TEST_TIMEZONES.forEach((schedulerTimezone) => {
  [...TEST_TIMEZONES, undefined].forEach((appointmentTimezone) => {
    Object.keys(APPOINTMENT_DATETIME).forEach((appointmentType) => {
      Object.keys(APPOINTMENT_DATETIME[appointmentType]).forEach((DSTType) => {
        test(`should correctly cross DST.
        scheduler timezone: ${schedulerTimezone}
        | appointment timezone: ${appointmentTimezone}
        | appointment type: ${appointmentType}
        | dst: ${DSTType} time`, async (t) => {
          await screenshotTestFunc(t, SCREENSHOT_BASE_NAME,
            `${schedulerTimezone}__${appointmentTimezone}__${appointmentType}__${DSTType}-time`,
            SCHEDULER_SELECTOR);
        }).before(async (t) => {
          await configureScheduler(t, {
            ...APPOINTMENT_DATETIME[appointmentType][DSTType],
            appointmentTimezone,
          }, {
            current: SCHEDULER_DATETIME[DSTType],
            schedulerTimezone,
          });
        });
      });
    });
  });
});
