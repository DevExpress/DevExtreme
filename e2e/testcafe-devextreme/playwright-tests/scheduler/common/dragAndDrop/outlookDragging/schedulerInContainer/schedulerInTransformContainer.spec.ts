import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setStyleAttribute, appendElementTo } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Outlook dragging, for case scheduler in container with transform style', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

appendElementTo,
  setStyleAttribute,
} from '../../../../../../helpers/domUtils';

);

test('Dragging should be work right in case dxScheduler placed in container with transform style', async ({ page }) => {
  // --- setup ---
await setStyleAttribute(Selector('#container'), 'margin-top: 100px; margin-left: 100px; transform: translate(0px, 0px);');
  await appendElementTo('#container', 'div', 'scheduler');

  return createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Website Re-Design Plan',
      startDate: new Date(2021, 2, 24, 11),
      endDate: new Date(2021, 2, 24, 12),
    }],
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 2, 22),
    startDayHour: 9,
    height: 600,
    width: 800,
  }, '#scheduler');
  // --- test ---
// Scheduler on '#scheduler'

    const draggableAppointment = page.locator('.dx-scheduler-appointment').nth(0);

  await t
    .drag(draggableAppointment.element, 0, 120);

  await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-bottom.png');

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(0, -170) */;

  await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-top.png');

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(100, 0) */;

  await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-right.png');

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(-230, 0) */;

  await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-left.png');

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
