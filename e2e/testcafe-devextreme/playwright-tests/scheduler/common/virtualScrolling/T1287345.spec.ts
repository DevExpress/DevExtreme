import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage, insertStylesheetRulesToPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

async function scrollTo(page, x: number, y: number): Promise<void> {
  await page.evaluate(({ sx, sy }) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    const scrollable = instance.getWorkSpaceScrollable();
    scrollable.scrollTo({ y: sy, x: sx });
  }, { sx: x, sy: y });
}

test.describe.skip('Scheduler: Virtual scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    await setupTestPage(page, containerUrl);
  });

  test('Cell width set in css should be correct for virtual scrolling after scroll down (T1287345)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, `
      #container .dx-scheduler-cell-sizes-horizontal {
          width: 200px !important;
      }`);

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'week',
      scrolling: {
        mode: 'virtual',
      },
      currentDate: new Date(2021, 2, 28),
      height: 300,
    });

    await scrollTo(page, 0, 3000);

    const nextButton = page.locator('.dx-scheduler-navigator-next');
    await nextButton.click();

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, 'virtual_scroll_cell_width.png', { element: workSpace });
  });
});
