<template>
  <div class="demo-container">
    <div class="content">
      <div class="label">Catalog:</div>
      <DxMenu
        :data-source="products"
        @item-click="itemClick"
        @submenu-showing="onSubmenuShowing"
      />
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="limitSubmenuHeight"
          :text="`Limit submenu height to ${SUBMENU_HEIGHT}px`"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxMenu from 'devextreme-vue/menu';
import DxCheckBox from 'devextreme-vue/check-box';
import notify from 'devextreme/ui/notify';
import service from './data.ts';

const SUBMENU_HEIGHT = 200;
const products = ref(service.getProducts());
const limitSubmenuHeight = ref(false);

function itemClick(e: ItemClickEvent) {
  if (!e.itemData.items) {
    notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
  }
}

function onSubmenuShowing({ submenuContainer }: HTMLElement) {
  submenuContainer.style.maxHeight = limitSubmenuHeight.value ? `${SUBMENU_HEIGHT}px` : '';
}
</script>
<style>
.demo-container {
  display: flex;
}

.label {
  font-size: 22px;
  padding-bottom: 24px;
}

.content {
  flex-grow: 1;
  width: 100%;
  min-width: 500px;
  overflow: clip;
}

.options {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}
</style>
