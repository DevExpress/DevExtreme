<template>
  <div>
    <DxDataGrid
      :data-source="sales"
      :show-borders="true"
      key-expr="orderId"
    >
      <DxColumn
        :width="90"
        data-field="orderId"
        caption="Order ID"
      />
      <DxColumn data-field="city"/>
      <DxColumn
        :width="180"
        data-field="country"
      />
      <DxColumn data-field="region"/>
      <DxColumn
        data-field="date"
        data-type="date"
      />
      <DxColumn
        :width="90"
        data-field="amount"
        format="currency"
      />

      <DxPaging :page-size="10"/>
      <DxSelection
        :select-all-mode="allMode"
        :show-check-boxes-mode="checkBoxesMode"
        mode="multiple"
      />
      <DxFilterRow :visible="true"/>
    </DxDataGrid>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Select All Mode </span>
        <DxSelectBox
          id="select-all-mode"
          :input-attr="{ 'aria-label': 'Select All Mode' }"
          :data-source="selectAllModes"
          :disabled="checkBoxesMode === 'none'"
          v-model:value="allMode"
        />
      </div>
      <div class="option checkboxes-mode">
        <span>Show Checkboxes Mode </span>
        <DxSelectBox
          id="show-checkboxes-mode"
          :input-attr="{ 'aria-label': 'Show Checkboxes Mode' }"
          :data-source="showCheckBoxesModes"
          v-model:value="checkBoxesMode"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxSelectBox } from 'devextreme-vue/select-box';
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxSelection,
  DxFilterRow,
} from 'devextreme-vue/data-grid';
import themes from 'devextreme/ui/themes';
import { sales } from './data.ts';

const selectAllModes = ['allPages', 'page'];
const showCheckBoxesModes = ['none', 'onClick', 'onLongTap', 'always'];

const allMode = ref('allPages');

const checkBoxesMode = ref(themes.current().startsWith('material') ? 'always' : 'onClick');
</script>
<style scoped>
.options {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: relative;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.checkboxes-mode {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.option > .dx-selectbox {
  width: 150px;
  display: inline-block;
  vertical-align: middle;
}

.option > span {
  margin-right: 10px;
}
</style>
