<template>
  <DxCardView
    :data-source="vehicles"
    cards-per-row="auto"
    :card-min-width="260"
    :card-max-width="260"
    card-template="cardTemplate"
    :search-panel="{
      visible: true,
    }"
    :paging="{
      pageSize: 12,
    }"
    :header-filter="{
      visible: true,
    }"
  >
    <DxColumn data-field="TrademarkName"/>
    <DxColumn data-field="Name"/>
    <DxColumn
      data-field="Price"
      format="currency"
    />
    <DxColumn data-field="CategoryName"/>

    <DxColumn data-field="Modification"/>
    <DxColumn data-field="BodyStyleName"/>
    <DxColumn data-field="Horsepower"/>
    <template #cardTemplate="{ data: { card: { data: vehicle } } }">
        <div class="vehicle__card">
            <div class="vehicle__img-wrapper">
                <img class="vehicle__img"
                    :src="`../../../../images/vehicles/image_${vehicle.ID}.png`"
                    :alt="`${vehicle.TrademarkName} ${vehicle.Name}`"
                >
            </div>
            <div class="vehicle__info">
                <div class="vehicle__name" :title="`${vehicle.TrademarkName} ${vehicle.Name}`">
                    {{ vehicle.TrademarkName }} {{ vehicle.Name }}
                </div>
                <div class="vehicle__price">
                    ${{ vehicle.Price }}
                </div>
                <div class="vehicle__type-container">
                    <div class="vehicle__type">
                        {{ vehicle.CategoryName }}
                    </div>
                </div>
                <div class="vehicle__spec-container">
                    <div class="vehicle__modification">
                        {{ vehicle.Modification }}
                    </div>
                    <div class="vehicle__modification">
                        {{ vehicle.BodyStyleName }} {{ vehicle.Horsepower }} h.p.
                    </div>
                </div>
                <div class="vehicle__footer-container">
                    <DxButton
                        text="Image Info"
                        type="default"
                        width="100%"
                        @click="showInfo(vehicle)"
                    >
                    </DxButton>
                </div>
            </div>
        </div>
    </template>
  </DxCardView>
  <DxPopup
    :width="350"
    :height="190"
    v-model:visible="popupVisible"
    :dragEnabled="false"
    :hideOnOutsideClick="true"
    :showCloseButton="false"
    :showTitle="false"
    :onHiding="hideInfo"
>
        <Position at="center" my="center" collision="fit" />
        <template #content>
            <LicenseInfo :vehicle="currentVehicle" />
        </template>
    </DxPopup>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn } from 'devextreme-vue/card-view';
import { DxButton } from 'devextreme-vue/button';
import { DxPopup } from 'devextreme-vue/popup';
import LicenseInfo from './LicenseInfo.vue';
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
