import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import AppointmentPopup from 'devextreme-testcafe-models/scheduler/appointment/popup';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture`Appointment Form: Recurrence Form`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const openAppointmentPopup = async (
  t: TestController,
  appointment: any,
  isRecurringAppointment: boolean,
): Promise<AppointmentPopup> => {
  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  if (isRecurringAppointment) {
    await t.click(Scheduler.getEditRecurrenceDialog().series);
  }

  return scheduler.appointmentPopup;
};

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('daily frequency with repeat end never', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Daily Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Daily');
  await appointmentPopup.setRecurrenceEnd(t, 'never');

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__daily__repeat-end-never.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('daily frequency with repeat end until', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Daily Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Daily');
  await appointmentPopup.setRecurrenceEnd(t, 'until', '12/31/2024');

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__daily__repeat-end-until.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('daily frequency with repeat end count', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Daily Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Daily');
  await appointmentPopup.setRecurrenceEnd(t, 'count', 10);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__daily__repeat-end-count.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('weekly frequency with days mon-wed-fri', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Weekly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Weekly');
  await appointmentPopup.selectRecurrenceWeekDays(t, [0, 2, 4]);
  await appointmentPopup.setRecurrenceEnd(t, 'count', 15);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__weekly__mon-wed-fri.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
    firstDayOfWeek: 1,
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('weekly frequency with days weekend', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Weekly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Weekly');
  await appointmentPopup.selectRecurrenceWeekDays(t, [5, 6]);
  await appointmentPopup.setRecurrenceEnd(t, 'count', 15);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__weekly__weekend.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
    firstDayOfWeek: 1,
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('weekly frequency with interval 2', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Weekly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Weekly');
  await appointmentPopup.setRecurrenceInterval(t, 2);
  await appointmentPopup.selectRecurrenceWeekDays(t, [1, 5]);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__weekly__interval-2.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('weekly frequency with interval 5', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Weekly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Weekly');
  await appointmentPopup.setRecurrenceInterval(t, 5);
  await appointmentPopup.selectRecurrenceWeekDays(t, [1, 5]);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__weekly__interval-5.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('monthly frequency with day 1', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Monthly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Monthly');
  await appointmentPopup.setRecurrenceMonthDay(t, 1);
  await appointmentPopup.setRecurrenceEnd(t, 'count', 12);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__monthly__day-1.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('monthly frequency with day 15', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Monthly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Monthly');
  await appointmentPopup.setRecurrenceMonthDay(t, 15);
  await appointmentPopup.setRecurrenceEnd(t, 'count', 12);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__monthly__day-15.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('yearly frequency with jan-1', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Yearly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Yearly');
  await appointmentPopup.setRecurrenceYearlyDate(t, 'January', 1);
  await appointmentPopup.setRecurrenceEnd(t, 'until', '01/01/2030');

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__yearly__jan-1.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

// TODO: fix this test
test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('yearly frequency with dec-31', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Yearly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Yearly');
  await appointmentPopup.setRecurrenceYearlyDate(t, 'December', 31);
  await appointmentPopup.setRecurrenceEnd(t, 'until', '01/01/2030');

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__yearly__dec-31.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('hourly frequency', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Hourly Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Hourly');
  await appointmentPopup.setRecurrenceInterval(t, 2);
  await appointmentPopup.setRecurrenceEnd(t, 'count', 20);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__hourly.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('editing existing recurrence rule', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Existing Recurrent',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=1',
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await t.click(Scheduler.getEditRecurrenceDialog().series);
  await appointmentPopup.openRecurrenceSettings(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__editing-existing.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  return createWidget('dxScheduler', {
    dataSource: [{
      text: 'Existing Recurrent',
      startDate: new Date('2024-01-01T10:00:00'),
      endDate: new Date('2024-01-01T11:00:00'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=1',
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('recurrence form with icons', async (t) => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/29');
  })();

  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    assigneeId: [1, 2],
    roomId: 1,
    priorityId: 1,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=1',
  };

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointmentPopup = await openAppointmentPopup(t, appointment, true);
  await appointmentPopup.openRecurrenceSettings(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__recurrence-form__with-icons.png',
    { element: appointmentPopup.contentElement },
  );
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 25),
  editing: {
    form: {
      iconsShowMode: 'both',
    },
  },
})).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('recurrence settings opened in readonly mode', async (t) => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/29');
  })();

  const appointment = {
    text: 'Readonly Recurrent Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
  };

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointmentPopup = await openAppointmentPopup(t, appointment, false);
  await appointmentPopup.openRecurrenceSettings(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__recurrence-form__readonly-mode.png',
    { element: appointmentPopup.recurrence.group },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2024, 0, 1),
  editing: {
    allowUpdating: false,
  },
})).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});
