<template>
  <DxDataGrid
    id="gridContainer"
    ref="dataGridRef"
    :data-source="orders"
    key-expr="ID"
    :show-borders="true"
  >
    <DxGrouping :auto-expand-all="expandAll"/>
    <DxColumnChooser :enabled="true"/>
    <DxLoadPanel :enabled="true"/>
    <DxColumn
      data-field="OrderNumber"
      caption="Invoice Number"
    />
    <DxColumn data-field="OrderDate"/>
    <DxColumn data-field="Employee"/>
    <DxColumn
      data-field="CustomerStoreCity"
      caption="City"
    />
    <DxColumn
      :group-index="0"
      data-field="CustomerStoreState"
      caption="State"
    />
    <DxColumn
      data-field="SaleAmount"
      alignment="right"
      format="currency"
    />
    <DxToolbar>
      <DxItem
        location="before"
        template="totalCountTemplate"
      />
      <DxItem
        location="before"
        template="groupingTemplate"
      />
      <DxItem
        location="before"
        template="collapseTemplate"
      />
      <DxItem
        location="after"
        template="refreshTemplate"
      />
      <DxItem
        name="columnChooserButton"
      />
    </DxToolbar>
    <template #totalCountTemplate>
      <div class="informer">
        <h2 class="count">{{ totalCount }}</h2>
        <span class="name">Total Count</span>
      </div>
    </template>
    <template #groupingTemplate>
      <DxSelectBox
        width="225"
        :items="groupingValues"
        :input-attr="{ 'aria-label': 'Group' }"
        display-expr="text"
        value-expr="value"
        value="CustomerStoreState"
        @value-changed="toggleGroupColumn"
      />
    </template>
    <template #collapseTemplate>
      <DxButton
        :text="expandAll ? 'Collapse All' : 'Expand All'"
        width="136"
        @click="toggleExpandAll"
      />
    </template>
    <template #refreshTemplate>
      <DxButton
        icon="refresh"
        @click="refreshDataGrid"
      />
    </template>
  </DxDataGrid>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxColumnChooser,
  DxLoadPanel,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/data-grid';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxButton } from 'devextreme-vue/button';
import query from 'devextreme/data/query';
import { orders } from './data.js';

const getGroupCount = (groupField) => query(orders)
  .groupBy(groupField)
  .toArray().length;

const dataGridRef = ref<DxDataGrid | null>(null);
const expandAll = ref(true);
const totalCount = ref(getGroupCount('CustomerStoreState'));

const groupingValues = [{
  value: 'CustomerStoreState',
  text: 'Grouping by State',
}, {
  value: 'Employee',
  text: 'Grouping by Employee',
}];

const toggleGroupColumn = (e) => {
  dataGridRef.value!.instance!.clearGrouping();
  dataGridRef.value!.instance!.columnOption(e.value, 'groupIndex', 0);

  totalCount.value = getGroupCount(e.value);
};

const toggleExpandAll = () => {
  expandAll.value = !expandAll.value;
};

const refreshDataGrid = () => {
  dataGridRef.value!.instance!.refresh();
};
</script>
<style scoped>

.dx-datagrid-header-panel {
  padding: 0;
  background-color: rgba(85, 149, 222, 0.6);
}

.dx-datagrid-header-panel .dx-toolbar {
  margin: 0;
  padding-right: 20px;
  background-color: transparent;
}

.dx-datagrid-header-panel .dx-toolbar-items-container {
  height: 70px;
}

.dx-datagrid-header-panel .dx-toolbar-before .dx-toolbar-item:not(:first-child) {
  background-color: rgba(103, 171, 255, 0.6);
}

.dx-datagrid-header-panel .dx-toolbar-before .dx-toolbar-item:last-child {
  padding-right: 10px;
}

.dx-datagrid-header-panel .dx-selectbox {
  margin: auto 10px;
}

.dx-datagrid-header-panel .dx-button {
  margin: auto 0;
}

.informer {
  height: 70px;
  width: 130px;
  text-align: center;
  color: #fff;
}

.count {
  padding-top: 15px;
  line-height: 27px;
  font-size: 28px;
  margin: 0;
}
</style>
