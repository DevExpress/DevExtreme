<template>
  <DxTabPanel>
    <DxItem
      title="Orders"
      template="orders-tab"
    />
    <template #orders-tab>
      <OrdersTab
        :supplier-id="masterDetailData.key"
      />
    </template>
    <DxItem
      title="Address"
      template="address-tab"
    />
    <template #address-tab>
      <AddressTab
        :data="masterDetailData.data"
      />
    </template>
  </DxTabPanel>
</template>

<script setup lang="ts">
import { DxTabPanel, DxItem } from 'devextreme-vue/tab-panel';
import OrdersTab from './OrdersTab.vue';
import AddressTab from './AddressTab.vue';

defineProps<{
  masterDetailData: any
}>();

</script>
