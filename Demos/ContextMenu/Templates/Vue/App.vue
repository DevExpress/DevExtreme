<template>
  <div>
    <div class="label">
      Right click an image to display the context menu:
    </div>
    <img
      id="image"
      alt="product"
      src="../../../../images/products/5.png"
    >
    <DxContextMenu
      :data-source="items"
      :width="200"
      target="#image"
      @item-click="itemClick"
    >
      <template #item="{ data: e }">
        <div class="item-template-container">
          <span
            v-if="e.icon"
            :class="['dx-icon', e.icon]"
          />
          <span class="dx-menu-item-text">{{ e.text }}</span>
          <span
            v-if="e.items"
            class="dx-icon-spinright dx-icon"
          />
        </div>
      </template>
    </DxContextMenu>
  </div>
</template>
<script>

import DxContextMenu from 'devextreme-vue/context-menu';
import notify from 'devextreme/ui/notify';

import { contextMenuItems as items } from './data.js';

export default {
  components: {
    DxContextMenu,
  },
  data() {
    return {
      items,
    };
  },
  methods: {
    itemClick(e) {
      if (!e.itemData.items) {
        notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
      }
    },
  },
};
</script>
<style>
.item-template-container {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.dx-menu-item-text {
  flex-grow: 1;
}

#image {
  height: 300px;
}

.label {
  color: #767676;
}
</style>
