<template>
  <DxCardView
    id="cardView"
    :data-source="orders"
    key-expr="ID"
    :card-min-width="100"
    :word-wrap-enabled="true"
    :header-filter="headerFilterConfig"
    :filter-panel="filterPanelConfig"
    :filter-builder="filterBuilderConfig"
    :filter-value="filterValue"
  >
    <DxColumn
      data-field="OrderNumber"
      :header-filter="orderNumberHeaderFilterConfig"
    />
    <DxColumn
      data-field="OrderDate"
      data-type="date"
    />
    <DxColumn
      data-field="DeliveryDate"
      data-type="datetime"
    />
    <DxColumn
      data-field="SaleAmount"
      data-type="number"
      :header-filter="saleAmountHeaderFilterConfig"
    />
    <DxColumn
      data-field="CustomerStoreCity"
    />
    <DxColumn
      data-field="Employee"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn } from 'devextreme-vue/card-view';
import { type Order, orders } from './data.ts';

function getDeliveryHours(rowData: Order) {
  return (new Date(rowData.DeliveryDate)).getHours();
}

// TODO: make nested
const headerFilterConfig = {
  visible: true,
};

// TODO: make nested
const filterPanelConfig = {
  visible: true,
};

// TODO: make nested
const filterBuilderConfig = {
  customOperations: [{
    name: 'beforeNoon',
    caption: 'Before noon',
    dataTypes: ['datetime'],
    icon: 'check',
    hasValue: false,
    calculateFilterExpression() {
      return [getDeliveryHours, '<', 12];
    },
  }, {
    name: 'afterNoon',
    caption: 'After noon',
    dataTypes: ['datetime'],
    icon: 'check',
    hasValue: false,
    calculateFilterExpression() {
      return [getDeliveryHours, '>=', 12];
    },
  }],
};

const filterValue = [['Employee', '=', 'Clark Morgan'], 'and', ['DeliveryDate', 'beforeNoon']];

// TODO: make nested
const saleAmountHeaderFilterConfig = {
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
};

// TODO: make nested
const orderNumberHeaderFilterConfig = { groupInterval: 10000 };
</script>
