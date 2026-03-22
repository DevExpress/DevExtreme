import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const SCHEDULER_SELECTOR = '#container';
const INITIAL_APPOINTMENT_TITLE = 'appointment';
const ADDITIONAL_TITLE_TEXT = '-updated';
const UPDATED_APPOINTMENT_TITLE = `${INITIAL_APPOINTMENT_TITLE}${ADDITIONAL_TITLE_TEXT}`;

test.describe('Appointment Editing', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Should correctly update appointment if dataSource is a simple array', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        id: 1,
        text: INITIAL_APPOINTMENT_TITLE,
        startDate: new Date(2021, 2, 29, 9, 30),
        endDate: new Date(2021, 2, 29, 11, 30),
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 2, 29),
      startDayHour: 9,
      endDayHour: 14,
      height: 600,
      editing: { legacyForm: true },
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: INITIAL_APPOINTMENT_TITLE });
    await appointment.dblclick();

    const subjectInput = page.locator('.dx-popup-wrapper .dx-textbox input').first();
    await subjectInput.click();
    await subjectInput.fill(UPDATED_APPOINTMENT_TITLE);

    const inputValue = await subjectInput.inputValue();
    expect(inputValue).toBe(UPDATED_APPOINTMENT_TITLE);

    await page.locator('.dx-popup-done').click();

    await expect(page.locator('.dx-scheduler-appointment').filter({ hasText: UPDATED_APPOINTMENT_TITLE })).toBeVisible();
  });

  test('Should correctly update appointment if dataSource is a Store with key array', async ({ page }) => {
    await page.evaluate(({ selector, title }) => {
      const $scheduler = ($(selector) as any);
      const devExpress = (window as any).DevExpress;

      $scheduler.dxScheduler({
        dataSource: new devExpress.data.DataSource({
          store: {
            type: 'array',
            key: 'id',
            data: [{
              id: 1,
              text: title,
              startDate: new Date(2021, 2, 29, 9, 30),
              endDate: new Date(2021, 2, 29, 11, 30),
            }],
          },
        }),
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2021, 2, 29),
        startDayHour: 9,
        endDayHour: 14,
        height: 600,
        editing: { legacyForm: true },
      }).dxScheduler('instance');
      devExpress.fx.off = true;
    }, { selector: SCHEDULER_SELECTOR, title: INITIAL_APPOINTMENT_TITLE });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: INITIAL_APPOINTMENT_TITLE });
    await appointment.dblclick();

    const subjectInput = page.locator('.dx-popup-wrapper .dx-textbox input').first();
    await subjectInput.click();
    await subjectInput.fill(UPDATED_APPOINTMENT_TITLE);

    const inputValue = await subjectInput.inputValue();
    expect(inputValue).toBe(UPDATED_APPOINTMENT_TITLE);

    await page.locator('.dx-popup-done').click();

    await expect(page.locator('.dx-scheduler-appointment').filter({ hasText: UPDATED_APPOINTMENT_TITLE })).toBeVisible();
  });

  test('Appointment EditForm screenshot', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        id: 1,
        text: INITIAL_APPOINTMENT_TITLE,
        startDate: new Date(2021, 2, 29, 9, 30),
        endDate: new Date(2021, 2, 29, 11, 30),
      }],
      editing: { legacyForm: true },
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 2, 29),
      startDayHour: 9,
      endDayHour: 14,
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: INITIAL_APPOINTMENT_TITLE });
    await appointment.dblclick();

    await testScreenshot(page, 'appointment-popup-screenshot.png', {
      element: appointment,
    });

    await expect(page.locator('.dx-popup-wrapper')).toBeVisible();
  });
});
