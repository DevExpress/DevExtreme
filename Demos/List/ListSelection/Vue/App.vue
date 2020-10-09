<template>
  <div id="list-demo">
    <div class="widget-container">
      <DxList
        :data-source="dataSource"
        :height="400"
        :show-selection-controls="true"
        :selection-mode="selectionMode"
        :select-all-mode="selectAllMode"
        v-model:selected-item-keys="selectedItemKeys"
      />
      <div class="selected-data">
        <span class="caption">Selected IDs:</span>
        <span>{{ selectedItemKeys.join(", ") }}</span>
      </div>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Selection Mode </span>
        <DxSelectBox
          :items="['none', 'single', 'multiple', 'all']"
          v-model:value="selectionMode"
        />
      </div>
      <div class="option">
        <span>Select All Mode </span>
        <DxSelectBox
          :disabled="selectionMode !== 'all'"
          :items="['page', 'allPages']"
          v-model:value="selectAllMode"
        />
      </div>
    </div>
  </div>
</template>
<script>

import DxSelectBox from 'devextreme-vue/select-box';
import DxList from 'devextreme-vue/list';

import ArrayStore from 'devextreme/data/array_store';

import { tasks } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxList
  },
  data() {
    return {
      dataSource: new ArrayStore({
        key: 'id',
        data: tasks
      }),
      selectedItemKeys: [],
      selectionMode: 'all',
      selectAllMode: 'page'
    };
  }
};
</script>
<style>
.selected-data,
.options {
    margin-top: 20px;
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
}

.selected-data .caption {
    font-weight: bold;
    font-size: 115%;
}

.options .caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}

.option > span {
    width: 124px;
    display: inline-block;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    max-width: 350px;
}
</style>
