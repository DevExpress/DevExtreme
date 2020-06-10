<template>
  <div>
    <DxDataGrid
      :data-source="orderHistoryStore"
      :show-borders="true"
    >
      <DxPaging :page-size="5"/>

      <DxColumn data-field="OrderID"/>
      <DxColumn
        data-field="OrderDate"
        data-type="date"
      />
      <DxColumn data-field="ShipCountry"/>
      <DxColumn data-field="ShipCity"/>
      <DxColumn
        data-field="UnitPrice"
        format="currency"
      />
      <DxColumn data-field="Quantity"/>
      <DxColumn
        data-field="Discount"
        format="percent"
      />

      <DxSummary>
        <DxTotalItem
          column="UnitPrice"
          summary-type="sum"
        >
          <DxValueFormat
            :precision="2"
            format="currency"
          />
        </DxTotalItem>
        <DxTotalItem
          column="Quantity"
          summary-type="count"
        />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxSummary,
  DxTotalItem,
  DxValueFormat
} from 'devextreme-vue/data-grid';

import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxSummary,
    DxTotalItem,
    DxValueFormat
  },
  props: {
    productId: {
      type: Number,
      default: null
    }
  },
  computed: {
    orderHistoryStore() {
      return this.productId === null ? null : {
        store: createStore({
          key: 'OrderID',
          loadParams: { ProductID: this.productId },
          loadUrl: `${url}/GetOrdersByProduct`
        })
      };
    }
  }
};
</script>
