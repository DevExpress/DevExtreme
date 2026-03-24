import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - editOnKeyPress', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [
    { name: 'input' },
    { name: 'div' },
  ].forEach(({ name }) => {
    test(`should render edit cell template without errors, template: ${name}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, value: 'test1' },
          { id: 2, value: 'test2' },
        ],
        keyExpr: 'id',
        editing: {
          mode: 'cell',
          allowUpdating: true,
          startEditAction: 'click',
        },
        keyboardNavigation: {
          editOnKeyPress: true,
        },
        columns: [{
          dataField: 'value',
          editCellTemplate(container) {
            const el = document.createElement(name);
            if (name === 'input') {
              (el as HTMLInputElement).type = 'text';
              (el as HTMLInputElement).className = 'dx-texteditor-input';
            }
            container.get(0).appendChild(el);
          },
        }],
      });

      const dataGrid = new DataGrid(page);
      const cell = dataGrid.getDataCell(0, 0);
      await cell.element.click();

      const hasErrors = await page.evaluate(() => {
        const errors = (window as any).__testErrors || [];
        return errors.length;
      });

      expect(hasErrors).toBe(0);
    });
  });
});
