import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.Common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const EMPTY_CELL_TEXT = '\u00A0';
  const DROPDOWNMENU_PROMPT_EDITOR_INDEX = 0;
  const DROPDOWNMENU_REGENERATE_INDEX = 1;
  const DROPDOWNMENU_CLEAR_DATA_INDEX = 2;

  test('The AI column with a given width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          width: 175,
        },
      ],
    });

    // arrange, act
      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    // assert
    expect(await page.locator('.dx-data-row').nth(0).locator('td').nth(3).clientWidth).toBe(175);
  });
});
