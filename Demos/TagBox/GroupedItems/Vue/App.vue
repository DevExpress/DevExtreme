<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">
        Grouped items
      </div>
      <div class="dx-field-value">
        <DxTagBox
          :data-source="products"
          :input-attr="{ 'aria-label': 'Product' }"
          :value="[17, 19]"
          :grouped="true"
          display-expr="Name"
          value-expr="ID"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">
        Grouped items with search enabled
      </div>
      <div class="dx-field-value">
        <DxTagBox
          :data-source="products"
          :value="[17, 19]"
          :grouped="true"
          :input-attr="{ 'aria-label': 'Product' }"
          :search-enabled="true"
          display-expr="Name"
          value-expr="ID"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">
        Grouped items with a custom group template
      </div>
      <div class="dx-field-value">
        <DxTagBox
          :data-source="products"
          :input-attr="{ 'aria-label': 'Product' }"
          :value="[18]"
          :grouped="true"
          display-expr="Name"
          value-expr="ID"
        >
          <template #group="{ data }">
            <Group :item-data="data"/>
          </template>
        </DxTagBox>
      </div>
    </div>
  </div>
</template>
<script>
import { DxTagBox } from 'devextreme-vue/tag-box';
import DataSource from 'devextreme/data/data_source';
import Group from './Group.vue';

import productsData from './data.js';

export default {
  components: {
    DxTagBox,
    Group,
  },
  data() {
    return {
      products: new DataSource({
        store: productsData,
        key: 'ID',
        group: 'Category',
      }),
    };
  },
};
</script>
<style scoped>
  .dx-field {
    margin-bottom: 50px;
  }
</style>
