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
        :selected-row-keys="[currentValue]"
        :hover-state-enabled="true"
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
} from 'devextreme-vue/data-grid';

import DxDropDownBox from 'devextreme-vue/drop-down-box';
import CustomStore from 'devextreme/data/custom_store';
import { SelectionChangedEvent } from 'devextreme/ui/data_grid';
import { Properties as DropDownOptions } from 'devextreme/ui/popup';

const props = defineProps<{
  value: number,
  // eslint-disable-next-line no-unused-vars
  onValueChanged(value: number): void,
  dataSource: CustomStore,
}>();

const currentValue = ref(props.value);
const dropDownBoxRef = ref<DxDropDownBox | null>(null);
const dropDownOptions: DropDownOptions = { width: 500 };

const onSelectionChanged = (e: SelectionChangedEvent) => {
  currentValue.value = e.selectedRowKeys[0];

  props.onValueChanged(currentValue.value);

  if (e.selectedRowKeys.length > 0) {
    dropDownBoxRef.value!.instance!.close();
  }
};
</script>
