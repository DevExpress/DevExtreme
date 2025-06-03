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

<style>
  .vehicle__img-wrapper {
      height: 146px;
      border-bottom: var(--dx-border-width) solid var(--dx-color-border);
      background-color: #fff;
  }

  .vehicle__img {
      height: 100%;
      width: 100%;
      object-fit: scale-down;
  }

  .vehicle__info {
      padding: 12px;
  }

  .vehicle__name {
      font-weight: 700;
      font-size: 20px;
      line-height: 28px;
      height: 28px;
      padding-left: 12px;
      padding-right: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
  }

  .vehicle__price {
      padding-left: 12px;
      padding-right: 12px;
      height: 32px;
      font-weight: 700;
      font-size: 24px;
      color: #0F6CBD;
  }

  .vehicle__type-container {
      padding: 12px;
      display: inline-block;
  }

  .vehicle__type {
      padding: 2px 6px;
      background-color: var(--dx-color-separator);
      border-radius: 13px;
  }

  .vehicle__spec {
      padding: 2px 12px;
  }

  .vehicle__modification {
      height: 24px;
      padding: 2px 0 2px 12px;
  }

  .vehicle__footer-container {
      padding: 12px;
      height: 56px;
  }

  .vehicle__image-licence-caption {
      font-weight: 600;
  }

  .license__link {
      color: var(--dx-color-link);
  }
</style>
