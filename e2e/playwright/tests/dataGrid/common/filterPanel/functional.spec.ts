import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import FilterBuilder from '../../../../models/filterBuilder';
import Popup from '../../../../models/popup';
import { typeText } from '../../helpers/typeText';

test.describe('Filtering', () => {
  // T1319193, T1311486
  test('Proper handle custom filter operations for dates with non-date values', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
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

      return {
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
                  // eslint-disable-next-line no-param-reassign
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
      };
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterPanel = dataGrid.getFilterPanel();

    let filterBuilderPopup = await filterPanel.openFilterBuilderPopup();
    let filterBuilder = filterBuilderPopup.getFilterBuilder();

    await filterBuilder.getAddButton().click();
    await expect(FilterBuilder.getPopupTreeView(page)).toBeVisible();
    await FilterBuilder.getPopupTreeViewNodeByText(page, 'Add Condition').click();
    await filterBuilder.getField(0, 'item').element.click();
    await FilterBuilder.getPopupTreeViewNodeByText(page, 'Order Date').click();
    await filterBuilder.getField(0, 'itemOperation').element.click();
    await FilterBuilder.getPopupTreeViewNodeByText(page, 'Is any of').click();
    await filterBuilder.getField(0, 'itemValue').element.click();
    await FilterBuilder.getPopupTreeViewNodeCheckboxByText(page, 'Weekends').click();
    await new Popup(page, FilterBuilder.getPopupTreeView(page)).getOkButton().element.click();
    await filterBuilderPopup.asPopup().getOkButton().element.click();

    await expect(dataGrid.getRows()).toHaveCount(3);
    await expect(filterPanel.getFilterText().element)
      .toHaveText('[Order Date] Is any of(\'Weekends\')', { useInnerText: true });

    filterBuilderPopup = await filterPanel.openFilterBuilderPopup();
    filterBuilder = filterBuilderPopup.getFilterBuilder();

    await filterBuilder.getField(0, 'itemOperation').element.click();
    await FilterBuilder.getPopupTreeViewNodeByText(page, 'Weekends').click();
    await filterBuilderPopup.asPopup().getOkButton().element.click();

    await expect(dataGrid.getRows()).toHaveCount(3);
    await expect(filterPanel.getFilterText().element)
      .toHaveText('[Order Date] Weekends', { useInnerText: true });

    const dateFilterCell = dataGrid.getFilterCell(1);

    await dateFilterCell.menuButton.click();
    await dateFilterCell.menu.getItemByText('Between').click();
    await expect(dataGrid.getFilterRangeOverlay()).toBeAttached();
    await typeText(dataGrid.getFilterRangeStartEditor().input, '2/1/2017');
    await typeText(dataGrid.getFilterRangeEndEditor().input, '2/28/2017');
    await page.keyboard.press('Enter');

    await expect(dataGrid.getRows()).toHaveCount(4);
    await expect(filterPanel.getFilterText().element)
      .toHaveText('[Order Date] Is between(\'2/1/2017\', \'2/28/2017\')', { useInnerText: true });
  });
});
