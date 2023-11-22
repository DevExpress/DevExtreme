<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Image as the icon</div>
        <div class="dx-field-value">
          <DxSelectBox
            :data-source="simpleProducts"
            :input-attr="{ 'aria-label': 'Product' }"
            drop-down-button-template="imageIcon"
          >
            <template #imageIcon="{}">
              <img
                alt="Custom icon"
                :src="'../../../../images/icons/custom-dropbutton-icon.svg'"
                class="custom-icon"
              >
            </template>
          </DxSelectBox>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Load indicator as the icon</div>
        <div class="dx-field-value">
          <DxSelectBox
            :data-source="deferredProducts"
            :input-attr="{ 'aria-label': 'Deferred Product' }"
            drop-down-button-template="loadIcon"
          >
            <template #loadIcon="{}">
              <div>
                <DxLoadIndicator :visible="!isLoaded"/>
                <span :hidden="!isLoaded">
                  <img
                    alt="Custom icon"
                    :src="'../../../../images/icons/custom-dropbutton-icon.svg'"
                    class="custom-icon"
                  >
                </span>
              </div>
            </template>
          </DxSelectBox>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Value-dependent icon</div>
        <div class="dx-field-value">
          <DxSelectBox
            :data-source="products"
            v-model:selected-item="selectedItem"
            :input-attr="{ 'aria-label': 'Product' }"
            :value="1"
            :show-clear-button="true"
            display-expr="Name"
            value-expr="ID"
            drop-down-button-template="valueIcon"
            item-template="customItem"
          >
            <template #valueIcon="{}">
              <div>
                <img
                  v-if="selectedItem"
                  alt="Custom icon"
                  :src="'../../../../images/icons/' + selectedItem.IconSrc"
                  class="custom-icon"
                >
                <div
                  v-if="!selectedItem"
                  class="dx-dropdowneditor-icon"
                />
              </div>
            </template>
            <template #customItem="{ data: itemData }">
              <div class="custom-item">
                <img
                  :alt="itemData.Name"
                  :src="'../../../../images/icons/' + itemData.IconSrc"
                >
                <div class="product-name">
                  {{ itemData.Name }}
                </div>
              </div>
            </template>
          </DxSelectBox>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxLoadIndicator } from 'devextreme-vue/load-indicator';
import { products, simpleProducts } from './data.js';

const isLoaded = ref(true);
const selectedItem = ref(products[0]);
const deferredProducts = {
  loadMode: 'raw',
  load: () => {
    isLoaded.value = false;
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(simpleProducts);
        isLoaded.value = true;
      }, 3000);
    });

    return promise;
  },
};
</script>
<style scoped>
.dx-dropdowneditor-button .dx-button-content {
  text-align: center;
}

.dx-dropdowneditor-button .dx-button-content .dx-loadindicator {
  width: 1.5em;
  height: 1.5em;
}

.custom-icon {
  max-height: 100%;
  max-width: 100%;
  font-size: 28px;
  display: inline-block;
  vertical-align: middle;
}

.custom-item img {
  float: right;
}

.custom-item .product-name {
  line-height: 32px;
  padding-left: 5px;
}
</style>
