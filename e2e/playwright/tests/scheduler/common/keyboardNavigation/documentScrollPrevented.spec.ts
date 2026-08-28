import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const getDocumentScrollTop = async (page: Page): Promise<number> => page.evaluate(
  () => document.documentElement.scrollTop || document.body.scrollTop,
);

const createScheduler = async (page: Page): Promise<void> => {
  // The page is made taller than the viewport on purpose: without something to scroll, the test
  // could not tell whether the key press was swallowed by the widget.
  await page.evaluate(() => { document.body.style.height = '2000px'; });

  await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      },
      {
        text: 'Appointment 2',
        startDate: new Date(2015, 1, 9, 10),
        endDate: new Date(2015, 1, 9, 11),
      },
      {
        text: 'Appointment 3',
        startDate: new Date(2015, 1, 9, 12),
        endDate: new Date(2015, 1, 9, 13),
      },
    ],
    height: 300,
    currentView: 'day',
    currentDate: new Date(2015, 1, 9),
  });
};

test('Document should not scroll on \'End\' press when appointment is focused', async ({ page }) => {
  await createScheduler(page);

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await scheduler.getAppointment('Appointment 1').element.click();

  const expectedScrollTop = await getDocumentScrollTop(page);

  await page.keyboard.press('End');

  expect(await getDocumentScrollTop(page)).toBe(expectedScrollTop);
});

test('Document should not scroll on \'Home\' press when appointment is focused', async ({ page }) => {
  await createScheduler(page);

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await page.evaluate(() => { window.scrollTo(0, 100); });
  await scheduler.getAppointment('Appointment 1').element.click();

  const expectedScrollTop = await getDocumentScrollTop(page);

  await page.keyboard.press('Home');

  expect(await getDocumentScrollTop(page)).toBe(expectedScrollTop);
});
