import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing - cell focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const apiRequestMock = RequestMock()
    .onRequestTo(/\/api\/data/)
    .respond(
      {
        data: [
          {
            id: 0,
            data: 'A',
          }, {
            id: 1,
            data: 'B',
          }, {
            id: 2,
            data: 'C',
          },
        ],
      },
      200,
      { 'access-control-allow-origin': '*' },
    )
    .onRequestTo(/\/api\/update/)
    .respond(
      {},
      200,
      {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': '*',
      },
    );

  // T1154721

  test('Should allow focus next editor in the same column after save changes with local data source', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        data: 'A',
      }, {
        id: 1,
        data: 'B',
      }, {
        id: 2,
        data: 'C',
      }],
      editing: {
        allowUpdating: true,
        refreshMode: 'repaint',
        mode: 'cell',
      },
      columns: [{
        dataField: 'data',
        showEditorAlways: true,
      }],
      repaintChangesOnly: true,
    });

      const firstCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);
    const middleCell = page.locator('.dx-data-row').nth(1).locator('td').nth(0);
    const secondCell = page.locator('.dx-data-row').nth(2).locator('td').nth(0);

    await (firstCell.locator('.dx-editor-cell')).fill(' AAA');
    await (secondCell.locator('.dx-editor-cell')).fill(' CCC');
    await (middleCell.element).click();

    const firstCellValue = await firstCell.locator('.dx-editor-cell')().value;
    const secondCellValue = await secondCell.locator('.dx-editor-cell')().value;

    expect(await firstCellValue).toBe('A AAA');
    expect(await secondCellValue).toBe('C CCC');
  });
    // TODO: .after() block removed
});
