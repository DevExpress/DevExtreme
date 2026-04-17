import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const generateData = (count: number) => {
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

test.describe.skip('FloatingAction with Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [undefined, '#grid'].forEach((positionOf) => {
    test(`FAB with grid, position.of is ${positionOf}`, async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 400 });

      await page.evaluate(() => {
        $('#container').wrap('<div id=\'wrapperContainer\' style=\'height: 100%; overflow: auto;\'></div>');
      });

      await page.evaluate(() => {
        const grid = document.createElement('div');
        grid.id = 'grid';
        document.querySelector('#container')?.appendChild(grid);

        const sda = document.createElement('div');
        sda.id = 'speed-dial-action';
        document.querySelector('#container')?.appendChild(sda);
      });

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

      await page.waitForFunction(() => {
        const grid = ($('#grid') as any).dxDataGrid('instance');
        return grid.isReady();
      });

      await page.evaluate(() => {
        (window as any).DevExpress.ui.repaintFloatingActionButton();
      });

      await testScreenshot(page, `FAB with grid, position.of is ${positionOf}, before scrolling.png`);

      await page.evaluate(() => {
        window.scroll({ top: 10000000 });
      });

      await page.waitForFunction(() => {
        const grid = ($('#grid') as any).dxDataGrid('instance');
        return grid.isReady();
      });

      await testScreenshot(page, `FAB with grid, position.of is ${positionOf}, after scrolling.png`);

      await page.evaluate(() => {
        $('#container').unwrap();
      });
    });
  });
});
