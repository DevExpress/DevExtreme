import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('FloatingAction with Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const scrollWindowTo = async (position: object) => {
    await ClientFunction(
      () => {
        (window as any).scroll(position);
      },
      {
        dependencies: {
          position,
        },
      },
    )();
  };

  const generateData = (count) => {
    const items: Record<string, unknown>[] = [];

    for (let i = 0; i < count; i += 1) {
      items.push({
        ID: i,
        NAME: 'Name',
        Full_Name: 'Full name',
      });
    }

    return items;
  };

  [undefined, '#grid'].forEach((positionOf) => {
    test.skip(`FAB with grid, position.of is ${positionOf}`, async ({ page }) => {

      const dataGrid = page.locator('#grid');

      await page.expect(dataGrid.isReady())
        .ok();

      await page.evaluate(() => {
        (window as any).DevExpress.ui.repaintFloatingActionButton();
      });

      await testScreenshot(page, `FAB with grid, position.of is ${positionOf}, before scrolling.png`);

      await scrollWindowTo({ top: 10000000 });

      await page.expect(dataGrid.isReady())
        .ok();

      await testScreenshot(page, `FAB with grid, position.of is ${positionOf}, after scrolling.png`);

    });.before(async ({ page }) => {
      await page.evaluate(() => {
        $('#container').wrap('<div id=\'wrapperContainer\' style=\'height: 100%; overflow: auto;\'></div>');
      });

      await resizeWindow(1000, 400);

      await appendElementTo(page, '#container', 'div', 'grid');
      await appendElementTo(page, '#container', 'div', 'speed-dial-action');

      await createWidget(page, 'dxDataGrid', {
        dataSource: generateData(20),
      }, '#grid');

      await createWidget(page, 'dxSpeedDialAction', {
        label: 'Add row',
        icon: 'plus',
        position: {
          of: positionOf,
        },
      }, '#speed-dial-action');
    }).after(async () => {
      await page.evaluate(() => {
        $('#container').unwrap();
      });
    });
  });
});
