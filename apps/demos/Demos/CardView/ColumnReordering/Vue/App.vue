<script setup>
import { ref } from 'vue';
import {
  DxCardView, DxColumn, DxCardCover, DxPager, DxPaging,
} from 'devextreme-vue/card-view';
import { employees } from './data.js';

const dataSource = ref(employees);
</script>

<template>
  <DxCardView
    :data-source="dataSource"
    key-expr="ID"
    :cards-per-row="3"
    :allow-column-reordering="true"
  >
    <DxColumn
      data-field="ID"
      :allow-reordering="false"
    />
    <DxColumn
      caption="Full Name"
      :calculate-cell-value="(data) => `${data.FirstName} ${data.LastName}`"
    />
    <DxColumn data-field="Prefix"/>
    <DxColumn data-field="Position"/>
    <DxColumn data-field="BirthDate"/>
    <DxColumn data-field="HireDate"/>
    <DxColumn data-field="Address"/>
    <DxCardCover
      :image-expr="(data) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`"
      alt-expr="FirstName"
    />
    <DxPaging :page-size="6"/>
    <DxPager
      :visible="true"
      :show-page-size-selector="true"
      :allowed-page-sizes="'auto'"
    />
  </DxCardView>
</template>
