<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :ref="dataGridRefName"
      :data-source="orders"
      :show-borders="true"
    >
      <DxFilterRow
        :visible="showFilterRow"
        :apply-filter="currentFilter"
      />
      <DxHeaderFilter
        :visible="showHeaderFilter"
      />
      <DxSearchPanel
        :visible="true"
        :width="240"
        placeholder="Search..."
      />
      <DxColumn
        :width="140"
        :header-filter="{ groupInterval: 10000 }"
        data-field="OrderNumber"
        caption="Invoice Number"
      />
      <DxColumn
        :width="120"
        :calculate-filter-expression="calculateFilterExpression"
        :header-filter="{ dataSource: orderHeaderFilter }"
        data-field="OrderDate"
        alignment="right"
        data-type="date"
      />
      <DxColumn
        :width="180"
        data-field="DeliveryDate"
        alignment="right"
        data-type="datetime"
        format="M/d/yyyy, HH:mm"
      />
      <DxColumn
        :header-filter="{ dataSource: saleAmountHeaderFilter }"
        :editor-options="{ format: 'currency', showClearButton: true }"
        data-field="SaleAmount"
        alignment="right"
        format="currency"
      />
      <DxColumn data-field="Employee"/>
      <DxColumn
        :header-filter="{ allowSearch: true }"
        data-field="CustomerStoreCity"
        caption="City"
      />
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Apply Filter </span>
        <DxSelectBox
          id="useFilterApplyButton"
          :items="applyFilterTypes"
          v-model:value="currentFilter"
          :disabled="!showFilterRow"
          value-expr="key"
          display-expr="name"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showFilterRow"
          text="Filter Row"
          @valueChanged="clearFilter()"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showHeaderFilter"
          text="Header Filter"
          @valueChanged="clearFilter()"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxHeaderFilter,
  DxSearchPanel,
  DxFilterRow
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';

import service from './data.js';

const getOrderDay = (rowData) => {
  return (new Date(rowData.OrderDate)).getDay();
};

export default {
  components: {
    DxSelectBox,
    DxCheckBox,
    DxDataGrid,
    DxColumn,
    DxHeaderFilter,
    DxSearchPanel,
    DxFilterRow
  },
  data() {
    const applyFilterTypes = [
        {
          key: 'auto',
          name: 'Immediately'
        },
        {
          key: 'onClick',
          name: 'On Button Click'
        }], currentFilter = applyFilterTypes[0].key;
    return {
      orders: service.getOrders(),
      showFilterRow: true,
      showHeaderFilter: true,
      applyFilterTypes,
      saleAmountHeaderFilter:  [{
        text: 'Less than $3000',
        value: ['SaleAmount', '<', 3000]
      }, {
        text: '$3000 - $5000',
        value: [
          ['SaleAmount', '>=', 3000],
          ['SaleAmount', '<', 5000]
        ]
      }, {
        text: '$5000 - $10000',
        value: [
          ['SaleAmount', '>=', 5000],
          ['SaleAmount', '<', 10000]
        ]
      }, {
        text: '$10000 - $20000',
        value: [
          ['SaleAmount', '>=', 10000],
          ['SaleAmount', '<', 20000]
        ]
      }, {
        text: 'Greater than $20000',
        value: ['SaleAmount', '>=', 20000]
      }],
      calculateFilterExpression(value, selectedFilterOperations, target) {
        let column = this;
        if(target === 'headerFilter' && value === 'weekends') {
          return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
        }
        return column.defaultCalculateFilterExpression.apply(this, arguments);
      },
      currentFilter,
      dataGridRefName: 'dataGrid'
    };
  },
  methods: {
    orderHeaderFilter(data) {
      data.dataSource.postProcess = (results) => {
        results.push({
          text: 'Weekends',
          value: 'weekends'
        });
        return results;
      };
    },
    clearFilter() {
      this.$refs[this.dataGridRefName].instance.clearFilter();
    }
  }
};
</script>
<style scoped>
#gridContainer {
  height: 440px;
}

.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.option > span {
  margin-right: 10px;
}

.option > .dx-selectbox {
  display: inline-block;
  vertical-align: middle;
}
</style>
