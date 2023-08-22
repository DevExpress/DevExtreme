<template>
  <DxTagBox
    :data-source="dataSource"
    v-model:value="currentValue"
    :show-selection-controls="true"
    :input-attr="{ 'aria-label': 'Name' }"
    :max-displayed-tags="3"
    :show-multi-tag-only="false"
    :on-value-changed="onValueChanged"
    :on-selection-changed="onSelectionChanged"
    :search-enabled="true"
    value-expr="ID"
    display-expr="FullName"
    apply-value-mode="useButtons"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxTagBox from 'devextreme-vue/tag-box';
import DataGrid from 'devextreme/ui/data_grid';
import CustomStore from 'devextreme/data/custom_store';

const props = defineProps<{
  cellInfo: any,
  dataSource: CustomStore,
  dataGridComponent: DataGrid,
}>();

const currentValue = ref(props.cellInfo.value);

const onSelectionChanged = () => {
  props.dataGridComponent.updateDimensions();
};

const onValueChanged = (e) => {
  props.cellInfo.setValue(e.value);
};
</script>
