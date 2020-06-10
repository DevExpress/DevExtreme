<template>
  <DxTabPanel>
    <DxItem
      title="Orders"
      template="orders-tab"
    />
    <OrdersTab
      slot="orders-tab"
      :supplier-id="masterDetailData.key"
    />
    <DxItem
      title="Address"
      template="address-tab"
    />
    <AddressTab
      slot="address-tab"
      :data="masterDetailData.data"
    />
  </DxTabPanel>
</template>

<script>
import { DxTabPanel, DxItem } from 'devextreme-vue/tab-panel';

import OrdersTab from './OrdersTab.vue';
import AddressTab from './AddressTab.vue';

export default {
  components: { DxTabPanel, DxItem, OrdersTab, AddressTab },
  props: {
    masterDetailData: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
