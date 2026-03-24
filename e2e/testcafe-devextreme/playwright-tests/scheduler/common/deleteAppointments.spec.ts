import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('Delete appointments', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  const createRecurrenceData = (): Record<string, unknown>[] => [{
    Text: 'Text',
    StartDate: new Date(2017, 4, 22, 1, 30, 0, 0),
    EndDate: new Date(2017, 4, 22, 2, 30, 0, 0),
    RecurrenceRule: 'FREQ=DAILY',
  }];

  const createSimpleData = (): Record<string, unknown>[] => [{
    Text: 'Text',
    StartDate: new Date(2017, 4, 22, 1, 30, 0, 0),
    EndDate: new Date(2017, 4, 22, 2, 30, 0, 0),
  }, {
    Text: 'Text2',
    StartDate: new Date(2017, 4, 22, 12, 0, 0, 0),
    EndDate: new Date(2017, 4, 22, 13, 0, 0, 0),
  }];

  const createScheduler = async (page, data): Promise<void> => {
    await createWidget(page, 'dxScheduler', {
      dataSource: data,
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2017, 4, 22),
      textExpr: 'Text',
      startDateExpr: 'StartDate',
      endDateExpr: 'EndDate',
      allDayExpr: 'AllDay',
      recurrenceRuleExpr: 'RecurrenceRule',
      recurrenceExceptionExpr: 'RecurrenceException',
    });
  };

  // TODO: needs Scheduler page object (getDeleteRecurrenceDialog, appointmentTooltip)
  test.skip('Recurrence appointments should be deleted by click on \'delete\' button', async ({ page }) => {
    await createScheduler(page, createRecurrenceData());

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(6);

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).first().click();
    await page.locator('.dx-tooltip-appointment-item-delete-button').first().click();
    await page.locator('.dx-dialog').locator('.dx-dialog-button').first().click();
    await page.waitForTimeout(100);

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(5);

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).first().click();
    await page.locator('.dx-tooltip-appointment-item-delete-button').first().click();
    await page.locator('.dx-dialog').locator('.dx-dialog-button').last().click();

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(0);
  });

  // TODO: needs Scheduler page object (getDeleteRecurrenceDialog)
  test.skip('Recurrence appointments should be deleted by press \'delete\' key', async ({ page }) => {
    await createScheduler(page, createRecurrenceData());

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(6);

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).first().click();
    await page.keyboard.press('Delete');
    await page.locator('.dx-dialog').locator('.dx-dialog-button').first().click();
    await page.waitForTimeout(100);

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(5);

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).first().click();
    await page.keyboard.press('Delete');
    await page.locator('.dx-dialog').locator('.dx-dialog-button').last().click();

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(0);
  });

  test('Common appointments should be deleted by click on \'delete\' button and press \'delete\' key', async ({ page }) => {
    await createScheduler(page, createSimpleData());

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(2);

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).first().click();
    await page.locator('.dx-tooltip-appointment-item-delete-button').first().click();

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(1);

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text2' }).first().click();
    await page.keyboard.press('Delete');

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(0);
  });
});
