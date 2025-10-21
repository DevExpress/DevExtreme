import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { changeTheme } from '../../../../helpers/changeTheme';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';

fixture.disablePageReloads`Appointment Form: Recurrence Form`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const openAppointmentPopup = async (
  t: TestController,
  appointment: any,
  isRecurringAppointment = false,
): Promise<void> => {
  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  if (isRecurringAppointment) {
    await t.click(Scheduler.getEditRecurrenceDialog().series);
  }
};

const openRecurrenceForm = async (
  t: TestController,
  freq = 'Daily',
): Promise<void> => {
  const repeatEditor = Selector('.dx-scheduler-form-repeat-editor .dx-selectbox');
  await t.click(repeatEditor);

  const option = Selector('.dx-list-item').withText(freq);
  await t.click(option);

  await t.wait(500);
};

const setRepeatEvery = async (
  t: TestController,
  interval: number,
): Promise<void> => {
  const intervalEditor = Selector('.dx-scheduler-form-recurrence-repeat-every-group [type="text"]');
  await t
    .selectText(intervalEditor)
    .typeText(intervalEditor, interval.toString(), { replace: true });
};

const selectWeekDays = async (
  t: TestController,
  days: string[],
): Promise<void> => {
  const dayButtons = Selector('.dx-scheduler-recurrence-byday-buttons .dx-button');

  // eslint-disable-next-line no-restricted-syntax
  for (const day of days) {
    const dayButton = dayButtons.withAttribute('data-day-key', day.slice(0, 2).toUpperCase());
    await t.click(dayButton);
  }
};

const setMonthDay = async (
  t: TestController,
  day: number,
): Promise<void> => {
  const monthDayEditor = Selector('.dx-scheduler-form-recurrence-repeat-on-monthly-group [type="text"]');
  await t
    .selectText(monthDayEditor)
    .typeText(monthDayEditor, day.toString(), { replace: true });
};

const setYearlyDate = async (
  t: TestController,
  month: number,
  day: number,
): Promise<void> => {
  const monthEditor = Selector('.dx-scheduler-form-recurrence-repeat-on-yearly-group [type="text"]').nth(0);
  const dayEditor = Selector('.dx-scheduler-form-recurrence-repeat-on-yearly-group [type="text"]').nth(1);

  await t
    .selectText(monthEditor)
    .typeText(monthEditor, month.toString(), { replace: true });

  await t
    .selectText(dayEditor)
    .typeText(dayEditor, day.toString(), { replace: true });
};

const setRepeatEnd = async (
  t: TestController,
  type: 'never' | 'count' | 'until',
  value?: number | string,
): Promise<void> => {
  const radioGroup = Selector('.dx-scheduler-form-recurrence-end-radio');
  const inputGroup = Selector('.dx-scheduler-form-recurrence-end-inputs');

  if (type === 'never') {
    const neverRadio = radioGroup.find('.dx-radiobutton').nth(0);
    await t.click(neverRadio);
  } else if (type === 'until') {
    const untilRadio = radioGroup.find('.dx-radiobutton').nth(1);
    await t.click(untilRadio);

    if (value !== undefined) {
      const untilEditor = inputGroup.find('[type="text"]').nth(0);
      await t
        .selectText(untilEditor)
        .typeText(untilEditor, value.toString(), { replace: true });
    }
  } else if (type === 'count') {
    const countRadio = radioGroup.find('.dx-radiobutton').nth(2);
    await t.click(countRadio);

    if (value !== undefined) {
      const countEditor = inputGroup.find('[type="text"]').nth(1);
      await t
        .selectText(countEditor)
        .typeText(countEditor, value.toString(), { replace: true });
    }
  }
};

const themes = [
  'generic.light',
  'generic.light.compact',
  'material.blue.light',
  'material.blue.light.compact',
  'fluent.blue.light',
  'fluent.blue.light.compact',
];

themes.forEach((theme) => {
  [
    { repeatEnd: 'never', value: undefined },
    { repeatEnd: 'until', value: '12/31/2024' },
    { repeatEnd: 'count', value: 10 },
  ].forEach(({ repeatEnd, value }) => {
    safeSizeTest(`daily frequency with repeat end ${repeatEnd} (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointment = {
        text: 'Daily Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await openRecurrenceForm(t, 'Daily');
      await setRepeatEnd(t, repeatEnd as any, value);

      const recurrenceFormContent = Selector('.dx-scheduler-form-recurrence-group');

      await takeScreenshot(
        `scheduler__recurrence-form__daily__repeat-end-${repeatEnd}.png (theme=${theme})`,
        recurrenceFormContent,
      );

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);
      await createWidget('dxScheduler', {
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2024, 0, 1),
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});

themes.forEach((theme) => {
  [
    { days: ['Monday', 'Wednesday', 'Friday'], label: 'mon-wed-fri' },
    { days: ['Saturday', 'Sunday'], label: 'weekend' },
  ].forEach(({ days, label }) => {
    safeSizeTest(`weekly frequency with days ${label} (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointment = {
        text: 'Weekly Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await openRecurrenceForm(t, 'Weekly');
      await selectWeekDays(t, days);
      await setRepeatEnd(t, 'count', 15);

      const recurrenceFormContent = Selector('.dx-scheduler-form-recurrence-group');
      await takeScreenshot(
        `scheduler__recurrence-form__weekly__${label}.png (theme=${theme})`,
        recurrenceFormContent,
      );

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);
      await createWidget('dxScheduler', {
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2024, 0, 1),
        firstDayOfWeek: 1,
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});

themes.forEach((theme) => {
  [2, 5].forEach((interval) => {
    safeSizeTest(`weekly frequency with interval ${interval} (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointment = {
        text: 'Weekly Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await openRecurrenceForm(t, 'Weekly');
      await setRepeatEvery(t, interval);
      await selectWeekDays(t, ['Monday', 'Friday']);

      const recurrenceFormContent = Selector('.dx-scheduler-form-recurrence-group');

      await takeScreenshot(
        `scheduler__recurrence-form__weekly__interval-${interval}.png (theme=${theme})`,
        recurrenceFormContent,
      );

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);
      await createWidget('dxScheduler', {
        dataSource: [],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2024, 0, 1),
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});

themes.forEach((theme) => {
  [1, 15].forEach((day) => {
    safeSizeTest(`monthly frequency with day ${day} (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointment = {
        text: 'Monthly Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await openRecurrenceForm(t, 'Monthly');
      await setMonthDay(t, day);
      await setRepeatEnd(t, 'count', 12);

      const recurrenceFormContent = Selector('.dx-scheduler-form-recurrence-group');
      await takeScreenshot(
        `scheduler__recurrence-form__monthly__day-${day}.png (theme=${theme})`,
        recurrenceFormContent,
      );

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);
      await createWidget('dxScheduler', {
        dataSource: [],
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2024, 0, 1),
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});

themes.forEach((theme) => {
  [
    { month: 1, day: 1, label: 'jan-1' },
    { month: 12, day: 31, label: 'dec-31' },
  ].forEach(({ month, day, label }) => {
    safeSizeTest(`yearly frequency with ${label} (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointment = {
        text: 'Yearly Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await openRecurrenceForm(t, 'Yearly');
      await setYearlyDate(t, month, day);
      await setRepeatEnd(t, 'until', '01/01/2030');

      const recurrenceFormContent = Selector('.dx-scheduler-form-recurrence-group');
      await takeScreenshot(
        `scheduler__recurrence-form__yearly__${label}.png (theme=${theme})`,
        recurrenceFormContent,
      );

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);
      await createWidget('dxScheduler', {
        dataSource: [],
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2024, 0, 1),
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});

themes.forEach((theme) => {
  safeSizeTest(`hourly frequency (${theme})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const appointment = {
      text: 'Hourly Appointment',
      startDate: new Date('2024-01-01T10:00:00'),
      endDate: new Date('2024-01-01T11:00:00'),
    };

    await openAppointmentPopup(t, appointment);
    await openRecurrenceForm(t, 'Hourly');
    await setRepeatEvery(t, 2);
    await setRepeatEnd(t, 'count', 20);

    const recurrenceFormContent = Selector('.dx-scheduler-form-recurrence-group');
    await takeScreenshot(
      `scheduler__recurrence-form__hourly.png (theme=${theme})`,
      recurrenceFormContent,
    );

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
    await createWidget('dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2024, 0, 1),
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});

themes.forEach((theme) => {
  safeSizeTest(`editing existing recurrence rule (${theme})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const appointment = {
      text: 'Existing Recurrent',
      startDate: new Date('2024-01-01T10:00:00'),
      endDate: new Date('2024-01-01T11:00:00'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
    };

    await openAppointmentPopup(t, appointment, true);

    const settingsButton = Selector('.dx-scheduler-form-repeat-editor .dx-button-has-icon');
    await t.click(settingsButton);

    await t.wait(500);

    const recurrenceFormContent = Selector('.dx-scheduler-form-recurrence-group');
    await takeScreenshot(
      `scheduler__recurrence-form__editing-existing.png (theme=${theme})`,
      recurrenceFormContent,
    );

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'Existing Recurrent',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2024, 0, 1),
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
