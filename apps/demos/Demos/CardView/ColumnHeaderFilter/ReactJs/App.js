import React from 'react';
import CardView, {
  Column,
  HeaderFilter,
  ColumnHeaderFilter,
  ColumnHeaderFilterSearch,
} from 'devextreme-react/card-view';
import { orders } from './data.js';

function getOrderDay(rowData) {
  return new Date(rowData.OrderDate).getDay();
}
function calculateOrderDateFilterExpression(value, selectedFilterOperations, target) {
  if (value === 'weekends') {
    return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
  }
  return this.defaultCalculateFilterExpression(value, selectedFilterOperations, target);
}
const saleAmountHeaderFilterDataSource = [
  {
    text: 'Less than $3000',
    value: ['SaleAmount', '<', 3000],
  },
  {
    text: '$3000 - $5000',
    value: [
      ['SaleAmount', '>=', 3000],
      ['SaleAmount', '<', 5000],
    ],
  },
  {
    text: '$5000 - $10000',
    value: [
      ['SaleAmount', '>=', 5000],
      ['SaleAmount', '<', 10000],
    ],
  },
  {
    text: '$10000 - $20000',
    value: [
      ['SaleAmount', '>=', 10000],
      ['SaleAmount', '<', 20000],
    ],
  },
  {
    text: 'Greater than $20000',
    value: ['SaleAmount', '>=', 20000],
  },
];
const citySearchEditorOptions = {
  placeholder: 'Search city or state',
};
const citySearchFields = ['StoreCity', 'StoreState'];
const stateSearchEditorOptions = {
  placeholder: 'Search state or city',
};
const stateSearchFields = ['StoreState', 'StoreCity'];
function orderDateHeaderFilterDataSource(options) {
  if (options.dataSource) {
    options.dataSource.postProcess = (results) => {
      results.push({
        text: 'Weekends',
        value: 'weekends',
      });
      return results;
    };
  }
}
const App = () => (
  <CardView
    dataSource={orders}
    keyExpr="OrderNumber"
    cardsPerRow="auto"
    cardMinWidth={280}
    wordWrapEnabled={true}
  >
    <HeaderFilter visible={true} />
    <Column dataField="OrderNumber">
      <ColumnHeaderFilter groupInterval={10000} />
    </Column>
    <Column
      dataField="OrderDate"
      dataType="date"
      calculateFilterExpression={calculateOrderDateFilterExpression}
    >
      <ColumnHeaderFilter dataSource={orderDateHeaderFilterDataSource} />
    </Column>
    <Column
      dataField="SaleAmount"
      dataType="number"
    >
      <ColumnHeaderFilter dataSource={saleAmountHeaderFilterDataSource} />
    </Column>
    <Column dataField="StoreCity">
      <ColumnHeaderFilter>
        <ColumnHeaderFilterSearch
          enabled={true}
          editorOptions={citySearchEditorOptions}
          searchExpr={citySearchFields}
        />
      </ColumnHeaderFilter>
    </Column>
    <Column dataField="StoreState">
      <ColumnHeaderFilter>
        <ColumnHeaderFilterSearch
          enabled={true}
          editorOptions={stateSearchEditorOptions}
          searchExpr={stateSearchFields}
        />
      </ColumnHeaderFilter>
    </Column>
    <Column dataField="Employee" />
  </CardView>
);
export default App;
