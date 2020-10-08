<template>
  <div>
    <DxDataGrid
      id="orders"
      :data-source="orders"
      :allow-column-resizing="true"
      :show-borders="true"
      :column-resizing-mode="currentMode"
      :column-min-width="50"
      :column-auto-width="true"
      :columns="columns"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Column resizing mode: </span>
        <DxSelectBox
          :items="resizingModes"
          :value="currentMode"
          :width="250"
          :on-value-changed="changeResizingMode"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  DxDataGrid,
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';

import orders from './data.js';

export default {
  components: {
    DxSelectBox,
    DxDataGrid
  },
  data() {
    return {
      orders: orders,
      columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
      resizingModes: ['nextColumn', 'widget'],
      currentMode: 'nextColumn'
    };
  },
  methods: {
    changeResizingMode(data) {
      this.currentMode = data.value;
    }
  }
};
</script>
<style scoped>
#orders {
    max-height: 310px;
}

.options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
}

.caption {
	font-weight: 500;
	font-size: 18px;
}

.option {
    margin-top: 10px;
}

.option > span {
    position: relative;
    top: 2px;
    margin-right: 10px;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
}
</style>
