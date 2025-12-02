<template>
  <DxCardView
    id="cardView"
    :data-source="orders"
    key-expr="ID"
    :filter-value="filterValue"
    cards-per-row="auto"
    :card-min-width="310"
  >
    <DxHeaderFilter
      :visible="true"
    />
    <DxFilterPanel
      :visible="true"
    />
    <DxFilterBuilder
      :custom-operations="customOperations"
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
    />
    <DxColumn
      data-field="DeliveryDate"
      data-type="date"
    />
    <DxColumn
      data-field="SaleAmount"
      data-type="number"
    >
      <DxColumnHeaderFilter
        :data-source="saleAmountHeaderFilterDataSource"
      />
    </DxColumn>
    <DxColumn
      data-field="CustomerStoreCity"
      caption="City"
    />
    <DxColumn
      data-field="Employee"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn, DxHeaderFilter, DxColumnHeaderFilter, DxFilterBuilder, DxFilterPanel } from 'devextreme-vue/card-view';
import { type Order, orders } from './data.ts';

function getOrderDay({ OrderDate }: Order): number {
  return (new Date(OrderDate)).getDay();
}

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

const filterValue = [['Employee', '=', 'Clark Morgan'], 'and', ['DeliveryDate', 'weekends']];

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
