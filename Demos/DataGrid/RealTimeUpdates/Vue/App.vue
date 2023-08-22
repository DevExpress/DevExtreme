<template>
  <div>
    <DxDataGrid
      :data-source="productsDataSource"
      :repaint-changes-only="true"
      :two-way-binding-enabled="false"
      :column-auto-width="true"
      :show-borders="true"
    >
      <DxPaging :page-size="10"/>

      <DxColumn
        data-field="ProductName"
        data-type="string"
      />
      <DxColumn
        data-field="UnitPrice"
        data-type="number"
        format="currency"
      />
      <DxColumn
        data-field="OrderCount"
        data-type="number"
      />
      <DxColumn
        data-field="Quantity"
        data-type="number"
      />
      <DxColumn
        data-field="Amount"
        data-type="number"
        format="currency"
      />

      <DxSummary>
        <DxTotalItem
          column="ProductName"
          summary-type="count"
        />
        <DxTotalItem
          column="Amount"
          summary-type="sum"
          display-format="{0}"
          value-format="currency"
        />
        <DxTotalItem
          column="OrderCount"
          summary-type="sum"
          display-format="{0}"
        />
      </DxSummary>

      <DxMasterDetail
        :enabled="true"
        template="productDetail"
      />

      <template #productDetail="{ data: detail }">
        <DxDataGrid
          :data-source="getDetailGridDataSource(detail.data)"
          :column-auto-width="true"
          :repaint-changes-only="true"
          :two-way-binding-enabled="false"
          :show-borders="true"
        >
          <DxPaging :page-size="5"/>

          <DxColumn
            data-field="OrderID"
            data-type="number"
          />
          <DxColumn
            data-field="ShipCity"
            data-type="string"
          />
          <DxColumn
            data-field="OrderDate"
            data-type="datetime"
            format="yyyy/MM/dd HH:mm:ss"
          />
          <DxColumn
            data-field="UnitPrice"
            data-type="number"
            format="currency"
          />
          <DxColumn
            data-field="Quantity"
            data-type="number"
          />
          <DxColumn
            :allow-sorting="true"
            :calculate-cell-value="getAmount"
            caption="Amount"
            format="currency"
            data-type="number"
          />

          <DxSummary>
            <DxTotalItem
              column="OrderID"
              summary-type="count"
            />
            <DxTotalItem
              column="Quantity"
              summary-type="sum"
              display-format="{0}"
            />
            <DxTotalItem
              column="Amount"
              summary-type="sum"
              display-format="{0}"
              value-format="currency"
            />
          </DxSummary>
        </DxDataGrid>
      </template>
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Update frequency:</span>
        <DxSlider
          :min="10"
          :step="10"
          :max="5000"
          v-model:value="updatesPerSecond"
        >
          <DxTooltip
            :enabled="true"
            format="#0 per second"
            show-mode="always"
            position="top"
          />
        </DxSlider>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxSummary,
  DxTotalItem,
  DxMasterDetail,
  DxPaging,
} from 'devextreme-vue/data-grid';
import { DxSlider, DxTooltip } from 'devextreme-vue/slider';
import {
  productsStore, ordersStore, getOrderCount, addOrder,
} from './data.js';

const updatesPerSecond = ref(100);

const productsDataSource = {
  store: productsStore,
  reshapeOnPush: true,
};

let interval: any;

onMounted(() => {
  interval = setInterval(() => {
    if (getOrderCount() > 500000) {
      return;
    }

    for (let i = 0; i < updatesPerSecond.value / 20; i += 1) {
      addOrder();
    }
  }, 50);
});

onUnmounted(() => {
  clearInterval(interval);
});

const getDetailGridDataSource = (product) => ({
  store: ordersStore,
  reshapeOnPush: true,
  filter: ['ProductID', '=', product.ProductID],
});

const getAmount = (order) => order.UnitPrice * order.Quantity;
</script>
<style scoped>
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
  display: flex;
  align-items: center;
}

.option > span {
  position: relative;
  top: 2px;
  margin-right: 10px;
}

.option > .dx-widget {
  width: 500px;
  display: inline-block;
  vertical-align: middle;
}
</style>
