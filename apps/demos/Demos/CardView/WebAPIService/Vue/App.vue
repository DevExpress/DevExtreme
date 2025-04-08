<template>
  <DxCardView
    id="cardview"
    :data-source="dataSource"
    key-expr="OrderID"
    :remote-operations="true"
    width="100%"
    :cards-per-row="3"
  >
    <DxPager
      :allowed-page-sizes="[3, 6, 9, 12, 30]"
      :show-info="true"
      :show-navigation-buttons="true"
      :show-page-size-selector="true"
      :visible="true"
    />
    <DxColumn data-field="OrderID" />
    <DxColumn data-field="OrderDate" data-type="date" />
    <DxColumn data-field="ShippedDate" data-type="date" />
    <DxColumn data-field="Freight" />
    <DxColumn data-field="ShipName" />
    <DxColumn data-field="ShipCity" />
    <DxColumn data-field="ShipCountry" />
  </DxCardView>
</template>

<script>
import { defineComponent } from 'vue';
import { DxCardView, DxColumn, DxCardCover, DxPager } from 'devextreme-vue/card-view';
import AspNetData from 'devextreme-aspnet-data-nojquery';

export default defineComponent({
  components: {
    DxCardView,
    DxColumn,
    DxCardCover,
    DxPager,
  },
  data() {
    const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi/Orders';
    return {
      dataSource: AspNetData.createStore({
        key: 'OrderID',
        loadUrl: url,
      }),
    };
  },
});
</script>
