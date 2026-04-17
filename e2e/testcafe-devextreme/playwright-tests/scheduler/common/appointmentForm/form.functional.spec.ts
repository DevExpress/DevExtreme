import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage } from '../../../../playwright-helpers';
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

const clickRecurrenceSettingsButton = async (page: any) => {
  await page.locator('.dx-recurrence-editor .dx-button').click();
};

const roughEqualClientBoundingRect = (
  a: { width: number; height: number; top: number; left: number },
  b: { width: number; height: number; top: number; left: number },
): boolean => (
  Math.abs(a.width - b.width) < 1
  && Math.abs(a.height - b.height) < 1
  && Math.abs(a.top - b.top) < 1
  && Math.abs(a.left - b.left) < 1
);

test.describe('Appointment Form: Functional', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Subject text editor should have focus after returning from recurrence form', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    };

    await openAppointmentPopup(page, appointment, true);
    await clickRecurrenceSettingsButton(page);

    await page.locator('.dx-recurrence-back-button').click();

    const textInput = page.locator('.dx-scheduler-appointment-popup .dx-texteditor-input').first();
    await expect(textInput).toBeFocused();
  });

  test('Recurrence start date editor should have focus after opening recurrence settings', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    };

    await openAppointmentPopup(page, appointment, true);
    await clickRecurrenceSettingsButton(page);

    const startDateInput = page.locator('.dx-recurrence-editor .dx-datebox .dx-texteditor-input').first();
    await expect(startDateInput).toBeFocused();
  });

  test('Popup should not change dimensions when switching groups and recurrence group height is larger', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      editing: {
        form: {
          items: [
            {
              name: 'mainGroup',
              items: ['repeatGroup'],
            },
            'recurrenceGroup',
          ],
        },
      },
    });

    await openAppointmentPopup(page);
    const contentElement = page.locator('.dx-popup-content');
    const boundingClientRect1 = await contentElement.boundingBox();

    await page.evaluate((sel) => {
      const instance = ($(sel) as any).dxScheduler('instance');
      const popup = instance.getAppointmentPopup();
      const form = popup.$content().find('.dx-form').dxForm('instance');
      const repeatEditor = form.getEditor('recurrenceRule');
      repeatEditor.option('value', 'FREQ=WEEKLY');
    }, SCHEDULER_SELECTOR);

    const boundingClientRect2 = await contentElement.boundingBox();

    await page.locator('.dx-recurrence-back-button').click();
    const boundingClientRect3 = await contentElement.boundingBox();

    expect(roughEqualClientBoundingRect(boundingClientRect1!, boundingClientRect2!)).toBe(true);
    expect(roughEqualClientBoundingRect(boundingClientRect1!, boundingClientRect3!)).toBe(true);
  });

  test('Popup should not change dimensions when switching groups and main group height is larger', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      editing: {
        form: {
          items: [
            'mainGroup',
            {
              name: 'recurrenceGroup',
              items: ['recurrenceStartDateGroup'],
            },
          ],
        },
      },
    });

    await openAppointmentPopup(page);
    const contentElement = page.locator('.dx-popup-content');
    const boundingClientRect1 = await contentElement.boundingBox();

    await page.evaluate((sel) => {
      const instance = ($(sel) as any).dxScheduler('instance');
      const popup = instance.getAppointmentPopup();
      const form = popup.$content().find('.dx-form').dxForm('instance');
      const repeatEditor = form.getEditor('recurrenceRule');
      repeatEditor.option('value', 'FREQ=WEEKLY');
    }, SCHEDULER_SELECTOR);

    const boundingClientRect2 = await contentElement.boundingBox();

    await page.locator('.dx-recurrence-back-button').click();
    const boundingClientRect3 = await contentElement.boundingBox();

    expect(roughEqualClientBoundingRect(boundingClientRect1!, boundingClientRect2!)).toBe(true);
    expect(roughEqualClientBoundingRect(boundingClientRect1!, boundingClientRect3!)).toBe(true);
  });
});
