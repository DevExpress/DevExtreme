import url from '../../../../helpers/getPageUrl';
import { getAppointmentTime, screenshotTestFunc } from '../timezoneTestingUtils';
import createWidget from '../../../../helpers/createWidget';

const SCREENSHOT_BASE_NAME = 'timezone-monthly-recurrent';

fixture`Monthly recurrent appointments with timezones`
  .page(url(__dirname, '../../../container.html'));

test('Should correctly display the recurrent monthly appointment with the same timezone', async (t) => {
  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'same-date__same-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+1';
  const schedulerTimezone = 'Etc/GMT+1';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 12, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=28',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test('Should correctly display the recurrent monthly appointment with a greater time timezone', async (t) => {
  // expected date: 4/29/2021 10:00 AM - 12:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'same-date__greater-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 22, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 29, 0, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=28',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test('Should correctly display the recurrent monthly appointment with a lower time timezone', async (t) => {
  // expected date: 4/27/2021 12:00 PM - 2:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'same-date__lower-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 0, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 2, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=28',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment
if start date lower that recurrent date with the same time timezone`, async (t) => {
  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'lower-date__same-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 26, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 26, 12, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=28',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment
if start date lower that recurrent date with a greater time timezone`, async (t) => {
  // expected date: 4/29/2021 2:00 AM - 4:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'lower-date__greater-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 26, 14, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 26, 16, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=28',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment
if start date lower that recurrent date with a lower time timezone`, async (t) => {
  // expected date: 4/27/2021 4:00 PM - 6:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'lower-date__lower-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 26, 4, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 26, 6, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=28',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment at first date
if start date greater that recurrent date with a same time timezone`, async (t) => {
  // expected no visible date
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__same-timezone__same-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 12, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=26',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment at next date
if start date greater that recurrent date with a same time timezone`, async (t) => {
  // expected date: 5/26/2021 10:00 AM - 12:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__same-timezone__next-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 12, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=26',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment at first date
if start date greater that recurrent date with a greater time timezone`, async (t) => {
  // expected no visible date
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__greater-timezone__same-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 14, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 16, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=26',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment at next date
if start date greater that recurrent date with a greater time timezone`, async (t) => {
  // expected date: 5/27/2021 2:00 AM - 4:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__greater-timezone__next-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 14, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 16, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=26',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment at first date
if start date greater that recurrent date with a lower time timezone`, async (t) => {
  // expected no visible date
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__lower-timezone__same-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 4, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 6, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=26',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent monthly appointment at next date
if start date greater that recurrent date with a lower time timezone`, async (t) => {
  // expected date: 5/25/2021 4:00 PM - 6:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__lower-timezone__next-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 4, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 6, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=26',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});
