import { test, expect } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: Layout Customization: Cell Sizes CSS classes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const HORIZONTAL_SIZE_CLASSNAME = 'dx-scheduler-cell-sizes-horizontal';
  const VERTICAL_SIZE_CLASSNAME = 'dx-scheduler-cell-sizes-vertical';
  const CELL_SIZE_CSS = `
#container .${HORIZONTAL_SIZE_CLASSNAME} { width: 300px; }
#container .${VERTICAL_SIZE_CLASSNAME} { height: 300px; }
`;

  const cases = [
    { views: ['day'], crossScrollingEnabled: false, expected: { width: 'skipCheck', height: 300, hasHorizontalClass: false, hasVerticalClass: true } },
    { views: ['day'], crossScrollingEnabled: true, expected: { width: 'skipCheck', height: 300, hasHorizontalClass: true, hasVerticalClass: true } },
    { views: ['week', 'workWeek', 'month'], crossScrollingEnabled: false, expected: { width: 'skipCheck', height: 300, hasHorizontalClass: false, hasVerticalClass: true } },
    { views: ['week', 'workWeek', 'month'], crossScrollingEnabled: true, expected: { width: 300, height: 300, hasHorizontalClass: true, hasVerticalClass: true } },
    { views: ['timelineDay', 'timelineWeek', 'timelineMonth'], crossScrollingEnabled: false, expected: { width: 300, height: 300, hasHorizontalClass: true, hasVerticalClass: true } },
    { views: ['timelineDay', 'timelineWeek', 'timelineMonth'], crossScrollingEnabled: true, expected: { width: 300, height: 300, hasHorizontalClass: true, hasVerticalClass: true } },
  ];

  cases.forEach(({ views, expected, crossScrollingEnabled }) => {
    views.forEach((view) => {
      test.skip(`Cells should have correct sizes and css classes (view:${view}, crossScrolling:${crossScrollingEnabled})`, async ({ page }) => {
        await insertStylesheetRulesToPage(page, CELL_SIZE_CSS);
        await createWidget(page, 'dxScheduler', {
          dataSource: [],
          currentView: view,
          currentDate: '2024-01-01',
          crossScrollingEnabled,
        });

        const cell = page.locator('.dx-scheduler-date-table-cell').first();
        const box = await cell.boundingBox();
        const hasHorizontalClass = await cell.evaluate(
          (el, cls) => el.classList.contains(cls), HORIZONTAL_SIZE_CLASSNAME,
        );
        const hasVerticalClass = await cell.evaluate(
          (el, cls) => el.classList.contains(cls), VERTICAL_SIZE_CLASSNAME,
        );

        if (typeof expected.width === 'number' && box) {
          expect(box.width).toBe(expected.width);
        }
        if (box) {
          expect(box.height).toBe(expected.height);
        }
        expect(hasHorizontalClass).toBe(expected.hasHorizontalClass);
        expect(hasVerticalClass).toBe(expected.hasVerticalClass);
      });
    });
  });
});
