import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
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

test.describe('FilterRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Filter should reset if the filter row editor text is cleared (T1257261)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, Text: 'Item 1' },
        { ID: 2, Text: '' },
        { ID: 3, Text: 'Item 3' },
      ],
      keyExpr: 'ID',
      showBorders: true,
      remoteOperations: true,
      headerFilter: { visible: true },
      filterRow: { visible: true },
      filterPanel: { visible: true },
      filterValue: ['Text', '=', 'i'],
      columns: ['ID', {
        dataField: 'Text',
        selectedFilterOperation: '=',
      }],
      onEditorPreparing(e: any) {
        e.updateValueTimeout = 100;
      },
    });

      const filterEditor = dataGrid.getFilterEditor(1, TextBox);
    const filterPanelText = dataGrid.getFilterPanel().getFilterText();

    // assert
      .expect(filterPanelText.element.textContent)
      .eql('[Text] Equals \'i\'')
    // act
      .click(filterEditor.locator('input'))
      .pressKey('backspace')
      .wait(100) // updateValueTimeout
    // assert
      .expect(filterPanelText.element.textContent)
      .eql('Create Filter')
    // act
      .click(page.locator('#container'))
    // assert
      .expect(filterPanelText.element.textContent)
      .eql('Create Filter');
  });
});
