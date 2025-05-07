<template>
  <DxForm
    :form-data="data"
    :items="items"
    :col-count="2"
    :customize-item="customizeItem"
    class="address-form form-container"
  >
    <template #form-item="{ data: item }">
      <span>
        {{ item.editorOptions.value }}
      </span>
    </template>
  </DxForm>
</template>

<script setup lang="ts">
import { DxForm, type DxFormTypes } from 'devextreme-vue/form';
import { type Supplier } from './data.ts';

defineProps<{
  data: Supplier
}>();

const items = [
  { dataField: 'Address' },
  { dataField: 'City' },
  { dataField: 'Region' },
  { dataField: 'PostalCode' },
  { dataField: 'Country' },
  { dataField: 'Phone' },
];

const customizeItem = (item: DxFormTypes.SimpleItem) => {
  item.template = 'form-item';
};
</script>
