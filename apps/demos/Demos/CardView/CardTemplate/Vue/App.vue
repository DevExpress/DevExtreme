<template>
  <DxCardView
    :data-source="vehicles"
    cards-per-row="auto"
    :card-min-width="260"
    card-template="cardTemplate"
  >
    <DxHeaderFilter :visible="true" />
    <DxSearchPanel :visible="true" />
    <DxPager :pageSize="12" />

    <DxColumn data-field="TrademarkName"/>
    <DxColumn data-field="Name"/>
    <DxColumn
      data-field="Price"
      format="currency"
    >
      <DxHeaderFilter :groupInterval="20000" />
    </DxColumn>
    <DxColumn data-field="CategoryName"/>
    <DxColumn data-field="Modification"/>
    <DxColumn data-field="BodyStyleName"/>
    <DxColumn data-field="Horsepower"/>
    <template #cardTemplate="{ data: { card: { data: vehicle } } }">
        <VehicleCard :vehicle="vehicle" @show-info="showInfo" />
    </template>
  </DxCardView>
  <DxPopup
    :width="350"
    :height="240"
    v-model:visible="popupVisible"
    :dragEnabled="false"
    :hideOnOutsideClick="true"
    title="Image Info"
    :onHiding="hideInfo"
>
        <DxPosition at="center" my="center" collision="fit" />
        <template #content>
            <LicenseInfo :vehicle="currentVehicle" />
        </template>
    </DxPopup>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn, DxHeaderFilter, DxSearchPanel, DxPager } from 'devextreme-vue/card-view';
import { DxPopup, DxPosition } from 'devextreme-vue/popup';
import LicenseInfo from './LicenseInfo.vue';
import VehicleCard from './VehicleCard.vue';
import { vehicles } from './data.ts';
import { ref } from 'vue';

const popupVisible = ref(false);
const currentVehicle = ref(null);

function showInfo(vehicle) {
  currentVehicle.value = vehicle;
  popupVisible.value = true;
}
function hideInfo() {
  popupVisible.value = false;
}
</script>
