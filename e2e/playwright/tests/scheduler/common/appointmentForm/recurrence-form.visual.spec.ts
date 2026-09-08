import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { setFixedDate } from '../../../../helpers/mockDate';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const MOBILE_SIZE: [number, number] = [450, 1000];

// The recurrence form's "On" editor falls back to the end of today, so every one of these
// screenshots used to carry a "_mask.png" ignore region. Pinning what the page reads as "now"
// makes the whole form deterministic instead.
const FIXED_NOW = '2024-06-15T12:00:00.000Z';

test.beforeEach(async ({ page }) => {
  await setFixedDate(page, FIXED_NOW);
});

['Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'].forEach((frequency) => {
  test(`recurrence form in ${frequency} frequency`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2024, 0, 1),
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2024-01-01T10:00:00'),
      endDate: new Date('2024-01-01T11:00:00'),
    };

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, false);

    await appointmentPopup.selectRepeatValue(frequency);

    await testScreenshot(
      page,
      `scheduler__appointment__recurrence-form__${frequency.toLowerCase()}.png`,
      { element: appointmentPopup.contentElement },
    );
  });
});

test('recurrence form with icons', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
    editing: {
      form: {
        iconsShowMode: 'both',
      },
    },
  });

  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    assigneeId: [1, 2],
    roomId: 1,
    priorityId: 1,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=1',
  };

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(appointment, true);

  await appointmentPopup.clickRecurrenceSettingsButton();

  await testScreenshot(
    page,
    'scheduler__appointment__recurrence-form__with-icons.png',
    { element: appointmentPopup.contentElement },
  );
});

test('recurrence form readonly state', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
    editing: {
      allowUpdating: false,
    },
  });

  const appointment = {
    text: 'Readonly Recurrent Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
  };

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(appointment, false);

  await appointmentPopup.clickRecurrenceSettingsButton();

  await testScreenshot(
    page,
    'scheduler__appointment__recurrence-form__readonly.png',
    { element: appointmentPopup.contentElement },
  );
});

test.describe(() => {
  test.use({ browserSize: MOBILE_SIZE });

  test('recurrence form on mobile screen', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      editing: {
        form: {
          iconsShowMode: 'both',
        },
      },
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(undefined, false);

    await appointmentPopup.selectRepeatValue('Weekly');

    await testScreenshot(page, 'scheduler__appointment__recurrence-form__mobile.png');
  });
});

test.describe(() => {
  test.use({ browserSize: [1500, 1500] });

  test('recurrence form with labelMode=static', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      editing: {
        allowUpdating: true,
        popup: {
          width: 420,
          height: 500,
        },
        form: {
          iconsShowMode: 'both',
          labelMode: 'static',
          items: [
            'mainGroup',
            {
              name: 'recurrenceGroup',
              items: [
                'recurrenceStartDateGroup',
                'recurrenceRuleGroup',
                {
                  name: 'recurrenceEndGroup',
                  items: [
                    'recurrenceEndIcon',
                    {
                      name: 'recurrenceEndEditor',
                      label: {
                        visible: true,
                        location: 'top',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });

    const appointment = {
      text: 'Readonly Recurrent Appointment',
      startDate: new Date('2024-01-01T10:00:00'),
      endDate: new Date('2024-01-01T11:00:00'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
    };

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, true);

    await appointmentPopup.clickRecurrenceSettingsButton();

    await testScreenshot(
      page,
      'scheduler__appointment__recurrence-form__with-labelMode-static.png',
      { element: appointmentPopup.contentElement },
    );
  });
});
