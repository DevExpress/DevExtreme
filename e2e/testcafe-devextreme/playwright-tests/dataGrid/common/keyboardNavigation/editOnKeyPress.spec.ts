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

  test('Focused cell should not flick (T1206435)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      const data = [
        { value: 'data' },
        { value: 'data' },
      ];
      return {
        dataSource: new (window as any).DevExpress.data.CustomStore({
          load() {
            return Promise.resolve(data);
          },
          update() {
            return new Promise<void>((res) => {
              setTimeout(() => {
                res();
              }, 100);
            });
          },
        }),
        keyboardNavigation: {
          enabled: true,
          editOnKeyPress: true,
          enterKeyAction: 'moveFocus',
          enterKeyDirection: 'column',
        },
        editing: {
          mode: 'cell',
          allowUpdating: true,
          allowAdding: true,
          startEditAction: 'dblClick',
          refreshMode: 'reshape',
        },
        repaintChangesOnly: true,
      };
    });

    const dataGrid = new DataGrid(page);

    await page.evaluate(() => {
      (window as any).__focusCount = 0;
      const secondCell = document.querySelectorAll('.dx-data-row')[1]?.querySelector('td');
      if (secondCell) {
        secondCell.addEventListener('focusin', () => {
          (window as any).__focusCount += 1;
        });
      }
    });

    const firstCell = dataGrid.getDataCell(0, 0);
    await firstCell.element.click();

    await page.keyboard.press('m');
    await page.keyboard.press('Enter');

    const secondCell = dataGrid.getDataCell(1, 0);
    const isFocused = await secondCell.element.evaluate((el) => document.activeElement === el || el.contains(document.activeElement));
    expect(isFocused).toBe(true);

    const focusEventCount = await page.evaluate(() => (window as any).__focusCount);
    expect(focusEventCount).toBe(1);
  });
});
