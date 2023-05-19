
<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Default mode</div>
        <div class="dx-field-value">
          <DxSelectBox
            :items="simpleProducts"
            :input-attr="{ 'aria-label': 'Simple Product' }"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">With a custom placeholder</div>
        <div class="dx-field-value">
          <DxSelectBox
            :items="simpleProducts"
            :input-attr="{ 'aria-label': 'Product With Placeholder' }"
            :show-clear-button="true"
            placeholder="Choose Product"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Read only</div>
        <div class="dx-field-value">
          <DxSelectBox
            :items="simpleProducts"
            :input-attr="{ 'aria-label': 'ReadOnly Product' }"
            :value="simpleProducts[0]"
            :read-only="true"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxSelectBox
            :items="simpleProducts"
            :input-attr="{ 'aria-label': 'Disabled Product' }"
            :value="simpleProducts[0]"
            :disabled="true"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Data source usage</div>
        <div class="dx-field-value">
          <DxSelectBox
            :data-source="data"
            :input-attr="{ 'aria-label': 'Product ID' }"
            :value="products[0].ID"
            display-expr="Name"
            value-expr="ID"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Custom templates</div>
        <div class="dx-field-value">
          <DxSelectBox
            id="custom-templates"
            :data-source="products"
            :value="products[3].ID"
            :input-attr="{ 'aria-label': 'Templated Product' }"
            display-expr="Name"
            value-expr="ID"
            field-template="field"
            item-template="item"
          >
            <template #field="{ data }">
              <Field :field-data="data"/>
            </template>
            <template #item="{ data }">
              <Item :item-data="data"/>
            </template>
          </DxSelectBox>
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Event Handling</div>
      <div class="dx-field">
        <div class="dx-field-label">Product</div>
        <div class="dx-field-value">
          <DxSelectBox
            :items="simpleProducts"
            :input-attr="{ 'aria-label': 'Product' }"
            v-model:value="value"
            @value-changed="onValueChanged"
          />
        </div>
      </div>
      <div class="current-value">
        Selected product is <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import DxSelectBox from 'devextreme-vue/select-box';
import ArrayStore from 'devextreme/data/array_store';
import notify from 'devextreme/ui/notify';
import Field from './Field.vue';
import Item from './Item.vue';

import service from './data.js';

export default {
  components: {
    DxSelectBox,
    Field,
    Item,
  },
  data() {
    const products = service.getProducts();
    const simpleProducts = service.getSimpleProducts();
    return {
      products,
      simpleProducts,
      data: new ArrayStore({
        data: products,
        key: 'ID',
      }),
      value: simpleProducts[0],
    };
  },
  methods: {
    onValueChanged(e) {
      notify(`The value is changed to: "${e.value}"`);
    },
  },
};
</script>
<style scoped>
.dx-dropdownlist-popup-wrapper .dx-list:not(.dx-list-select-decorator-enabled) .dx-list-item-content {
  padding-left: 7px;
  padding-right: 7px;
}

.custom-item {
  position: relative;
  min-height: 30px;
}

.dx-dropdowneditor-input-wrapper .custom-item > img {
  padding-left: 8px;
}

.custom-item .product-name {
  display: inline-block;
  padding-left: 50px;
  text-indent: 0;
  line-height: 30px;
  font-size: 15px;
  width: 100%;
}

.custom-item > img {
  left: 1px;
  position: absolute;
  top: 50%;
  margin-top: -15px;
}

.dx-theme-material #custom-templates .dx-texteditor-buttons-container {
  display: none;
}

.current-value {
  padding: 10px 0;
}

.current-value > span {
  font-weight: bold;
}

.dx-theme-material .dx-selectbox-container .product-name {
  padding-left: 58px;
}
</style>
