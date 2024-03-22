import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Appointment form: expressions`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const TEST_TITLE = 'Test';
const TEST_DESCRIPTION = 'Test description...';

const getDataSourceValues = ClientFunction(() => ($(SCHEDULER_SELECTOR) as any)
  .dxScheduler('instance')
  .option('dataSource'), { dependencies: { SCHEDULER_SELECTOR } });

// tests config
// common
const TEXT_TEST_CASES = {
  editor: 'text',
  errorMessage: 'appointment\'s text incorrect',
  getValue: async (scheduler: Scheduler) => scheduler.appointmentPopup.subjectElement().value,
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => t
    .typeText(scheduler.appointmentPopup.subjectElement, value, { replace: true }),
  setTestValue: '???',
  expectedValue: TEST_TITLE,
  cases: [
    {
      name: 'expression should work',
      options: {
        dataSource: [{
          textCustom: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
        }],
        textExpr: 'textCustom',
      },
    },
    {
      name: 'nested expression should work',
      options: {
        dataSource: [{
          nested: {
            textCustom: TEST_TITLE,
          },
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
        }],
        textExpr: 'nested.textCustom',
      },
    },
    {
      name: 'deep nested expression should work',
      options: {
        dataSource: [{
          nestedA: {
            nestedB: {
              nestedC: {
                textCustom: TEST_TITLE,
              },
            },
          },
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
        }],
        textExpr: 'nestedA.nestedB.nestedC.textCustom',
      },
    },
  ],
};
const DESCRIPTION_TEST_CASES = {
  editor: 'description',
  errorMessage: 'appointment\'s description incorrect',
  getValue: async (scheduler: Scheduler) => scheduler.appointmentPopup.descriptionElement().value,
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => t
    .typeText(scheduler.appointmentPopup.descriptionElement, value, { replace: true }),
  setTestValue: '???',
  expectedValue: TEST_DESCRIPTION,
  cases: [
    {
      name: 'expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          descriptionCustom: TEST_DESCRIPTION,
        }],
        descriptionExpr: 'descriptionCustom',
      },
    },
    {
      name: 'nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nested: {
            descriptionCustom: TEST_DESCRIPTION,
          },
        }],
        descriptionExpr: 'nested.descriptionCustom',
      },
    },
    {
      name: 'deep nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nestedA: {
            nestedB: {
              nestedC: {
                descriptionCustom: TEST_DESCRIPTION,
              },
            },
          },
        }],
        descriptionExpr: 'nestedA.nestedB.nestedC.descriptionCustom',
      },
    },
  ],
};
const START_DATE_TEST_CASES = {
  editor: 'startDate',
  errorMessage: 'appointment\'s startDate incorrect',
  getValue: async (scheduler: Scheduler) => scheduler.appointmentPopup.startDateElement().value,
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => t
    .typeText(scheduler.appointmentPopup.startDateElement, value, { replace: true }),
  setTestValue: '10/10/2020, 01:00 AM',
  expectedValue: '12/10/2023, 10:00 AM',
  cases: [
    {
      name: 'expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDateCustom: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
        }],
        startDateExpr: 'startDateCustom',
      },
    },
    {
      name: 'nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          endDate: '2023-12-10T14:00:00',
          nested: {
            startDateCustom: '2023-12-10T10:00:00',
          },
        }],
        startDateExpr: 'nested.startDateCustom',
      },
    },
    {
      name: 'deep nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          endDate: '2023-12-10T14:00:00',
          nestedA: {
            nestedB: {
              nestedC: {
                startDateCustom: '2023-12-10T10:00:00',
              },
            },
          },
        }],
        startDateExpr: 'nestedA.nestedB.nestedC.startDateCustom',
      },
    },
  ],
};
const END_DATE_TEST_CASES = {
  editor: 'endDate',
  errorMessage: 'appointment\'s endDate incorrect',
  getValue: async (scheduler: Scheduler) => scheduler.appointmentPopup.endDateElement().value,
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => t
    .typeText(scheduler.appointmentPopup.endDateElement, value, { replace: true }),
  setTestValue: '10/10/2020, 01:00 AM',
  expectedValue: '12/10/2023, 2:00 PM',
  cases: [
    {
      name: 'expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDateCustom: '2023-12-10T14:00:00',
        }],
        endDateExpr: 'endDateCustom',
      },
    },
    {
      name: 'nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          nested: {
            endDateCustom: '2023-12-10T14:00:00',
          },
        }],
        endDateExpr: 'nested.endDateCustom',
      },
    },
    {
      name: 'deep nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          nestedA: {
            nestedB: {
              nestedC: {
                endDateCustom: '2023-12-10T14:00:00',
              },
            },
          },
        }],
        endDateExpr: 'nestedA.nestedB.nestedC.endDateCustom',
      },
    },
  ],
};
const ALL_DAY_TEST_CASES = {
  editor: 'allDay',
  errorMessage: 'appointment\'s allDay incorrect',
  getValue: async (scheduler: Scheduler) => scheduler
    .appointmentPopup.getAllDaySwitchValue(),
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => {
    const currentValue = await scheduler.appointmentPopup.getAllDaySwitchValue();

    if (currentValue !== value) {
      await t.click(scheduler.appointmentPopup.allDayElement);
    }
  },
  setTestValue: 'false',
  expectedValue: 'true',
  cases: [
    {
      name: 'expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          allDayCustom: true,
        }],
        allDayExpr: 'allDayCustom',
      },
    },
    {
      name: 'nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nested: {
            allDayCustom: true,
          },
        }],
        allDayExpr: 'nested.allDayCustom',
      },
    },
    {
      name: 'deep nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nestedA: {
            nestedB: {
              nestedC: {
                allDayCustom: true,
              },
            },
          },
        }],
        allDayExpr: 'nestedA.nestedB.nestedC.allDayCustom',
      },
    },
  ],
};

// additional
const START_DATE_TIME_ZONE_TEST_CASES = {
  editor: 'startDateTimeZone',
  errorMessage: 'appointment\'s startDateTimeZone incorrect',
  getValue: async (scheduler: Scheduler) => scheduler
    .appointmentPopup.startDateTimeZoneElement().value,
  expectedValue: '(GMT -01:00) Etc - GMT+1',
  cases: [
    {
      name: 'expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          startDateTimeZoneCustom: 'Etc/GMT+1',
        }],
        editing: {
          allowTimeZoneEditing: true,
        },
        startDateTimeZoneExpr: 'startDateTimeZoneCustom',
      },
    },
    {
      name: 'nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nested: {
            startDateTimeZoneCustom: 'Etc/GMT+1',
          },
        }],
        editing: {
          allowTimeZoneEditing: true,
        },
        startDateTimeZoneExpr: 'nested.startDateTimeZoneCustom',
      },
    },
    {
      name: 'deep nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nestedA: {
            nestedB: {
              nestedC: {
                startDateTimeZoneCustom: 'Etc/GMT+1',
              },
            },
          },
        }],
        editing: {
          allowTimeZoneEditing: true,
        },
        startDateTimeZoneExpr: 'nestedA.nestedB.nestedC.startDateTimeZoneCustom',
      },
    },
  ],
};
const END_DATE_TIME_ZONE_TEST_CASES = {
  editor: 'endDateTimeZone',
  errorMessage: 'appointment\'s endDateTimeZone incorrect',
  getValue: async (scheduler: Scheduler) => scheduler
    .appointmentPopup.endDateTimeZoneElement().value,
  expectedValue: '(GMT -02:00) Etc - GMT+2',
  cases: [
    {
      name: 'expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          endDateTimeZoneCustom: 'Etc/GMT+2',
        }],
        editing: {
          allowTimeZoneEditing: true,
        },
        endDateTimeZoneExpr: 'endDateTimeZoneCustom',
      },
    },
    {
      name: 'nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nested: {
            endDateTimeZoneCustom: 'Etc/GMT+2',
          },
        }],
        editing: {
          allowTimeZoneEditing: true,
        },
        endDateTimeZoneExpr: 'nested.endDateTimeZoneCustom',
      },
    },
    {
      name: 'deep nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nestedA: {
            nestedB: {
              nestedC: {
                endDateTimeZoneCustom: 'Etc/GMT+2',
              },
            },
          },
        }],
        editing: {
          allowTimeZoneEditing: true,
        },
        endDateTimeZoneExpr: 'nestedA.nestedB.nestedC.endDateTimeZoneCustom',
      },
    },
  ],
};
const RECURRENCE_RULE_TEST_CASES = {
  editor: 'recurrenceRule',
  errorMessage: 'appointment\'s recurrenceRule incorrect',
  getValue: async (scheduler: Scheduler) => scheduler
    .appointmentPopup.getRecurrenceRuleSwitchValue(),
  expectedValue: 'true',
  cases: [
    {
      name: 'expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          recurrenceRuleCustom: 'FREQ=DAILY',
        }],
        recurrenceEditMode: 'series',
        recurrenceRuleExpr: 'recurrenceRuleCustom',
      },
    },
    {
      name: 'nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nested: {
            recurrenceRuleCustom: 'FREQ=DAILY',
          },
        }],
        recurrenceEditMode: 'series',
        recurrenceRuleExpr: 'nested.recurrenceRuleCustom',
      },
    },
    {
      name: 'deep nested expression should work',
      options: {
        dataSource: [{
          text: TEST_TITLE,
          startDate: '2023-12-10T10:00:00',
          endDate: '2023-12-10T14:00:00',
          nestedA: {
            nestedB: {
              nestedC: {
                recurrenceRuleCustom: 'FREQ=DAILY',
              },
            },
          },
        }],
        recurrenceEditMode: 'series',
        recurrenceRuleExpr: 'nestedA.nestedB.nestedC.recurrenceRuleCustom',
      },
    },
  ],
};

[
  TEXT_TEST_CASES,
  DESCRIPTION_TEST_CASES,
  START_DATE_TEST_CASES,
  END_DATE_TEST_CASES,
  ALL_DAY_TEST_CASES,
  START_DATE_TIME_ZONE_TEST_CASES,
  END_DATE_TIME_ZONE_TEST_CASES,
  RECURRENCE_RULE_TEST_CASES,
].forEach(({
  editor,
  errorMessage,
  getValue,
  expectedValue,
  cases,
}) => {
  cases.forEach(({
    name,
    options,
  }) => {
    test(`${editor}: ${name}`, async (t) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(TEST_TITLE);

      await t.expect(appointment).ok(`appointment with title: ${TEST_TITLE} not found.`);

      await t.doubleClick(appointment.element);

      const value = await getValue(scheduler);

      await t.expect(value).eql(expectedValue, errorMessage);
    }).before(async () => {
      await createWidget('dxScheduler', {
        currentDate: '2023-12-10',
        cellDuration: 240,
        ...options,
      });
    }).after(async () => disposeWidget('dxScheduler'));
  });
});

// test cases
[
  TEXT_TEST_CASES,
  DESCRIPTION_TEST_CASES,
  START_DATE_TEST_CASES,
  END_DATE_TEST_CASES,
  ALL_DAY_TEST_CASES,
].forEach(({
  editor,
  setValue,
  setTestValue,
  cases,
}) => {
  cases.forEach(({
    name,
    options,
  }) => {
    test(`${editor}: ${name} should not mutate DataSource data directly`, async (t) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(TEST_TITLE);
      const expectedDataSource = options.dataSource;

      await t.expect(appointment).ok(`appointment with title: ${TEST_TITLE} not found.`);

      await t.doubleClick(appointment.element);
      await setValue(t, scheduler, setTestValue);
      await t.click(scheduler.appointmentPopup.cancelButton);

      const dataSource = await getDataSourceValues();

      await t.expect(dataSource).eql(expectedDataSource);
    }).before(async () => {
      await createWidget('dxScheduler', {
        currentDate: '2023-12-10',
        cellDuration: 240,
        ...options,
      });
    }).after(async () => disposeWidget('dxScheduler'));
  });
});

test(
  'Appointment popup should has correct width when the nested "recurrenceRuleExpr" option is set',
  async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(TEST_TITLE);

    await t.doubleClick(appointment.element);
    await t.expect(scheduler.appointmentPopup.form.exists).ok();

    await takeScreenshot(
      'form_recurrence-editor-first-opening_nested-expr.png',
      scheduler.appointmentPopup.form,
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  },
).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [
      {
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        text: TEST_TITLE,
        nestedA: {
          nestedB: {
            nestedC: {
              recurrenceRuleCustom: 'FREQ=DAILY',
            },
          },
        },
      },
    ],
    currentDate: '2023-12-10',
    cellDuration: 240,
    recurrenceEditMode: 'series',
    recurrenceRuleExpr: 'nestedA.nestedB.nestedC.recurrenceRuleCustom',
  });
}).after(async () => disposeWidget('dxScheduler'));
