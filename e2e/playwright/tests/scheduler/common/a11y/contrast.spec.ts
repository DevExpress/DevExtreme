import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

test.describe('a11y - contrast', () => {
  // visual: generic.light
  // visual: generic.dark
  // visual: fluent.light
  // visual: fluent.dark
  test('Scheduler a11y: Insufficient contrast of day numbers in the MonthView', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'month',
      currentDate: new Date(2020, 10, 25),
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await testScreenshot(page, 'month_day_number_contrast.png', { element: scheduler.element });
  });
});
