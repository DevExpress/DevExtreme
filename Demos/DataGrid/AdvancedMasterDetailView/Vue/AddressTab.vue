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

<script>

import { DxForm } from 'devextreme-vue/form';

export default {
  components: { DxForm },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      items: ['Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone']
    };
  },
  methods: {
    customizeItem(item) {
      item.template = 'form-item';
    }
  }
};
</script>
