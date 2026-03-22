import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Keyboard Navigation - common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const CLASS = ClassNames;

  const getOnKeyDownCallCount = ClientFunction(() => (window as any).onKeyDownCallCount);

  );

  test('Changing keyboardNavigation options should not invalidate the entire content (T1197829)', async ({ page }) => {
    await page.evaluate(() => {
        (window as any).invalidateCounter = 0;
        (window as any).renderTableCounter = 0;
      });

      await createWidget(page, 'dxDataGrid', {
        dataSource: [...new Array(5)].map((_, index) => ({ id: index, text: `item ${index}` })),
        keyExpr: 'id',
        columns: [
          { dataField: 'id' },
          { dataField: 'text' },
        ],
        focusedRowEnabled: true,
        keyboardNavigation: {
          editOnKeyPress: true,
          enterKeyAction: 'startEdit',
          enterKeyDirection: 'column',
        },
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        onFocusedRowChanging(e) {
          if ((e.newRowIndex + 1) % 2 === 0) {
            e.component.option('keyboardNavigation.enterKeyAction', 'moveFocus');
          } else {
            e.component.option('keyboardNavigation.enterKeyAction', 'startEdit');
          }
        },
        onInitialized(e) {
          const dataGrid: any = e.component;
          const rowsView = dataGrid.getView('rowsView');
          // eslint-disable-next-line no-underscore-dangle
          const defaultInvalidate = rowsView._invalidate;
          // eslint-disable-next-line no-underscore-dangle
          dataGrid.getView('rowsView')._invalidate = (...args) => {
            ((window as any).invalidateCounter as number) += 1;
            return defaultInvalidate.apply(rowsView, args);
          };

          // eslint-disable-next-line no-underscore-dangle
          const defaultRenderTable = rowsView._renderTable;
          // eslint-disable-next-line no-underscore-dangle
          dataGrid.getView('rowsView')._renderTable = (...args) => {
            ((window as any).renderTableCounter as number) += 1;
            return defaultRenderTable.apply(rowsView, args);
          };
        },
      });

      expect(await page.locator('.dx-datagrid').first().isVisible());
      await t.ok();

    expect(await ClientFunction(() => (window as any).invalidateCounter)());
    await t.eql(0);
    expect(await ClientFunction(() => (window as any).renderTableCounter)());
    await t.eql(2);
      // test enter key behavior
      .click(page.locator('.dx-data-row').nth(1).locator('td').nth(1)) // set initial focus
      .expect(page.locator('.dx-data-row').nth(1).locator('td').nth(1).isFocused)
      .ok()
      .expect(page.locator('.dx-data-row').nth(1).locator('td').nth(1).isEditCell)
      .ok()
      .pressKey('enter') // move focus to next cell
      .expect(page.locator('.dx-data-row').nth(2).locator('td').nth(1).isFocused)
      .ok()
      .expect(page.locator('.dx-data-row').nth(2).locator('td').nth(1).isEditCell)
      .notOk()
      .pressKey('enter') // switch cell to the editing state
      .expect(page.locator('.dx-data-row').nth(2).locator('td').nth(1).isEditCell)
      .ok()
      .pressKey('enter') // move focus to next cell
      .expect(page.locator('.dx-data-row').nth(3).locator('td').nth(1).isFocused)
      .ok()
      .expect(page.locator('.dx-data-row').nth(3).locator('td').nth(1).isEditCell)
      .notOk()
      .pressKey('enter') // move focus to next cell again
      .expect(page.locator('.dx-data-row').nth(4).locator('td').nth(1).isFocused)
      .ok()
      .expect(page.locator('.dx-data-row').nth(4).locator('td').nth(1).isEditCell)
      .notOk()
      .pressKey('enter') // switch cell to the editing state
      .expect(page.locator('.dx-data-row').nth(4).locator('td').nth(1).isEditCell)
      .ok()

      // test tab key behavior
      .click(page.locator('.dx-data-row').nth(1).locator('td').nth(1)) // set initial focus
      .expect(page.locator('.dx-data-row').nth(1).locator('td').nth(1).isFocused)
      .ok()
      .expect(page.locator('.dx-data-row').nth(1).locator('td').nth(1).isEditCell)
      .ok()
      .pressKey('tab')
      .expect(page.locator('.dx-data-row').nth(2).locator('td').nth(0).isFocused)
      .ok()
      .expect(page.locator('.dx-data-row').nth(2).locator('td').nth(0).isEditCell)
      .ok()

      .expect(ClientFunction(() => (window as any).invalidateCounter)())
      .eql(0)
      .expect(ClientFunction(() => (window as any).renderTableCounter)())
      .eql(9);
  });
    // TODO: .after() block removed
});
