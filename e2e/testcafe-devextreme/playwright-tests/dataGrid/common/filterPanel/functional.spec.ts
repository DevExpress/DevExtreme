import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_CONTAINER = '#container';

  // T1319193, T1311486

  test('Proper handle custom filter operations for dates with non-date values', async ({ page }) => {
    const dataSource = [{
        ID: 1,
        OrderNumber: 35711,
        OrderDate: '2017/01/12',
        Employee: 'Jim Packard',
      }, {
        ID: 5,
        OrderNumber: 35714,
        OrderDate: '2017/01/22',
        Employee: 'Harv Mudd',
      }, {
        ID: 7,
        OrderNumber: 35983,
        OrderDate: '2017/02/07',
        Employee: 'Todd Hoffman',
      }, {
        ID: 14,
        OrderNumber: 39420,
        OrderDate: '2017/02/15',
        Employee: 'Jim Packard',
      }, {
        ID: 15,
        OrderNumber: 39874,
        OrderDate: '2017/02/04',
        Employee: 'Harv Mudd',
      }];

      return createWidget(page, 'dxDataGrid', {
        dataSource,
        keyExpr: 'ID',
        filterRow: { visible: true },
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        filterBuilder: {
          customOperations: [
            {
              name: 'weekends',
              caption: 'Weekends',
              dataTypes: ['date'],
              icon: 'check',
              hasValue: false,
              calculateFilterExpression() {
                function getOrderDay(rowData: { OrderDate: string }) {
                  return (new Date(rowData.OrderDate)).getDay();
                }

                return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
              },
            },
          ],
        },
        columns: [
          'OrderNumber',
          {
            dataField: 'OrderDate',
            dataType: 'date',
            calculateFilterExpression(value, selectedFilterOperations, target) {
              if (target === 'headerFilter' && value === 'weekends') {
                function getOrderDay(rowData: { OrderDate: string }) {
                  return (new Date(rowData.OrderDate)).getDay();
                }

                return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
              }
              return this.defaultCalculateFilterExpression?.(
                value,
                selectedFilterOperations,
                target,
              ) ?? [];
            },
            headerFilter: {
              dataSource(data) {
                if (data.dataSource) {
                  data.dataSource.postProcess = (results) => {
                    results.push({
                      text: 'Weekends',
                      value: 'weekends',
                    });
                    return results;
                  };
                }
              },
            },
          },
          'Employee',
        ],
      });

      const filterPanel = dataGrid.getFilterPanel();

    let filterBuilderPopup = await filterPanel.openFilterBuilderPopup(t);
    let filterBuilder = filterBuilderPopup.getFilterBuilder();

    await (filterBuilder.getAddButton()).click();
    expect(await FilterBuilder.getPopupTreeView().visible).toBeTruthy();
    await (FilterBuilder.getPopupTreeViewNodeByText('Add Condition')).click();
    await (filterBuilder.getField(0, 'item').element).click();
    await (FilterBuilder.getPopupTreeViewNodeByText('Order Date')).click();
    await (filterBuilder.getField(0, 'itemOperation').element).click();
    await (FilterBuilder.getPopupTreeViewNodeByText('Is any of')).click();
    await (filterBuilder.getField(0, 'itemValue').element).click();
    await (FilterBuilder.getPopupTreeViewNodeCheckboxByText('Weekends')).click();
    await (new Popup(FilterBuilder.getPopupTreeView()).getOkButton().element).click();
    await (filterBuilderPopup.asPopup().getOkButton().element).click();

    expect(await dataGrid.getRows().count);
    await t.eql(3);
    expect(await filterPanel.getFilterText().element.innerText);
    await t.eql('[Order Date] Is any of(\'Weekends\')');

    filterBuilderPopup = await filterPanel.openFilterBuilderPopup(t);
    filterBuilder = filterBuilderPopup.getFilterBuilder();

    await (filterBuilder.getField(0, 'itemOperation').element).click();
    await (FilterBuilder.getPopupTreeViewNodeByText('Weekends')).click();
    await (filterBuilderPopup.asPopup().getOkButton().element).click();

    expect(await dataGrid.getRows().count);
    await t.eql(3);
    expect(await filterPanel.getFilterText().element.innerText);
    await t.eql('[Order Date] Weekends');

    const dateFilterCell = page.locator('.dx-datagrid-filter-row td').nth(1);

    await (dateFilterCell.menuButton).click();
    await (dateFilterCell.menu.getItemByText('Between')).click();
    expect(await dataGrid.getFilterRangeOverlay().exists).toBeTruthy();
    await (dataGrid.getFilterRangeStartEditor().locator('input')).fill('2/1/2017');
    await (dataGrid.getFilterRangeEndEditor().locator('input')).fill('2/28/2017');
    await page.keyboard.press('enter');

    expect(await dataGrid.getRows().count);
    await t.eql(4);
    expect(await filterPanel.getFilterText().element.innerText);
    await t.eql('[Order Date] Is between(\'2/1/2017\', \'2/28/2017\')');
  });
});
