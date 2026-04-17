import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, Scheduler } from '../../../playwright-helpers';

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

  const createSchedulerWidget = async (page, data): Promise<void> => {
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

  test('Recurrence appointments should be deleted by click on \'delete\' button', async ({ page }) => {
    await createSchedulerWidget(page, createRecurrenceData());
    const scheduler = new Scheduler(page, '#container');

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(6);

    await scheduler.getAppointment('Text', 3).element.click();

    await expect(scheduler.appointmentTooltip.element).toBeVisible();
    await scheduler.appointmentTooltip.deleteButton.click();
    const dialog = scheduler.getDeleteRecurrenceDialog();
    await dialog.appointment.click();
    await page.waitForTimeout(100);

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(5);

    await scheduler.getAppointment('Text', 3).element.click();
    await scheduler.appointmentTooltip.deleteButton.click();
    const dialog2 = scheduler.getDeleteRecurrenceDialog();
    await dialog2.series.click();

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(0);
  });

  test('Recurrence appointments should be deleted by press \'delete\' key', async ({ page }) => {
    await createSchedulerWidget(page, createRecurrenceData());
    const scheduler = new Scheduler(page, '#container');

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(6);

    await scheduler.getAppointment('Text', 3).element.click();
    await page.keyboard.press('Delete');
    const dialog = scheduler.getDeleteRecurrenceDialog();
    await dialog.appointment.click();
    await page.waitForTimeout(100);

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(5);

    await scheduler.getAppointment('Text', 3).element.click();
    await page.keyboard.press('Delete');
    const dialog2 = scheduler.getDeleteRecurrenceDialog();
    await dialog2.series.click();

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(0);
  });

  test('Common appointments should be deleted by click on \'delete\' button and press \'delete\' key', async ({ page }) => {
    await createSchedulerWidget(page, createSimpleData());
    const scheduler = new Scheduler(page, '#container');

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(2);

    await scheduler.getAppointment('Text').element.click();
    await scheduler.appointmentTooltip.deleteButton.click();

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(1);

    await scheduler.getAppointment('Text2').element.click();
    await page.keyboard.press('Delete');

    await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(0);
  });
});
