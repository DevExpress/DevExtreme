<template>
  <DxCardView
    id="cardView"
    :data-source="orders"
    key-expr="OrderNumber"
    :header-filter="headerFilterConfig"
  >
    <DxColumn
      data-field="OrderNumber"
      :header-filter="orderNumberHeaderFilterConfig"
    />
    <DxColumn
      data-field="OrderDate"
      dataType="date"
      :calculate-filter-expression="calculateOrderDateFilterExpression"
      :header-filter="orderDateHeaderFilterConfig"
    />
    <DxColumn
      data-field="SaleAmount"
      data-type="number"
      :header-filter="saleAmountHeaderFilterConfig"
    />
    <DxColumn
      data-field="StoreCity"
      :header-filter="storeCityHeaderFilterConfig"
    />
    <DxColumn
      data-field="StoreState"
      :header-filter="storeStateHeaderFilterConfig"
    />
    <DxColumn
      data-field="Employee"
    />
  </DxCardView>
</template>
<script setup lang="ts">
  import { DxCardView, DxColumn } from 'devextreme-vue/card-view';
  import { Order, orders } from './data.ts';

  function getOrderDay(rowData: Order) {
    return new Date(rowData.OrderDate).getDay();
  }

  function calculateOrderDateFilterExpression(value, selectedFilterOperations, target) {
    if (value === 'weekends') {
      return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
    }
    return this.defaultCalculateFilterExpression(value, selectedFilterOperations, target);
  }
  
  // TODO: make nested
  const headerFilterConfig = {
    visible: true
  };

  // TODO: make nested
  const orderDateHeaderFilterConfig = {
    dataSource(data) {
      data.dataSource.postProcess = function (results) {
        results.push({
          text: 'Weekends',
          value: 'weekends',
        });
        return results;
      };
    },
  };

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
  const storeCityHeaderFilterConfig = {
    search: {
      enabled: true,
      editorOptions: {
        placeholder: 'Search city or state',
      },
      searchExpr: ['StoreCity', 'StoreState'],
    },
  };

  // TODO: make nested
  const storeStateHeaderFilterConfig = {
    search: {
      enabled: true,
      editorOptions: {
        placeholder: 'Search state or city',
      },
      searchExpr: ['StoreState', 'StoreCity'],
    },
  };

  // TODO: make nested
  const orderNumberHeaderFilterConfig = { groupInterval: 10000 };
</script>
