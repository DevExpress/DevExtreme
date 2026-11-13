import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const indicatorTime = new Date(2023, 3, 27);

test.describe('Scheduler header today button', () => {
  test('Scheduler today button should works', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 3, 27),
      toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.toolbar.todayButton.click();

    const currentDate = await scheduler.option('currentDate') as Date;
    const today = new Date();

    currentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    expect(currentDate).toEqual(today);
  });

  test('Scheduler today button should use indicatorTime', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 3, 27),
      indicatorTime,
      toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.toolbar.todayButton.click();

    await expect.poll(() => scheduler.option('currentDate')).toEqual(indicatorTime);
  });
});
