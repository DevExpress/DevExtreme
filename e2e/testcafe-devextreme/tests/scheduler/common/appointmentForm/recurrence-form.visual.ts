import Scheduler from 'devextreme-testcafe-models/scheduler';
import RecurrenceForm from 'devextreme-testcafe-models/scheduler/appointment/recurrenceForm';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { changeTheme } from '../../../../helpers/changeTheme';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';

fixture.disablePageReloads`Appointment Form: Recurrence Form`
  .page(url(__dirname, '../../../container.html'));

const openAppointmentPopup = async (
  t: TestController,
  appointment: any,
  isRecurringAppointment = false,
): Promise<void> => {
  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  if (isRecurringAppointment) {
    await t.click(Scheduler.getEditRecurrenceDialog().series);
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
      const recurrenceForm = new RecurrenceForm();

      const appointment = {
        text: 'Daily Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await recurrenceForm.open(t, 'Daily');
      await recurrenceForm.setRepeatEnd(t, repeatEnd as any, value);

      await takeScreenshot(
        `scheduler__recurrence-form__daily__repeat-end-${repeatEnd}.png (theme=${theme})`,
        recurrenceForm.element,
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
      const recurrenceForm = new RecurrenceForm();

      const appointment = {
        text: 'Weekly Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await recurrenceForm.open(t, 'Weekly');
      await recurrenceForm.selectWeekDays(t, days);
      await recurrenceForm.setRepeatEnd(t, 'count', 15);

      await takeScreenshot(
        `scheduler__recurrence-form__weekly__${label}.png (theme=${theme})`,
        recurrenceForm.element,
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
      const recurrenceForm = new RecurrenceForm();

      const appointment = {
        text: 'Weekly Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await recurrenceForm.open(t, 'Weekly');
      await recurrenceForm.setRepeatEvery(t, interval);
      await recurrenceForm.selectWeekDays(t, ['Monday', 'Friday']);

      await takeScreenshot(
        `scheduler__recurrence-form__weekly__interval-${interval}.png (theme=${theme})`,
        recurrenceForm.element,
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
      const recurrenceForm = new RecurrenceForm();

      const appointment = {
        text: 'Monthly Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await recurrenceForm.open(t, 'Monthly');
      await recurrenceForm.setMonthDay(t, day);
      await recurrenceForm.setRepeatEnd(t, 'count', 12);

      await takeScreenshot(
        `scheduler__recurrence-form__monthly__day-${day}.png (theme=${theme})`,
        recurrenceForm.element,
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
      const recurrenceForm = new RecurrenceForm();

      const appointment = {
        text: 'Yearly Appointment',
        startDate: new Date('2024-01-01T10:00:00'),
        endDate: new Date('2024-01-01T11:00:00'),
      };

      await openAppointmentPopup(t, appointment);
      await recurrenceForm.open(t, 'Yearly');
      await recurrenceForm.setYearlyDate(t, month, day);
      await recurrenceForm.setRepeatEnd(t, 'until', '01/01/2030');

      await takeScreenshot(
        `scheduler__recurrence-form__yearly__${label}.png (theme=${theme})`,
        recurrenceForm.element,
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
    const recurrenceForm = new RecurrenceForm();

    const appointment = {
      text: 'Hourly Appointment',
      startDate: new Date('2024-01-01T10:00:00'),
      endDate: new Date('2024-01-01T11:00:00'),
    };

    await openAppointmentPopup(t, appointment);
    await recurrenceForm.open(t, 'Hourly');
    await recurrenceForm.setRepeatEvery(t, 2);
    await recurrenceForm.setRepeatEnd(t, 'count', 20);

    await takeScreenshot(
      `scheduler__recurrence-form__hourly.png (theme=${theme})`,
      recurrenceForm.element,
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
    const recurrenceForm = new RecurrenceForm();

    const appointment = {
      text: 'Existing Recurrent',
      startDate: new Date('2024-01-01T10:00:00'),
      endDate: new Date('2024-01-01T11:00:00'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
    };

    await openAppointmentPopup(t, appointment, true);
    await recurrenceForm.openSettings(t);

    await takeScreenshot(
      `scheduler__recurrence-form__editing-existing.png (theme=${theme})`,
      recurrenceForm.element,
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
