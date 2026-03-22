import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const TEST_TITLE = 'Test';

test.describe('Appointment form: expressions', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('text: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: '2023-12-10',
      cellDuration: 240,
      dataSource: [{
        textCustom: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      textExpr: 'textCustom',
      editing: { legacyForm: true },
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await expect(appointment.first()).toBeVisible();

    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const subjectInput = popup.locator('.dx-texteditor-input').first();
    const value = await subjectInput.inputValue();
    expect(value).toBe(TEST_TITLE);
  });

  test('text: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: '2023-12-10',
      cellDuration: 240,
      dataSource: [{
        nested: { textCustom: TEST_TITLE },
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      textExpr: 'nested.textCustom',
      editing: { legacyForm: true },
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const subjectInput = popup.locator('.dx-texteditor-input').first();
    const value = await subjectInput.inputValue();
    expect(value).toBe(TEST_TITLE);
  });

  test('Appointment popup should has correct width when the nested recurrenceRuleExpr option is set', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        text: TEST_TITLE,
        nestedA: { nestedB: { nestedC: { recurrenceRuleCustom: 'FREQ=DAILY' } } },
      }],
      currentDate: '2023-12-10',
      cellDuration: 240,
      recurrenceEditMode: 'series',
      recurrenceRuleExpr: 'nestedA.nestedB.nestedC.recurrenceRuleCustom',
      editing: { legacyForm: true },
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const form = popup.locator('.dx-scheduler-form');
    await expect(form).toBeVisible();

    const content = popup.locator('.dx-popup-content');
    await testScreenshot(page, 'form_recurrence-editor-first-opening_nested-expr.png', { element: content });
  });
});
