import React from 'react';
import CardView, { Column, HeaderFilter, ColumnHeaderFilter, FilterPanel, FilterBuilder } from 'devextreme-react/card-view';
import { orders, Order } from './data.ts';

function getOrderDay({ OrderDate }: Order): number {
  return (new Date(OrderDate)).getDay();
}

const filterValue = [['Employee', '=', 'Clark Morgan'], 'and', ['DeliveryDate', 'weekends']];

const customOperations = [{
  name: 'weekends',
  caption: 'Weekends',
  dataTypes: ['date' as const],
  icon: 'check',
  hasValue: false,
  calculateFilterExpression() {
    return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
  },
}];

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

const App = () => (
  <CardView
    dataSource={orders}
    keyExpr="ID"
    defaultFilterValue={filterValue}
    cardsPerRow="auto"
    cardMinWidth={310}
  >
    <HeaderFilter
      visible={true}
    />
    <FilterPanel
      visible={true}
    />
    <FilterBuilder
      customOperations={customOperations}
    />
    <Column
      dataField="OrderNumber"
    >
      <ColumnHeaderFilter
        groupInterval={10000}
      />
    </Column>
    <Column
      dataField="OrderDate"
      dataType="date"
    />
    <Column
      dataField="DeliveryDate"
      dataType="date"
    />
    <Column
      dataField="SaleAmount"
      dataType="number"
    >
      <ColumnHeaderFilter
        dataSource={saleAmountHeaderFilterDataSource}
      />
    </Column>
    <Column
      dataField="CustomerStoreCity"
      caption="City"
    />
    <Column
      dataField="Employee"
    />
  </CardView>
);

export default App;
