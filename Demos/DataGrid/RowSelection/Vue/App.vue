<template>
  <div>
    <DxDataGrid
      :data-source="employees"
      :show-borders="true"
      :hover-state-enabled="true"
      key-expr="ID"
      @selection-changed="onSelectionChanged"
    >
      <DxSelection
        mode="single"
      />
      <DxColumn
        :width="70"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn
        :width="180"
        data-field="Position"
      />
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />
    </DxDataGrid>
    <div
      v-if="showEmployeeInfo"
      id="employee-info"
    >
      <img
        :src="selectedRowPicture"
        class="employee-photo"
      >
      <p class="employee-notes">{{ selectedRowNotes }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxDataGrid, DxColumn, DxSelection } from 'devextreme-vue/data-grid';
import { SelectionChangedEvent } from 'devextreme/ui/data_grid';

import { employees, Employee } from './data.ts';

const showEmployeeInfo = ref(false);
const selectedRowNotes = ref('');
const selectedRowPicture = ref('');

const onSelectionChanged = ({ selectedRowsData }: SelectionChangedEvent<Employee>) => {
  const data = selectedRowsData[0];

  showEmployeeInfo.value = !!data;
  selectedRowNotes.value = data?.Notes;
  selectedRowPicture.value = data?.Picture;
};
</script>
<style scoped>
#employee-info .employee-photo {
  height: 100px;
  float: left;
  padding: 20px;
}

#employee-info .employee-notes {
  padding-top: 20px;
  text-align: justify;
}

.dark #employee-info .employee-notes {
  color: rgb(181, 181, 181);
}
</style>
