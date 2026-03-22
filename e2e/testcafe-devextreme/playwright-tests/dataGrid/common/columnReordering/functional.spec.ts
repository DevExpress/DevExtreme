import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Column reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const CLASS = ClassNames;

  const getVisibleColumns = (dataGrid: DataGrid): Promise<string[]> => {
    const { getInstance } = dataGrid;

    return ClientFunction(
      () => (getInstance() as any)
        .getVisibleColumns()
        .map((column: any) => column.dataField ?? column.name),
      { dependencies: { getInstance } },
    )();
  };
  const getColumnsSeparatorOffset = ClientFunction(() => $(`.${CLASS.columnsSeparator}`).offset(), { dependencies: { CLASS } });
  // T975549

  test('The column reordering should work correctly when there is a fixed column with zero width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [
        {
          dataField: 'field1',
          fixed: true,
          width: 200,
        }, {
          name: 'fake',
          fixed: true,
          width: 0.01,
        }, {
          dataField: 'field2',
          width: 200,
        }, {
          dataField: 'field3',
          width: 200,
        }, {
          dataField: 'field4',
          width: 200,
        },
      ],
      allowColumnReordering: true,
    });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    const headers = page.locator('.dx-header-row');
    const headerRow = headers.getHeaderRow(0);

    expect(await headerRow.locator('td').nth(2).element.textContent);
    await t.eql('Field 2');
    await t.drag(headerRow.locator('td').nth(3).element, -400, 0);
    expect(await headerRow.locator('td').nth(2).element.textContent);
    await t.eql('Field 3');
    expect(await getVisibleColumns(dataGrid));
    await t.eql(['field1', 'fake', 'field3', 'field2', 'field4']);
  });
});
