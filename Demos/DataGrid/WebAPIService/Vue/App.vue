<template>
  <DxDataGrid
    :show-borders="true"
    :data-source="dataSource"
    :remote-operations="true"
    :height="600"
  >
    <DxColumn
      data-field="CustomerID"
      caption="Customer"
    >
      <DxLookup
        :data-source="customersData"
        value-expr="Value"
        display-expr="Text"
      />
      <DxStringLengthRule
        :max="5"
        message="The field Customer must be a string with a maximum length of 5."
      />
    </DxColumn>
    <DxColumn
      data-field="OrderDate"
      data-type="date"
    >
      <DxRequiredRule message="The OrderDate field is required."/>
    </DxColumn>
    <DxColumn data-field="Freight">
      <DxHeaderFilter :group-interval="100"/>
      <DxRangeRule
        :min="0"
        :max="2000"
        message="The field Freight must be between 0 and 2000."
      />
    </DxColumn>
    <DxColumn data-field="ShipCountry">
      <DxStringLengthRule
        :max="15"
        message="The field ShipCountry must be a string with a maximum length of 15."
      />
    </DxColumn>
    <DxColumn
      data-field="ShipVia"
      caption="Shipping Company"
      data-type="number"
    >
      <DxLookup
        :data-source="shippersData"
        value-expr="Value"
        display-expr="Text"
      />
    </DxColumn>
    <DxMasterDetail
      :enabled="true"
      template="masterDetailTemplate"
    />
    <template #masterDetailTemplate="{ data: order }">
      <MasterDetailGrid
        :id="order.key"
        :url="url"
      />
    </template>
    <DxFilterRow :visible="true"/>
    <DxHeaderFilter :visible="true"/>
    <DxGroupPanel :visible="true"/>
    <DxScrolling mode="virtual"/>
    <DxEditing
      :allow-adding="true"
      :allow-updating="true"
      :allow-deleting="true"
      mode="row"
    />
    <DxGrouping :auto-expand-all="false"/>
    <DxSummary>
      <DxTotalItem
        column="Freight"
        summary-type="sum"
      >
        <DxValueFormat
          :precision="2"
          type="decimal"
        />
      </DxTotalItem>
      <DxGroupItem
        column="Freight"
        summary-type="sum"
      >
        <DxValueFormat
          :precision="2"
          type="decimal"
        />
      </DxGroupItem>
      <DxGroupItem summary-type="count"/>
    </DxSummary>
  </DxDataGrid>
</template>
<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxFilterRow,
  DxHeaderFilter,
  DxGroupPanel,
  DxGrouping,
  DxScrolling,
  DxSummary,
  DxLookup,
  DxTotalItem,
  DxGroupItem,
  DxMasterDetail,
  DxStringLengthRule,
  DxRequiredRule,
  DxRangeRule,
  DxValueFormat
} from 'devextreme-vue/data-grid';

import MasterDetailGrid from './MasterDetailGrid.vue';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

const dataSource = createStore({
  key: 'OrderID',
  loadUrl: `${url}/Orders`,
  insertUrl: `${url}/InsertOrder`,
  updateUrl: `${url}/UpdateOrder`,
  deleteUrl: `${url}/DeleteOrder`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

const customersData = createStore({
  key: 'Value',
  loadUrl: `${url}/CustomersLookup`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

const shippersData = createStore({
  key: 'Value',
  loadUrl: `${url}/ShippersLookup`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxFilterRow,
    DxHeaderFilter,
    DxGroupPanel,
    DxGrouping,
    DxScrolling,
    DxSummary,
    DxLookup,
    DxTotalItem,
    DxGroupItem,
    DxMasterDetail,
    DxStringLengthRule,
    DxRangeRule,
    DxRequiredRule,
    DxValueFormat,
    MasterDetailGrid
  },
  data() {
    return {
      url,
      customersData,
      shippersData,
      dataSource
    };
  }
};
</script>
