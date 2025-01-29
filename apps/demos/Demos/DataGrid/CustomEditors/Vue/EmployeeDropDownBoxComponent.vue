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
        :selected-row-keys="getSelectedRowKeys(currentValue)"
        :hover-state-enabled="true"
        :on-context-menu-preparing="onContextMenuPreparing"
        :on-selection-changed="onSelectionChanged"
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
        <DxSelection mode="single"/>
      </DxDataGrid>
    </template>
  </DxDropDownBox>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxPaging,
  DxSelection,
  DxScrolling,
  DxColumn,
  DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import DxDropDownBox, { DxDropDownBoxTypes } from 'devextreme-vue/drop-down-box';
import CustomStore from 'devextreme/data/custom_store';

const props = defineProps<{
  value: number,
  // eslint-disable-next-line no-unused-vars
  onValueChanged(value: number): void,
  dataSource: CustomStore,
}>();

const currentValue = ref(props.value);
const dropDownBoxRef = ref<DxDropDownBox | null>(null);
const dropDownOptions: DxDropDownBoxTypes.Properties['dropDownOptions'] = { width: 500 };

function getSelectedRowKeys<T>(value: T | null): T[] {
  return value !== null && value !== undefined ? [value] : [];
}

const onContextMenuPreparing = (e: DxDataGridTypes.ContextMenuPreparing) => {
  e.items = [];
};
const onSelectionChanged = (e: DxDataGridTypes.SelectionChangedEvent) => {
  currentValue.value = e.selectedRowKeys[0];

  props.onValueChanged(currentValue.value);

  if (e.selectedRowKeys.length > 0) {
    dropDownBoxRef.value!.instance!.close();
  }
};
</script>
