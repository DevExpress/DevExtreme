<template>
  <DxCardView
    id="cardView"
    :data-source="orders"
    key-expr="OrderNumber"
    cards-per-row="auto"
    :card-min-width="280"
    :word-wrap-enabled="true"
  >
    <DxHeaderFilter
      :visible="true"
    />
    <DxColumn
      data-field="OrderNumber"
    >
      <DxColumnHeaderFilter
        :group-interval="10000"
      />
    </DxColumn>
    <DxColumn
      data-field="OrderDate"
      data-type="date"
      :calculate-filter-expression="calculateOrderDateFilterExpression"
    >
      <DxColumnHeaderFilter
        :data-source="orderDateHeaderFilterDataSource"
      />
    </DxColumn>
    <DxColumn
      data-field="SaleAmount"
      data-type="number"
    >
      <DxColumnHeaderFilter
        :data-source="saleAmountHeaderFilterDataSource"
      />
    </DxColumn>
    <DxColumn
      data-field="StoreCity"
    >
      <DxColumnHeaderFilter>
        <DxColumnHeaderFilterSearch
          :enabled="true"
          :editor-options="{ placeholder: 'Search city or state' }"
          :search-expr="['StoreCity', 'StoreState']"
        />
      </DxColumnHeaderFilter>
    </DxColumn>
    <DxColumn
      data-field="StoreState"
    >
      <DxColumnHeaderFilter>
        <DxColumnHeaderFilterSearch
          :enabled="true"
          :editor-options="{ placeholder: 'Search state or city' }"
          :search-expr="['StoreState', 'StoreCity']"
        />
      </DxColumnHeaderFilter>
    </DxColumn>
    <DxColumn
      data-field="Employee"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn, DxHeaderFilter, DxColumnHeaderFilter, DxColumnHeaderFilterSearch, type DxCardViewTypes } from 'devextreme-vue/card-view';
import { type Order, orders } from './data.ts';

function getOrderDay(rowData: Order) {
  return new Date(rowData.OrderDate).getDay();
}

function calculateOrderDateFilterExpression(
  this: DxCardViewTypes.Column, value, selectedFilterOperations, target,
) {
  if (value === 'weekends') {
    return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
  }
  return this.defaultCalculateFilterExpression(value, selectedFilterOperations, target) as any;
}

function orderDateHeaderFilterDataSource(data) {
  data.dataSource.postProcess = function (results) {
    results.push({
      text: 'Weekends',
      value: 'weekends',
    });
    return results;
  };
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
</script>
