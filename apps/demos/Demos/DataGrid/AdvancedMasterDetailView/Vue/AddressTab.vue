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
import { DxForm, DxFormTypes } from 'devextreme-vue/form';
import { Supplier } from './data.ts';

defineProps<{
  data: Supplier
}>();

const items = ['Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone'];

const customizeItem = (item: DxFormTypes.SimpleItem) => {
  item.template = 'form-item';
};
</script>
