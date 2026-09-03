import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { appendElementTo } from '../../../../helpers/domUtils';
import Scheduler from '../../../../models/scheduler';

const PARENT_SELECTOR = '#parentContainer';
const SCHEDULER_SELECTOR = '#container';
const BOTTOM_BTN_ID = 'bottom-btn';
const BOTTOM_BTN_SELECTOR = `#${BOTTOM_BTN_ID}`;

[
  'day',
  'week',
].forEach((currentView) => {
  test(`Should pass focus to the next elements after date table on Mac devices (view: ${currentView})`, async ({ page }) => {
    await appendElementTo(page, PARENT_SELECTOR, 'button', BOTTOM_BTN_ID);
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          startDate: '2024-01-01T01:00:00',
          endDate: '2024-01-01T02:00:00',
          text: 'Usual',
        },
        // NOTE: This case is reproduced only if view has allDay appointment
        {
          startDate: '2024-01-01T01:00:00',
          endDate: '2024-01-01T02:00:00',
          text: 'All-day',
          allDay: true,
        },
      ],
      // NOTE: Scheduler should have a height limit for enabling native scroll container
      height: 300,
      currentDate: '2024-01-01',
      currentView,
    });

    // The native scrollable is what puts the extra tab stop in the way, so the test asks for it.
    await page.evaluate((selector) => {
      ($(selector) as any)
        .dxScheduler('instance')
        .getWorkSpaceScrollable()
        .option('useNative', true);
    }, SCHEDULER_SELECTOR);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('All-day').element.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await expect(page.locator(BOTTOM_BTN_SELECTOR)).toBeFocused();
  });
});
