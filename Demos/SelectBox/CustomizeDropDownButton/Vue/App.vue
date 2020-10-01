<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Image as the icon</div>
        <div class="dx-field-value">
          <DxSelectBox
            :data-source="simpleProducts"
            drop-down-button-template="imageIcon"
          >
            <template #imageIcon="{}">
              <img
                src="../../../../images/icons/custom-dropbutton-icon.svg"
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
            drop-down-button-template="loadIcon"
          >
            <template #loadIcon="{}">
              <div>
                <DxLoadIndicator :visible="!isLoaded"/>
                <span :hidden="!isLoaded">
                  <img
                    src="../../../../images/icons/custom-dropbutton-icon.svg"
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
                <img :src="'../../../../images/icons/' + itemData.IconSrc">
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
<script>
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxLoadIndicator } from 'devextreme-vue/load-indicator';
import { products, simpleProducts } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxLoadIndicator
  },
  data() {
    return {
      products,
      simpleProducts,
      isLoaded: true,
      deferredProducts: {
        loadMode: 'raw',
        load: () => {
          this.isLoaded = false;
          var promise = new Promise((resolve) => {
            setTimeout(() => {
              resolve(simpleProducts);
              this.isLoaded = true;
            }, 3000);
          });

          return promise;
        }
      },
      selectedItem: products[0]
    };
  }
};
</script>
<style scoped>
.dx-dropdowneditor-button .dx-button-content {
    text-align: center;
}

.dx-theme-material .dx-dropdowneditor-button .dx-button-content .dx-loadindicator {
    width: 24px;
    height: 24px;
}

.custom-icon {
    max-height: 100%;
    max-width: 100%;
    font-size: 28px;
    display: inline-block;
    vertical-align: middle;
}

.dx-theme-android5 .custom-item img {
    padding: 4px 22px 0 0;
}

.custom-item img {
    float: right;
}

.custom-item .product-name {
    line-height: 32px;
    padding-left: 5px;
}
</style>
