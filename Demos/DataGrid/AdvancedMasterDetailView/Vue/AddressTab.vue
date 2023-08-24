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
import { DxForm } from 'devextreme-vue/form';
import { SimpleItem } from 'devextreme/ui/form';

import { Supplier } from './data.ts';

defineProps<{
  data: Supplier
}>();

const items = ['Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone'];

const customizeItem = (item: SimpleItem) => {
  item.template = 'form-item';
};
</script>
