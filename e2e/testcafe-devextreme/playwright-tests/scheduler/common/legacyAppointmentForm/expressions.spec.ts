import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Appointment form: expressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

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
  getValue: async (scheduler: Scheduler) => scheduler.legacyAppointmentPopup.subjectElement().value,
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => t
    .typeText(scheduler.legacyAppointmentPopup.subjectElement, value, { replace: true }),
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
  getValue: async (scheduler: Scheduler) => scheduler
    .legacyAppointmentPopup.descriptionElement().value,
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => t
    .typeText(scheduler.legacyAppointmentPopup.descriptionElement, value, { replace: true }),
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
  getValue: async (scheduler: Scheduler) => scheduler
    .legacyAppointmentPopup.startDateElement().value,
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => t
    .typeText(scheduler.legacyAppointmentPopup.startDateElement, value, { replace: true }),
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
  getValue: async (scheduler: Scheduler) => scheduler.legacyAppointmentPopup.endDateElement().value,
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => t
    .typeText(scheduler.legacyAppointmentPopup.endDateElement, value, { replace: true }),
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
    .legacyAppointmentPopup.getAllDaySwitchValue(),
  setValue: async (t: TestController, scheduler: Scheduler, value: string) => {
    const currentValue = await scheduler.legacyAppointmentPopup.getAllDaySwitchValue();

    if (currentValue !== value) {
      await (scheduler.legacyAppointmentPopup.allDayElement).click();
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
  // eslint-disable-next-line @stylistic/max-len
  getValue: async (scheduler: Scheduler) => scheduler.legacyAppointmentPopup.startDateTimeZoneElement().value,
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
    .legacyAppointmentPopup.endDateTimeZoneElement().value,
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
    .legacyAppointmentPopup.getRecurrenceRuleSwitchValue(),
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
    test(`${editor}: ${name}`, async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
        currentDate: '2023-12-10',
        cellDuration: 240,
        ...options,
        editing: {
          legacyForm: true,
          ...options.editing,
        },
  // --- test ---
const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(TEST_TITLE);

      expect(appointment).ok(`appointment with title: ${TEST_TITLE} not found.`);

      await (appointment.element).dblclick();

      const value = await getValue(scheduler);

      expect(value).toBe(expectedValue, errorMessage);
});
    });
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
    test(`${editor}: ${name} should not mutate DataSource data directly`, async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
        currentDate: '2023-12-10',
        cellDuration: 240,
        ...options,
        editing: {
          legacyForm: true,
          ...options.editing,
        },
  // --- test ---
const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(TEST_TITLE);
      const expectedDataSource = options.dataSource;

      expect(appointment).ok(`appointment with title: ${TEST_TITLE} not found.`);

      await (appointment.element).dblclick();
      await setValue(t, scheduler, setTestValue);
      await (scheduler.legacyAppointmentPopup.cancelButton).click();

      const dataSource = await getDataSourceValues();

      expect(dataSource).toBe(expectedDataSource);
});
    });
  });
});

test(
  'Appointment popup should has correct width when the nested "recurrenceRuleExpr" option is set', async ({ page }) => {
        const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(TEST_TITLE);

    await (appointment.element).dblclick();
    expect(scheduler.legacyAppointmentPopup.form.exists).toBeTruthy();

    await testScreenshot(page,
      'form_recurrence-editor-first-opening_nested-expr.png',
      { element: scheduler.legacyAppointmentPopup.content },
    );

    expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  },
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxScheduler', {
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
    editing: {
      legacyForm: true,
    },
  });
});
});
