import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Appointment Form: Recurrence Form`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const theme = 'generic.light';

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])(`daily frequency with repeat end never (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__daily__repeat-end-never(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`daily frequency with repeat end until (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__daily__repeat-end-until(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`daily frequency with repeat end count (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__daily__repeat-end-count(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`weekly frequency with days mon-wed-fri (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__weekly__mon-wed-fri(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`weekly frequency with days weekend (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__weekly__weekend(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`weekly frequency with interval 2 (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__weekly__interval-2(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`weekly frequency with interval 5 (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__weekly__interval-5(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`monthly frequency with day 1 (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__monthly__day-1(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`monthly frequency with day 15 (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__monthly__day-15(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`yearly frequency with jan-1 (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__yearly__jan-1(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`yearly frequency with dec-31 (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__yearly__dec-31(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`hourly frequency (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__hourly(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
])(`editing existing recurrence rule (${theme})`, async (t) => {
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

  await takeScreenshot(
    `scheduler__recurrence-form__editing-existing(theme=${theme})`,
    appointmentPopup.recurrence.group,
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
