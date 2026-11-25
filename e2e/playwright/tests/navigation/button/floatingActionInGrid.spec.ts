import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';

const scrollWindowTo = (page: Page, position: ScrollToOptions): Promise<void> => page.evaluate(
  (scrollPosition) => { window.scroll(scrollPosition); },
  position,
);

const generateData = (count: number): Record<string, unknown>[] => {
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

test.describe('FloatingAction with Grid', () => {
  test.use({ browserSize: [1000, 400] });

  [undefined, '#grid'].forEach((positionOf) => {
    test(`FAB with grid, position.of is ${positionOf}`, async ({ page }) => {
      await page.evaluate(() => {
        $('#container').wrap('<div id=\'wrapperContainer\' style=\'height: 100%; overflow: auto;\'></div>');
      });

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

      const dataGrid = new DataGrid(page, '#grid');

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await page.evaluate(() => {
        (window as any).DevExpress.ui.repaintFloatingActionButton();
      });

      await testScreenshot(page, `FAB with grid, position.of is ${positionOf}, before scrolling.png`);

      await scrollWindowTo(page, { top: 10000000 });

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await testScreenshot(page, `FAB with grid, position.of is ${positionOf}, after scrolling.png`);
    });
  });
});
