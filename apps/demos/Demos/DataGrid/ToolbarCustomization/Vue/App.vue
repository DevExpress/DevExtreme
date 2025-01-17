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
        locateInMenu="auto"
        template="groupingTemplate"
      />
      <DxItem
        location="before"
        locateInMenu="auto"
        widget="dxButton"
        :options="toggleButtonOptions"
      />
      <DxItem
        location="after"
        locateInMenu="auto"
        showText="inMenu"
        widget="dxButton"
        :options="refreshButtonOptions"
      />
      <DxItem
        name="columnChooserButton"
      />
    </DxToolbar>
    <template #totalCountTemplate>
      <div class="informer">
        <div class="count">{{ totalCount }}</div>
        <span>Total Count</span>
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
  </DxDataGrid>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxColumnChooser,
  DxLoadPanel,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/data-grid';
import { DxSelectBox, DxSelectBoxTypes } from 'devextreme-vue/select-box';
import query from 'devextreme/data/query';
import { orders } from './data.ts';

const getGroupCount = (groupField: string) => query(orders)
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

const toggleGroupColumn = (e: DxSelectBoxTypes.ValueChangedEvent) => {
  dataGridRef.value!.instance!.clearGrouping();
  dataGridRef.value!.instance!.columnOption(e.value, 'groupIndex', 0);

  totalCount.value = getGroupCount(e.value);
};

const toggleExpandAll = () => {
  expandAll.value = !expandAll.value;
};

const toggleButtonOptions = computed(() => ({
  text: expandAll.value ? 'Collapse All' : 'Expand All',
  width: 136,
  onClick: toggleExpandAll,
}));

const refreshButtonOptions = {
  icon: 'refresh',
  text: 'Refresh',
  onClick: () => {
    dataGridRef.value!.instance!.refresh();
  },
};
</script>
<style scoped>

#gridContainer .informer {
  display: grid;
  width: 120px;
  grid-template-columns: 100%;
  padding-right: 20px;
  text-align: center;
}

#gridContainer .count {
  font-size: 18px;
  font-weight: 500;
}

#gridContainer .dx-toolbar-items-container {
  min-height: 44px;
}
</style>
