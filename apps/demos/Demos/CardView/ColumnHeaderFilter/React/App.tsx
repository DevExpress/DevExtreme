import React, { type ComponentProps } from 'react';

import CardView, { Column, HeaderFilter, ColumnHeaderFilter, ColumnHeaderFilterSearch } from 'devextreme-react/card-view';
import type { CardViewTypes } from 'devextreme-react/card-view';
import type { DataSourceOptions } from 'devextreme-react/common/data';

import { orders } from './data.ts';
import type { Order, OrderFilter } from './data.ts';

function getOrderDay(rowData: Order) {
  return new Date(rowData.OrderDate).getDay();
}

function calculateOrderDateFilterExpression(
  this: CardViewTypes.Column<Order>,
  value: string,
  selectedFilterOperations: string | null,
  target: string
): string | any[] | (() => void) {
  if (value === 'weekends') {
    return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
  }
  return this.defaultCalculateFilterExpression(value, selectedFilterOperations, target) as string | any[] | (() => void);
}

const saleAmountHeaderFilterDataSource: OrderFilter[] = [
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

interface HeaderFilterDataResult {
  text: string;
  value: string;
}

interface HeaderFilterDataSourceOptions {
  component: Record<string, any>;
  dataSource: DataSourceOptions<HeaderFilterDataResult> | null;
}

function orderDateHeaderFilterDataSource(options: HeaderFilterDataSourceOptions): void {
  if (options.dataSource) {
    options.dataSource.postProcess = function (results: HeaderFilterDataResult[]) {
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
    <HeaderFilter
      visible={true}
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
      calculateFilterExpression={calculateOrderDateFilterExpression}
    >
      <ColumnHeaderFilter
        dataSource={orderDateHeaderFilterDataSource}
      />
    </Column>
    <Column
      dataField="SaleAmount"
      dataType="number"
    >
      <ColumnHeaderFilter
        dataSource={saleAmountHeaderFilterDataSource}
      />
    </Column>
    <Column
      dataField="StoreCity"
    >
      <ColumnHeaderFilter>
        <ColumnHeaderFilterSearch
          enabled={true}
          editorOptions={{
            placeholder: 'Search city or state',
          }}
          searchExpr={['StoreCity', 'StoreState']}
        />
      </ColumnHeaderFilter>
    </Column>
    <Column
      dataField="StoreState"
    >
      <ColumnHeaderFilter>
        <ColumnHeaderFilterSearch
          enabled={true}
          editorOptions={{
            placeholder: 'Search state or city',
          }}
          searchExpr={['StoreState', 'StoreCity']}
        />
      </ColumnHeaderFilter>
    </Column>
    <Column
      dataField="Employee"
    />
  </CardView>
);

export default App;
