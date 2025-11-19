<template>
  <DxDataGrid
    keyExpr="ID"
    :dataSource="vehicles"
    :showBorders="true"
    :aiIntegration="aiIntegration"
    :onAIColumnRequestCreating="onAIColumnRequestCreating"
  >
    <DxGrouping :contextMenuEnabled="false"/>
    <DxPaging :pageSize="10"/>

    <DxColumn
      caption="Trademark"
      dataField="TrademarkName"
      :width="200"
      cellTemplate="trademark-cell"
    />
    <template #trademark-cell="{ data: { data: vehicle} }">
      <Trademark
        :vehicle="vehicle"
        @showInfo="showInfo"
      />
    </template>
    <DxColumn
      dataField="Price"
      alignment="left"
      format="currency"
      :width="100"
    />
    <DxColumn
      caption="Category"
      :minWidth="180"
      cellTemplate="category-cell"
    />
    <template #category-cell="{ data: { data: vehicle} }">
      <Category :category="vehicle.CategoryName"/>
    </template>
    <DxColumn
      dataField="Modification"
      :width="180"
    />
    <DxColumn
      dataField="Horsepower"
      :width="140"
    />
    <DxColumn
      dataField="BodyStyleName"
      caption="Body Style"
      :width="180"
    />
    <DxColumn
      name="AI Column"
      caption="AI Column"
      cssClass="ai__cell"
      type="ai"
      :ai="{
        prompt: 'Identify the country where this vehicle model is originally manufactured or developed, based on its brand, model, and specifications.',
        mode: 'auto',
        noDataText: 'No data',
      }"
      :fixed="true"
      fixedPosition="right"
      :width="200"
    />
  </DxDataGrid>
  <DxPopup
    v-model:visible="popupVisible"
    title="Image Info"
    width="360"
    height="260"
    :dragEnabled="false"
    :hideOnOutsideClick="true"
    :onHiding="hideInfo"
  >
    <DxPosition
      at="center"
      my="center"
      collision="fit"
    />
    <template #content>
      <LicenseInfo :vehicle="currentVehicle"/>
    </template>
  </DxPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DxDataGrid, DxColumn, DxGrouping, DxPaging } from 'devextreme-vue/data-grid';
import { DxPopup, DxPosition } from 'devextreme-vue/popup';
import { vehicles, type Vehicle } from './data.ts';
import { aiIntegration } from './service.ts';
import Trademark from './Trademark.vue';
import Category from './Category.vue';
import LicenseInfo from './LicenseInfo.vue';

const currentVehicle = ref<Vehicle | undefined>();
const popupVisible = ref(false);

const showInfo = (vehicle: Vehicle) => {
  currentVehicle.value = vehicle;
  popupVisible.value = true;
};

const hideInfo = () => {
  popupVisible.value = false;
};

const onAIColumnRequestCreating = (e: { data: Partial<Vehicle>[] }) => {
  e.data = e.data.map((item) => ({
    ID: item.ID,
    TrademarkName: item.TrademarkName,
    Name: item.Name,
    Modification: item.Modification,
  }));
};
</script>

<style scoped>
#app .ai__cell {
  background-color: var(--dx-datagrid-row-alternation-bg);
}
</style>
