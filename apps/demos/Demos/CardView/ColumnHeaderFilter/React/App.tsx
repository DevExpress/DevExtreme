import React from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import { orders, Order } from './data.ts';

function getOrderDay(rowData: Order) {
  return new Date(rowData.OrderDate).getDay();
}

function calculateOrderDateFilterExpression(value, selectedFilterOperations, target) {
  if (value === 'weekends') {
    return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
  }
  return this.defaultCalculateFilterExpression(value, selectedFilterOperations, target);
}

const App = () => (
  <CardView
    dataSource={orders}
    keyExpr="OrderNumber"
    cardMinWidth={100}
    wordWrapEnabled={true}
    // TODO: make nested
    headerFilter={{ visible: true }}
  >
    <Column
      dataField="OrderNumber"
      // TODO: make nested
      headerFilter={{ groupInterval: 10000 }}
    />
    <Column
      dataField="OrderDate"
      dataType="date"
      calculateFilterExpression={calculateOrderDateFilterExpression}
      // TODO: make nested
      headerFilter={{
        dataSource(data) {
          data.dataSource.postProcess = function (results) {
            results.push({
              text: 'Weekends',
              value: 'weekends',
            });
            return results;
          };
        },
      }}
    />
    <Column
      dataField="SaleAmount"
      dataType="number"
      // TODO: make nested
      headerFilter={{
        dataSource: [
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
        ],
      }}
    />
    <Column
      dataField="StoreCity"
      // TODO: make nested
      headerFilter={{
        search: {
          enabled: true,
          editorOptions: {
            placeholder: 'Search city or state',
          },
          searchExpr: ['StoreCity', 'StoreState'],
        },
      }}
    />
    <Column
      dataField="StoreState"
      // TODO: make nested
      headerFilter={{
        search: {
          enabled: true,
          editorOptions: {
            placeholder: 'Search state or city',
          },
          searchExpr: ['StoreState', 'StoreCity'],
        },
      }}
    />
    <Column
      dataField="Employee"
    />
  </CardView>
);

export default App;
