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
        <div>
          <span :class="e.icon"/>
          <span
            v-if="e.items"
            class="dx-icon-spinright"
          />
          {{ e.text }}
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
.dx-menu-item-content span {
  margin-right: 5px;
}

.dx-menu-item .dx-icon-spinright {
  position: absolute;
  top: 7px;
  right: 2px;
}

#image {
  height: 300px;
}

.label {
  color: #767676;
}

</style>
