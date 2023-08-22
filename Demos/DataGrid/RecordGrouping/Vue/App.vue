<template>
  <div>
    <DxDataGrid
      :allow-column-reordering="true"
      :data-source="customers"
      :key-expr="'ID'"
      :width="'100%'"
      :show-borders="true"
    >

      <DxColumn data-field="CompanyName"/>
      <DxColumn data-field="Phone"/>
      <DxColumn data-field="Fax"/>
      <DxColumn data-field="City"/>
      <DxColumn
        :group-index="0"
        data-field="State"
      />

      <DxGroupPanel :visible="true"/>
      <DxGrouping :auto-expand-all="autoExpandAll"/>
      <DxPaging :page-size="10"/>
      <DxSearchPanel :visible="true"/>
    </DxDataGrid>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          id="autoExpand"
          v-model:value="autoExpandAll"
          text="Expand All Groups"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxCheckBox from 'devextreme-vue/check-box';
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel,
  DxPaging,
} from 'devextreme-vue/data-grid';
import { customers } from './data.js';

const autoExpandAll = ref(true);
</script>
<style scoped>
.options {
  padding: 20px;
  margin-top: 20px;
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
