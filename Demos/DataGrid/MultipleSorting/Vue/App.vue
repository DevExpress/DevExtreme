<template>
  <div>
    <DxDataGrid
      ref="dataGridRef"
      :data-source="employees"
      :show-borders="true"
      key-expr="ID"
    >
      <DxColumn
        :width="70"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn
        data-field="FirstName"
        sort-order="asc"
      />
      <DxColumn
        data-field="LastName"
        sort-order="asc"
      />
      <DxColumn data-field="City"/>
      <DxColumn data-field="State"/>
      <DxColumn
        :width="130"
        :allow-sorting="!positionDisableSorting"
        data-field="Position"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />
      <DxSorting mode="multiple"/>
    </DxDataGrid>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="positionDisableSorting"
          text="Disable Sorting for the Position Column"
          @value-changed="onValueChanged"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxColumn,
  DxDataGrid,
  DxSorting,
} from 'devextreme-vue/data-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import { employees } from './data.ts';

const positionDisableSorting = ref(false);
const dataGridRef = ref<DxDataGrid | null>(null);

const onValueChanged = () => {
  dataGridRef.value!.instance!.columnOption(5, 'sortOrder', undefined);
};
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
