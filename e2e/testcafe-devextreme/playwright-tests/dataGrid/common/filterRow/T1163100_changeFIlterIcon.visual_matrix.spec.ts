import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Header Filter T1163100 change filter icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_SELECTOR = '#container';

  const generateTestData = (rowCount: number) => new Array(rowCount)
    .fill(null)
    .map((_, idx) => ({
      dataA: `A_${idx}`,
      dataB: `B_${idx}`,
      dataC: `C_${idx}`,
      dataD: `D_${idx}`,
    }));

  [
    ['usual', ['dataA', 'dataB']],
    ['fixed', [{ dataField: 'dataA', fixed: true }, { dataField: 'dataB', fixed: true }]],
  ].forEach(([firstColumnsName, firstColumns]) => {
    [
      ['usual', ['dataC', 'dataD']],
      ['band', [{ caption: 'Band column', columns: ['dataC', 'dataD'] }]],
    ].forEach(([secondColumnsName, secondColumns]) => {
      ([
        ['usual', undefined],
        ['virtual', { columnRenderingMode: 'virtual', rowRenderingMode: 'virtual' }],
      ] as const).forEach(([scrollingName, scrolling]) => {

  test(`Should change filter row icon (columns ${firstColumnsName} ${secondColumnsName}, scrolling ${scrollingName}`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
            dataSource: generateTestData(25),
            filterRow: {
              visible: true,
            },
            columnFixing: {
              // @ts-expect-error private option
              legacyMode: true,
            },
            columns: [
              ...firstColumns,
              ...secondColumns,
            ],
            scrolling,
          });

                  for (let columnIdx = 0; columnIdx < 4; columnIdx += 1) {
            const filterCell = page.locator('.dx-datagrid-filter-row td').nth(columnIdx);
            await (filterCell.menuButton).click();
            await (filterCell.menu.getItemByText('Starts with').click());
          }

          await testScreenshot(page,
            `T1163100_change-icon_columns-${firstColumnsName}-${secondColumnsName}_scrolling-${scrollingName}.png`,
            { element: page.locator('#container') },
          );
        });
});
