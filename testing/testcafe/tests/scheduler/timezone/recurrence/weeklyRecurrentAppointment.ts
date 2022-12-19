import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';
import { getAppointmentTime, screenshotTestFunc } from '../timezoneTestingUtils';

const SCREENSHOT_BASE_NAME = 'timezone-weekly-recurrent';

fixture.disablePageReloads`Weekly recurrent appointments with timezones`
  .page(url(__dirname, '../../../container.html'));

// === One day in week tests section ===

test('Should correctly display the recurrent (one day at week) appointment with the same timezone', async (t) => {
  // expected date: 4/28/2021 10:00 AM - 12:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__same-timezone');
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
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
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

test('Should correctly display the recurrent (one day at week) morning appointment with the same timezone', async (t) => {
  // expected date: 4/28/2021 12:00 AM - 2:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-morning-appointment__same-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+1';
  const schedulerTimezone = 'Etc/GMT+1';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 0, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 2, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
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

test('Should correctly display the recurrent (one day at week) evening appointment with the same timezone', async (t) => {
  // expected date: 4/28/2021 10:00 PM - 12:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-evening-appointment__same-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+1';
  const schedulerTimezone = 'Etc/GMT+1';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 22, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 29, 0, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
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

test(`Should correctly display the recurrent (one day at week) appointment
with a greater time timezone and day shift to the next day`, async (t) => {
  // expected date: 4/29/2021 10:00 AM - 12:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__day-shift__greater-timezone');
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
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
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

test('Should correctly display the recurrent (one day at week) appointment with a lower timezone and day shift to the previous day', async (t) => {
  // expected date: 4/27/2021 6:00 PM - 8:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__day-shift__lower-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-10';
  const schedulerTimezone = 'Etc/GMT+2';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 6, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 8, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
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

test('Should correctly display the recurrent (one day at week) appointment with timezone week shift to the previous week', async (t) => {
  // expected date: 4/25/2021 6:00 AM - 8:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__week-shift__lower-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-10';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 26, 2, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 26, 4, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO',
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

test('Should correctly display the recurrent (one day at week) appointment with timezone week shift to the next week', async (t) => {
  // expected date: 4/25/2021 4:00 PM - 6:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__week-shift__greater-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 25, 20, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 25, 22, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU',
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

test(`Should correctly display the recurrent (one day at week) appointment
with timezone view period shift to the next view period at the first week`, async (t) => {
  // expected no visible date
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__next-view-shift__first-week');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 4, 1, 20, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 4, 1, 22, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SA',
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

test(`Should correctly display the recurrent (one day at week) appointment
with timezone view period shift to the next view period at the second week`, async (t) => {
  // expected date: 5/2/2021 4:00 PM - 6:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__next-view-shift__second-week');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const schedulerTimezone = 'Etc/GMT-10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 4, 1, 20, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 4, 1, 22, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SA',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 5),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display the recurrent (one day at week) appointment
with timezone view period shift to the previous view period at the first week`, async (t) => {
  // expected date: 5/1/2021 6:00 AM - 8:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__previous-view-shift__first-week');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-10';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 25, 2, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 25, 4, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU',
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

test(`Should correctly display the recurrent (one day at week) appointment
with timezone view period shift to the previous view period at the second week`, async (t) => {
  // expected date: 4/24/2021 6:00 AM - 8:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__previous-view-shift__before-week');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-10';
  const schedulerTimezone = 'Etc/GMT+10';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 25, 2, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 25, 4, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 21),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

// === multiple day in week tests section ===

test('Should correctly display recurrent appointment with multiple day in week on the first week in same timezone', async (t) => {
  // expected dates:
  // 4/28/2021 10:00 AM - 2:00 AM
  // 4/29/2021 10:00 AM - 2:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'multiple-appointment__first-week__same-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+1';
  const schedulerTimezone = 'Etc/GMT+1';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 14, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,WE,TH',
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

test('Should correctly display recurrent appointment with multiple day in week on the second week in same timezone', async (t) => {
  // expected dates:
  // 5/4/2021 10:00 AM - 2:00 AM
  // 5/5/2021 10:00 AM - 2:00 AM
  // 5/6/2021 10:00 AM - 2:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'multiple-appointment__second-week__same-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+1';
  const schedulerTimezone = 'Etc/GMT+1';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 14, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,WE,TH',
      text: 'Test',
    }],
    timeZone: schedulerTimezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 5),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test('Should correctly display recurrent appointment with multiple day in week on the first week in a greater time timezone', async (t) => {
  // expected dates:
  // 4/29/2021 1:00 AM - 5:00 AM
  // 4/30/2021 1:00 AM - 5:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'multiple-appointment__first-week__greater-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const timezone = 'Etc/GMT-5';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 14, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,WE,TH',
      text: 'Test',
    }],
    timeZone: timezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test('Should correctly display recurrent appointment with multiple day in week on the second week in a greater time timezone', async (t) => {
  // expected dates:
  // 5/5/2021 1:00 AM - 5:00 AM
  // 5/6/2021 1:00 AM - 5:00 AM
  // 5/7/2021 1:00 AM - 5:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'multiple-appointment__second-week__greater-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+10';
  const timezone = 'Etc/GMT-5';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 14, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,WE,TH',
      text: 'Test',
    }],
    timeZone: timezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 5),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test('Should correctly display recurrent appointment with multiple day in week on the first week in a lower time timezone', async (t) => {
  // expected dates:
  // 4/27/2021 7:00 PM - 11:00 PM
  // 4/28/2021 7:00 PM - 11:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'multiple-appointment__first-week__lower-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-10';
  const timezone = 'Etc/GMT+5';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 14, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,WE,TH',
      text: 'Test',
    }],
    timeZone: timezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test('Should correctly display recurrent appointment with multiple day in week on the second week in a lower time timezone', async (t) => {
  // expected dates:
  // 5/3/2021 7:00 PM - 11:00 PM
  // 5/4/2021 7:00 PM - 11:00 PM
  // 5/5/2021 7:00 PM - 11:00 PM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'multiple-appointment__second-week__lower-timezone');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-10';
  const timezone = 'Etc/GMT+5';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 10, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 14, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,WE,TH',
      text: 'Test',
    }],
    timeZone: timezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 5),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

// === maximum timezone offset tests section ===

test(`Should correctly display recurrent appointment with multiple day in week
 on the first week with maximum positive timezone offset`, async (t) => {
  // expected date: 5/1/2021 12:00 AM - 2:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__first-week__max-positive-timezone-offset');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+12';
  const timezone = 'Etc/GMT-14';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 29, 22, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 30, 0, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE,TH, FT',
      text: 'Test',
    }],
    timeZone: timezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display recurrent appointment with multiple day in week
 on the first week with maximum positive timezone offset`, async (t) => {
  // expected dates:
  // 5/6/2021 12:00 AM - 2:00 AM
  // 5/7/2021 12:00 AM - 2:00 AM
  // 5/8/2021 12:00 AM - 2:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__second-week__max-positive-timezone-offset');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT+12';
  const timezone = 'Etc/GMT-14';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 29, 22, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 30, 0, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,WE,TH',
      text: 'Test',
    }],
    timeZone: timezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 5),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display recurrent appointment with multiple day in week
 on the first week with maximum negative timezone offset`, async (t) => {
  // expected dates:
  // 4/26/2021 10:00 PM - 12:00 AM
  // 5/1/2021 10:00 PM - 12:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__first-week__max-negative-timezone-offset');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-14';
  const timezone = 'Etc/GMT+12';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 0, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 2, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE',
      text: 'Test',
    }],
    timeZone: timezone,
    currentView: 'week',
    currentDate: new Date(2021, 3, 28),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});

test(`Should correctly display recurrent appointment with multiple day in week
 on the first week with maximum negative timezone offset`, async (t) => {
  // expected dates:
  // 5/2/2021 10:00 PM - 12:00 AM
  // 5/3/2021 10:00 PM - 12:00 AM
  // 5/8/2021 10:00 PM - 12:00 AM
  await screenshotTestFunc(t, SCREENSHOT_BASE_NAME, 'one-appointment__second-week__max-negative-timezone-offset');
}).before(async () => {
  const appointmentTimezone = 'Etc/GMT-14';
  const timezone = 'Etc/GMT+12';

  await createWidget('dxScheduler', {
    dataSource: [{
      allDay: false,
      startDate: getAppointmentTime(new Date(2021, 3, 28, 0, 0, 0), appointmentTimezone),
      startDateTimeZone: appointmentTimezone,
      endDate: getAppointmentTime(new Date(2021, 3, 28, 2, 0, 0), appointmentTimezone),
      endDateTimeZone: appointmentTimezone,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE',
      text: 'Test',
    }],
    timeZone: timezone,
    currentView: 'week',
    currentDate: new Date(2021, 4, 5),
    startDayHour: 0,
    cellDuration: 180,
    width: 1000,
    height: 585,
  });
});
