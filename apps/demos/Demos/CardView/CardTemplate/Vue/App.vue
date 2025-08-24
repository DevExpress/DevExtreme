<template>
  <DxCardView
    :data-source="vehicles"
    :height="1120"
    cards-per-row="auto"
    :card-min-width="240"
    card-template="cardTemplate"
  >
    <DxHeaderFilter :visible="true"/>
    <DxSearchPanel :visible="true"/>
    <DxPaging :pageSize="12"/>

    <DxColumn
      data-field="TrademarkName"
      caption="Trademark"
    />
    <DxColumn
      data-field="Name"
      caption="Model"
    />
    <DxColumn
      data-field="Price"
      format="currency"
    >
      <DxHeaderFilter :groupInterval="20000"/>
    </DxColumn>
    <DxColumn
      data-field="CategoryName"
      caption="Category"
    />
    <DxColumn data-field="Modification"/>
    <DxColumn
      data-field="BodyStyleName"
      caption="Body Style"
    />
    <DxColumn data-field="Horsepower"/>
    <template
      #cardTemplate="{
        data: {
          card: {
            data: vehicle,
            data: {
              ID,
              TrademarkName,
              Name,
              CategoryName,
              Modification,
              BodyStyleName,
              Horsepower,
            },
            fields,
          }
        }
      }"
    >
      <VehicleCard
        :vehicle="vehicle"
        :id="ID"
        :model="`${TrademarkName} ${Name}`"
        :price="fields?.find(f => f.column?.dataField === 'Price')?.text"
        :category-name="CategoryName"
        :modification="Modification"
        :body-style-name="BodyStyleName"
        :horsepower="Horsepower"
        @show-info="showInfo"/>
    </template>
  </DxCardView>
  <DxPopup
    :width="360"
    :height="260"
    v-model:visible="popupVisible"
    :dragEnabled="false"
    :hideOnOutsideClick="true"
    title="Image Info"
    :onHiding="hideInfo"
  >
    <DxPosition at="center" my="center" collision="fit"/>
    <template #content>
      <LicenseInfo :vehicle="currentVehicle"/>
    </template>
  </DxPopup>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn, DxHeaderFilter, DxSearchPanel, DxPaging } from 'devextreme-vue/card-view';
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
