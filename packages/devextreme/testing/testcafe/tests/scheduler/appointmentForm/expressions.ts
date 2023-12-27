import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Appointment form: expressions`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const TEST_TITLE = 'Test';
const TEST_DESCRIPTION = 'Test description...';

// TODO Vinogradov: Create a separate "disposeWidget" helper function.
const disposeScheduler = async () => ClientFunction(() => {
  ($(SCHEDULER_SELECTOR) as any).dxScheduler('dispose');
}, { dependencies: { SCHEDULER_SELECTOR } })();

// General test cases
[
  // Text
  {
    editor: 'text',
    errorMessage: 'appointment\'s text incorrect',
    getValue: async (scheduler: Scheduler) => scheduler.appointmentPopup.subjectElement().value,
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
  },
  // Description
  {
    editor: 'description',
    errorMessage: 'appointment\'s description incorrect',
    getValue: async (scheduler: Scheduler) => scheduler.appointmentPopup.descriptionElement().value,
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
  },
  // startDate
  {
    editor: 'startDate',
    errorMessage: 'appointment\'s startDate incorrect',
    getValue: async (scheduler: Scheduler) => scheduler.appointmentPopup.startDateElement().value,
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
  },
  // endDate
  {
    editor: 'endDate',
    errorMessage: 'appointment\'s endDate incorrect',
    getValue: async (scheduler: Scheduler) => scheduler.appointmentPopup.endDateElement().value,
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
  },
  // startDateTimeZone
  {
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
  },
  // endDateTimeZone
  {
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
  },
  // allDay
  {
    editor: 'allDay',
    errorMessage: 'appointment\'s allDay incorrect',
    getValue: async (scheduler: Scheduler) => scheduler
      .appointmentPopup.getAllDaySwitchValue(),
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
  },
  // recurrenceRule
  {
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
  },
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
    }).after(async () => disposeScheduler());
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
}).after(async () => disposeScheduler());
