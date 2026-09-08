import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const buttons = Array.from({ length: 12 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

[true, false].forEach((multiline) => {
  test(`Scheduler [multiline=${multiline}] toolbar`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['day', 'week', 'workWeek', 'month'],
      currentView: 'workWeek',
      currentDate: new Date(2021, 3, 27),
      height: 200,
      toolbar: {
        multiline,
        items: [
          'dateNavigator',
          ...buttons,
          'viewSwitcher',
        ],
      },
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      `scheduler-multiline-${multiline}-toolbar.png`,
      { element: scheduler.toolbar.element },
    );
  });
});
