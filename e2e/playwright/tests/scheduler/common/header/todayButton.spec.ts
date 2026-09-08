import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const indicatorTime = new Date(2023, 3, 27);

test('Scheduler today button should works', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2021, 3, 27),
    toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.toolbar.todayButton.click();

  // "Today" is the day the browser context is in, and it need not be the day this process is in,
  // so both sides of the comparison are taken from the page.
  await expect
    .poll(async () => scheduler.element.evaluate((element) => {
      const startOfDay = (date: Date): number => new Date(date).setHours(0, 0, 0, 0);
      const currentDate = $(element).data('dxScheduler').option('currentDate') as Date;

      return startOfDay(currentDate) === startOfDay(new Date());
    }))
    .toBe(true);
});

test('Scheduler today button should use indicatorTime', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2021, 3, 27),
    indicatorTime,
    toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.toolbar.todayButton.click();

  await expect
    .poll(async () => scheduler.element.evaluate(
      (element) => ($(element).data('dxScheduler').option('currentDate') as Date).getTime(),
    ))
    .toBe(indicatorTime.getTime());
});
