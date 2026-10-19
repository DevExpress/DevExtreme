<template>
  <DxDropDownBox
    ref="dropDownBoxRef"
    :drop-down-options="dropDownOptions"
    :input-attr="{ 'aria-label': 'Owner' }"
    :data-source="dataSource"
    v-model:value="currentValue"
    display-expr="FullName"
    value-expr="ID"
    content-template="contentTemplate"
  >
    <template #contentTemplate="{}">
      <DxDataGrid
        :data-source="dataSource"
        :remote-operations="true"
        :height="250"
        :hover-state-enabled="true"
        :on-context-menu-preparing="onContextMenuPreparing"
        :on-row-click="onRowClick"
        :focused-row-enabled="true"
        :focused-row-key="currentValue"
      >
        <DxColumn data-field="FullName"/>
        <DxColumn data-field="Title"/>
        <DxColumn data-field="Department"/>
        <DxPaging
          :enabled="true"
          :page-size="10"
        />
        <DxScrolling mode="virtual"/>
      </DxDataGrid>
    </template>
  </DxDropDownBox>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxPaging,
  DxScrolling,
  DxColumn,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import DxDropDownBox, { type DxDropDownBoxTypes } from 'devextreme-vue/drop-down-box';
import { CustomStore } from 'devextreme-vue/common/data';

const props = defineProps<{
  value: number,
  onValueChanged(value: number): void,
  dataSource: CustomStore,
}>();

const currentValue = ref(props.value);
const dropDownBoxRef = ref<DxDropDownBox | null>(null);
const dropDownOptions: DxDropDownBoxTypes.Properties['dropDownOptions'] = { width: 500 };

const onContextMenuPreparing = (e: DxDataGridTypes.ContextMenuPreparingEvent) => {
  e.items = [];
};
const onRowClick = (e: DxDataGridTypes.RowClickEvent<unknown, number>) => {
  const key = e.key;
  if (e.rowType === 'data' && key !== undefined) {
    currentValue.value = key;
    props.onValueChanged(key);
    dropDownBoxRef.value!.instance!.close();
  }
};
</script>
