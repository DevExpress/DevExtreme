import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Delete appointments', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const createRecurrenceData = (): Record<string, unknown>[] => [{
  Text: 'Text',
  StartDate: new Date(2017, 4, 22, 1, 30, 0, 0),
  EndDate: new Date(2017, 4, 22, 2, 30, 0, 0),
  RecurrenceRule: 'FREQ=DAILY',
}];

const createScheduler = async (data): Promise<void> => {
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

const createSimpleData = (): Record<string, unknown>[] => [{
  Text: 'Text',
  StartDate: new Date(2017, 4, 22, 1, 30, 0, 0),
  EndDate: new Date(2017, 4, 22, 2, 30, 0, 0),
}, {
  Text: 'Text2',
  StartDate: new Date(2017, 4, 22, 12, 0, 0, 0),
  EndDate: new Date(2017, 4, 22, 13, 0, 0, 0),
}];

test.meta({ unstable: true })('Recurrence appointments should be deleted by click on \'delete\' button', async (t) => {
  // Scheduler on '#container'

  expect(page.locator('.dx-scheduler-appointment').count()).toBe(6)
    .click(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).element)

    .expect(scheduler.appointmentTooltip.element.exists)
    .ok()
    .click(scheduler.appointmentTooltip.deleteButton)
    .click(Scheduler.getDeleteRecurrenceDialog().appointment)
    .wait(100)

    .expect(page.locator('.dx-scheduler-appointment').count())
    .eql(5);

  await (page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).click().element)

    .click(scheduler.appointmentTooltip.deleteButton)
    .click(Scheduler.getDeleteRecurrenceDialog().series)

    .expect(page.locator('.dx-scheduler-appointment').count())
    .eql(0);
}).before(async () => createScheduler(createRecurrenceData()));

test.meta({ unstable: true })('Recurrence appointments should be deleted by press \'delete\' key', async (t) => {
  // Scheduler on '#container'

  expect(page.locator('.dx-scheduler-appointment').count()).toBe(6)
    .click(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).element)
    .pressKey('delete')
    .click(Scheduler.getDeleteRecurrenceDialog().appointment)
    .wait(100)
    .expect(page.locator('.dx-scheduler-appointment').count())
    .eql(5);

  await (page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).click().element)
    .pressKey('delete')
    .click(Scheduler.getDeleteRecurrenceDialog().series)
    .expect(page.locator('.dx-scheduler-appointment').count())
    .eql(0);
}).before(async () => createScheduler(createRecurrenceData()));

test('Common appointments should be deleted by click on \'delete\' button and press \'delete\' key', async ({ page }) => {
  // Scheduler on '#container'

  expect(page.locator('.dx-scheduler-appointment').count()).toBe(2)
    .click(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).element)
    .click(scheduler.appointmentTooltip.deleteButton)
    .expect(page.locator('.dx-scheduler-appointment').count())
    .eql(1);

  expect(page.locator('.dx-scheduler-appointment').count()).toBe(1)
    .click(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text2' }).element)
    .pressKey('delete')
    .expect(page.locator('.dx-scheduler-appointment').count())
    .eql(0);
}).before(async () => createScheduler(createSimpleData()));
});
