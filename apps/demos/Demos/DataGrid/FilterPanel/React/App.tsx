import React from 'react';
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Scrolling,
} from 'devextreme-react/data-grid';
import { orders } from './data.ts';

const saleAmountEditorOptions = { format: 'currency', showClearButton: true };
const getOrderDay = (rowData) => (new Date(rowData.OrderDate)).getDay();

const filterBuilderPopupPosition = {
  of: window,
  at: 'top' as const,
  my: 'top' as const,
  offset: { y: 10 },
};

const filterBuilder = {
  customOperations: [{
    name: 'weekends',
    caption: 'Weekends',
    dataTypes: ['date' as const],
    icon: 'check',
    hasValue: false,
    calculateFilterExpression: () => [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]],
  }],
  allowHierarchicalFields: true,
};

const filterValue = [['Employee', '=', 'Clark Morgan'], 'and', ['OrderDate', 'weekends']];

const saleAmountHeaderFilters = [{
  text: 'Less than $3000',
  value: ['SaleAmount', '<', 3000],
}, {
  text: '$3000 - $5000',
  value: [['SaleAmount', '>=', 3000], ['SaleAmount', '<', 5000]],
}, {
  text: '$5000 - $10000',
  value: [['SaleAmount', '>=', 5000], ['SaleAmount', '<', 10000]],
}, {
  text: '$10000 - $20000',
  value: [['SaleAmount', '>=', 10000], ['SaleAmount', '<', 20000]],
}, {
  text: 'Greater than $20000',
  value: ['SaleAmount', '>=', 20000],
}];

const App = () => (
  <DataGrid
    id="gridContainer"
    filterBuilder={filterBuilder}
    defaultFilterValue={filterValue}
    dataSource={orders}
    keyExpr="ID"
    showBorders={true}
  >
    <FilterRow visible={true} />
    <FilterPanel visible={true} />
    <FilterBuilderPopup position={filterBuilderPopupPosition} />
    <HeaderFilter visible={true} />
    <Scrolling mode="infinite" />

    <Column
      dataType="number"
      dataField="OrderNumber"
      caption="Invoice Number"
    >
      <HeaderFilter groupInterval={10000} />
    </Column>
    <Column dataField="OrderDate" dataType="date" />
    <Column
      editorOptions={saleAmountEditorOptions}
      dataField="SaleAmount"
      dataType="number"
      format="currency"
    >
      <HeaderFilter dataSource={saleAmountHeaderFilters} />
    </Column>
    <Column dataField="Employee" dataType="string" />
    <Column dataField="CustomerInfo.StoreCity" caption="City" dataType="string" />
    <Column dataField="CustomerInfo.StoreState" caption="State" dataType="string" />
  </DataGrid>
);

export default App;
