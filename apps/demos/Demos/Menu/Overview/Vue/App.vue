<template>
  <div class="form">
    <div>
      <div class="label">Catalog:</div>
      <DxMenu
        :data-source="products"
        :show-first-submenu-mode="showFirstSubmenuModes"
        :orientation="orientation"
        :hide-submenu-on-mouse-leave="hideSubmenuOnMouseLeave"
        display-expr="name"
        @item-click="itemClick"
      />
      <div
        v-if="currentProduct"
        id="product-details"
      >
        <img :src="currentProduct.icon">
        <div class="name">{{ currentProduct.name }}</div>
        <div class="price">{{ "$" + currentProduct.price }}</div>
      </div>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <div>Show First Submenu Mode</div>
        <DxSelectBox
          :items="showSubmenuModes"
          :input-attr="{ 'aria-label': 'Language' }"
          v-model:value="selectedFirstSubmenuModes"
          display-expr="name"
          value-expr="name"
        />
      </div>
      <div class="option">
        <div>Orientation</div>
        <DxSelectBox
          :items="['horizontal', 'vertical']"
          :input-attr="{ 'aria-label': 'Orientation' }"
          v-model:value="orientation"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="hideSubmenuOnMouseLeave"
          text="Hide Submenu on Mouse Leave"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import DxMenu from 'devextreme-vue/menu';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import service from './data.ts';

const showSubmenuModes = [{
  name: 'onHover',
  delay: { show: 0, hide: 500 },
}, {
  name: 'onClick',
  delay: { show: 0, hide: 300 },
}];
const products = ref(service.getProducts());
const selectedFirstSubmenuModes = ref(showSubmenuModes[1].name);
const showFirstSubmenuModes = computed(() => showSubmenuModes.find(
  ({ name }) => selectedFirstSubmenuModes.value === name,
));
const orientation = ref('horizontal');
const hideSubmenuOnMouseLeave = ref(false);
const currentProduct = ref(null);

function itemClick(e) {
  if (e.itemData.price) {
    currentProduct.value = e.itemData;
  }
}
</script>
<style scoped>
.form {
  margin-left: 3px;
}

.form > div:first-child {
  margin-right: 320px;
}

.label {
  font-size: 22px;
  padding-bottom: 24px;
}

#product-details {
  width: 400px;
  height: 400px;
  margin: 20px auto 0;
}

#product-details > img {
  height: 300px;
  width: 400px;
}

#product-details > .name {
  text-align: center;
  font-size: 20px;
}

#product-details > .price {
  text-align: center;
  font-size: 24px;
}

.dark #product-details > div {
  color: #f0f0f0;
}

.options {
  padding: 20px;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 260px;
  top: 0;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.hidden {
  visibility: hidden;
}
</style>
