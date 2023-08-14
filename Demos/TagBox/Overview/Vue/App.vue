<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">Default mode</div>
      <div class="dx-field-value">
        <DxTagBox
          :items="simpleProducts"
          :input-attr="{ 'aria-label': 'Product' }"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">Search mode</div>
      <div class="dx-field-value">
        <DxTagBox
          :items="simpleProducts"
          :search-enabled="true"
          :input-attr="{ 'aria-label': 'Product' }"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">Batch selection</div>
      <div class="dx-field-value">
        <DxTagBox
          :items="simpleProducts"
          :show-selection-controls="true"
          :input-attr="{ 'aria-label': 'Product' }"
          apply-value-mode="useButtons"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">Hide selected items</div>
      <div class="dx-field-value">
        <DxTagBox
          :items="simpleProducts"
          :input-attr="{ 'aria-label': 'Product' }"
          :hide-selected-items="true"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">Single line mode</div>
      <div class="dx-field-value">
        <DxTagBox
          :items="simpleProducts"
          :input-attr="{ 'aria-label': 'Product' }"
          :multiline="false"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">Add custom items</div>
      <div class="dx-field-value">
        <DxTagBox
          :items="editableProducts"
          :accept-custom-value="true"
          :input-attr="{ 'aria-label': 'Product' }"
          @customItemCreating="onCustomItemCreating"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">With custom placeholder</div>
      <div class="dx-field-value">
        <DxTagBox
          :items="simpleProducts"
          :input-attr="{ 'aria-label': 'Product' }"
          placeholder="Choose Product..."
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">Disabled</div>
      <div class="dx-field-value">
        <DxTagBox
          :items="simpleProducts"
          :input-attr="{ 'aria-label': 'Product' }"
          :value="[simpleProducts[0]]"
          :disabled="true"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">Data source</div>
      <div class="dx-field-value">
        <DxTagBox
          :data-source="products"
          :input-attr="{ 'aria-label': 'Product' }"
          display-expr="Name"
          value-expr="Id"
        />
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">Custom template</div>
      <div class="dx-field-value">
        <DxTagBox
          :data-source="products"
          :value="value"
          :input-attr="{ 'aria-label': 'Product' }"
          display-expr="Name"
          value-expr="Id"
          item-template="item"
          tag-template="tag"
        >
          <template #item="{ data }">
            <Item :item-data="data"/>
          </template>

          <template #tag="{ data }">
            <Tag :tag-data="data"/>
          </template>
        </DxTagBox>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxTagBox from 'devextreme-vue/tag-box';
import Item from './Item.vue';
import Tag from './Tag.vue';
import { simpleProducts, products } from './data.js';

const editableProducts = ref(simpleProducts.slice());

const value = ref([1, 2]);
const onCustomItemCreating = ref((args) => {
  const newValue = args.text;
  const isItemInDataSource = editableProducts.value.some((item) => item === newValue);
  if (!isItemInDataSource) {
    editableProducts.value = [newValue, ...editableProducts.value];
  }
  args.customItem = newValue;
});
</script>
<style scoped>
body .custom-item {
  padding-left: 7px;
  padding-right: 7px;
}

.custom-item > img {
  height: 30px;
  width: 40px;
  float: left;
  margin-top: 2px;
}

.custom-item > div.product-name {
  margin-left: 40px;
  line-height: 34px;
  font-size: 14px;
}

body .custom-item input {
  background-color: transparent;
}

body .dx-popup-content .custom-item {
  padding-top: 7px;
  padding-bottom: 8px;
}

.dx-popup-content .custom-item > div {
  padding-left: 8px;
  text-indent: 0;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
