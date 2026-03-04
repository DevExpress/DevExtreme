import DataGrid from 'devextreme-testcafe-models/dataGrid';
import Popup from 'devextreme-testcafe-models/popup';
import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';

import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Filtering`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

// T1319193, T1311486
test('Proper handle custom filter operations for dates with non-date values', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const filterPanel = dataGrid.getFilterPanel();

  let filterBuilderPopup = await filterPanel.openFilterBuilderPopup(t);
  let filterBuilder = filterBuilderPopup.getFilterBuilder();

  await t
    .click(filterBuilder.getAddButton())
    .expect(FilterBuilder.getPopupTreeView().visible).ok()
    .click(FilterBuilder.getPopupTreeViewNodeByText('Add Condition'))
    .click(filterBuilder.getField(0, 'item').element)
    .click(FilterBuilder.getPopupTreeViewNodeByText('Order Date'))
    .click(filterBuilder.getField(0, 'itemOperation').element)
    .click(FilterBuilder.getPopupTreeViewNodeByText('Is any of'))
    .click(filterBuilder.getField(0, 'itemValue').element)
    .click(FilterBuilder.getPopupTreeViewNodeCheckboxByText('Weekends'))
    .click(new Popup(FilterBuilder.getPopupTreeView()).getOkButton().element)
    .click(filterBuilderPopup.asPopup().getOkButton().element);

  await t
    .expect(dataGrid.getRows().count)
    .eql(3)
    .expect(filterPanel.getFilterText().element.innerText)
    .eql('[Order Date] Is any of(\'Weekends\')');

  filterBuilderPopup = await filterPanel.openFilterBuilderPopup(t);
  filterBuilder = filterBuilderPopup.getFilterBuilder();

  await t
    .click(filterBuilder.getField(0, 'itemOperation').element)
    .click(FilterBuilder.getPopupTreeViewNodeByText('Weekends'))
    .click(filterBuilderPopup.asPopup().getOkButton().element);

  await t
    .expect(dataGrid.getRows().count)
    .eql(3)
    .expect(filterPanel.getFilterText().element.innerText)
    .eql('[Order Date] Weekends');

  const dateFilterCell = dataGrid.getFilterEditor(1, FilterTextBox);

  await t
    .click(dateFilterCell.menuButton)
    .click(dateFilterCell.menu.getItemByText('Between'))
    .expect(dataGrid.getFilterRangeOverlay().exists).ok()
    .typeText(dataGrid.getFilterRangeStartEditor().input, '2/1/2017')
    .typeText(dataGrid.getFilterRangeEndEditor().input, '2/28/2017')
    .pressKey('enter');

  await t
    .expect(dataGrid.getRows().count)
    .eql(4)
    .expect(filterPanel.getFilterText().element.innerText)
    .eql('[Order Date] Is between(\'2/1/2017\', \'2/28/2017\')');
}).before(async () => {
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

  return createWidget('dxDataGrid', {
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
});
