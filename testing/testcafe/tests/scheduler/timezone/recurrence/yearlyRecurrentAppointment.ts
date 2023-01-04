import url from '../../../../helpers/getPageUrl';
import { getAppointmentTime, screenshotTestFunc } from '../timezoneTestingUtils';
import createWidget from '../../../../helpers/createWidget';

const SCREENSHOT_BASE_NAME = 'timezone-yearly-recurrent';

fixture`Yearly recurrent appointments with timezones`
  .page(url(__dirname, '../../../container.html'));

test('Should correctly display the recurrent yearly appointment with the same timezone', async (t) => {
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
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test('Should correctly display the recurrent yearly appointment with a greater time timezone', async (t) => {
  // expected date: 4/29/2021 2:00 AM - 4:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'same-date__greater-timezone');
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
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test('Should correctly display the recurrent yearly appointment with a lower time timezone', async (t) => {
  // expected date: 4/27/2021 2:00 PM - 4:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'same-date__lower-timezone');
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
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test(`Should correctly display the recurrent yearly appointment if start date
lower than recurrent date with the same timezone`, async (t) => {
  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'lower-date__same-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+1';
  const schedulerTimezone = 'Etc/GMT+1';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 26, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 26, 12, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test(`Should correctly display the recurrent yearly appointment if start date
lower than recurrent date with a greater time timezone`, async (t) => {
  // expected date: 4/29/2021 2:00 AM - 4:00 PM
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
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test(`Should correctly display the recurrent yearly appointment if start date
lower than recurrent date with a lower time timezone`, async (t) => {
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
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test(`Should correctly display the recurrent yearly appointment at first date if start date
greater than recurrent date with the same timezone`, async (t) => {
  // expected no visible date
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__same-timezone__same-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+1';
  const schedulerTimezone = 'Etc/GMT+1';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 29, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 29, 12, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test(`Should correctly display the recurrent yearly appointment at next date if start date
greater than recurrent date with the same timezone`, async (t) => {
  // expected date: 4/28/2022 10:00 AM - 12:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__same-timezone__next-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+1';
  const schedulerTimezone = 'Etc/GMT+1';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 29, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 29, 12, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2022, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent yearly appointment at first date if start date
greater than recurrent date with a greater time timezone`, async (t) => {
  // expected no visible date
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__greater-timezone__same-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 29, 14, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 29, 16, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test(`Should correctly display the recurrent yearly appointment at next date if start date
greater than recurrent date with a greater time timezone`, async (t) => {
  // expected date: 4/29/2022 2:00 AM - 4:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__greater-timezone__next-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 29, 14, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 29, 16, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2022, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent yearly appointment at first date if start date
greater than recurrent date with a lower time timezone`, async (t) => {
  // expected no visible date
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__lower-timezone__same-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 29, 4, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 29, 6, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
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

test(`Should correctly display the recurrent yearly appointment at next date if start date
greater than recurrent date with a lower time timezone`, async (t) => {
  // expected date: 4/27/2022 4:00 PM - 6:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'greater-date__lower-timezone__next-view-date');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-2';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 29, 4, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 29, 6, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=28;BYMONTH=4',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2022, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});
