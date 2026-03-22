import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const SCHEDULER_SELECTOR = '#container';

const openAppointmentPopup = async (page: any, appointment?: any, isRecurring = false) => {
  await page.evaluate(({ appt, recurring, sel }) => {
    const instance = ($(sel) as any).dxScheduler('instance');
    instance.showAppointmentPopup(appt, !appt, recurring);
  }, { appt: appointment, recurring: isRecurring, sel: SCHEDULER_SELECTOR });
  await page.locator('.dx-scheduler-appointment-popup').waitFor({ state: 'visible' });
};

const selectRepeatValue = async (page: any, frequency: string) => {
  await page.evaluate(({ sel, freq }) => {
    const instance = ($(sel) as any).dxScheduler('instance');
    const popup = instance.getAppointmentPopup();
    const form = popup.$content().find('.dx-form').dxForm('instance');
    const repeatEditor = form.getEditor('recurrenceRule');
    const freqMap: Record<string, string> = {
      Hourly: 'FREQ=HOURLY',
      Daily: 'FREQ=DAILY',
      Weekly: 'FREQ=WEEKLY',
      Monthly: 'FREQ=MONTHLY',
      Yearly: 'FREQ=YEARLY',
    };
    repeatEditor.option('value', freqMap[freq] || freq);
  }, { sel: SCHEDULER_SELECTOR, freq: frequency });
};

const clickRecurrenceSettingsButton = async (page: any) => {
  await page.locator('.dx-recurrence-editor .dx-button').click();
};

test.describe('Appointment Form: Recurrence Form', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
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

      await openAppointmentPopup(page, appointment, false);
      await selectRepeatValue(page, frequency);

      await testScreenshot(
        page,
        `scheduler__appointment__recurrence-form__${frequency.toLowerCase()}.png`,
        { element: page.locator('.dx-popup-content') },
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

    await openAppointmentPopup(page, appointment, true);
    await clickRecurrenceSettingsButton(page);

    await testScreenshot(
      page,
      'scheduler__appointment__recurrence-form__with-icons.png',
      { element: page.locator('.dx-popup-content') },
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

    await openAppointmentPopup(page, appointment, false);
    await clickRecurrenceSettingsButton(page);

    await testScreenshot(
      page,
      'scheduler__appointment__recurrence-form__readonly.png',
      { element: page.locator('.dx-popup-content') },
    );
  });

  test('recurrence form on mobile screen', async ({ page }) => {
    await page.setViewportSize({ width: 450, height: 1000 });

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

    await openAppointmentPopup(page, undefined, false);
    await selectRepeatValue(page, 'Weekly');

    await testScreenshot(
      page,
      'scheduler__appointment__recurrence-form__mobile.png',
    );
  });

  test('recurrence form with labelMode=static', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 1500 });

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

    await openAppointmentPopup(page, appointment, true);
    await clickRecurrenceSettingsButton(page);

    await testScreenshot(
      page,
      'scheduler__appointment__recurrence-form__with-labelMode-static.png',
      { element: page.locator('.dx-popup-content') },
    );
  });
});
