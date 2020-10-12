<template>
  <div id="grid">
    <DxSelectBox
      id="select-prefix"
      :data-source="['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.']"
      :value="prefix"
      placeholder="Select title"
      @value-changed="filterSelection"
    />
    <DxButton
      :disabled="!selectedRowKeys.length"
      text="Clear Selection"
      @click="clearSelection"
    />
    <DxDataGrid
      id="grid-container"
      :data-source="employees"
      :ref="dataGridRefName"
      :selected-row-keys="selectedRowKeys"
      :show-borders="true"
      key-expr="ID"
      @selection-changed="onSelectionChanged"
    >
      <DxSelection mode="multiple"/>
      <DxColumn
        :width="70"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn
        data-field="FirstName"
      />
      <DxColumn
        data-field="LastName"
      />
      <DxColumn
        :width="180"
        data-field="Position"
      />
      <DxColumn
        :width="125"
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        :width="125"
        data-field="HireDate"
        data-type="date"
      />
    </DxDataGrid>
    <div class="selected-data">
      <span class="caption">Selected Records:</span>
      <span>
        {{ selectedEmployeeNames }}
      </span>
    </div>
  </div>
</template>
<script>
import {
  DxColumn,
  DxDataGrid,
  DxSelection
} from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import DxSelectBox from 'devextreme-vue/select-box';
import { employees } from './data.js';

function getEmployeeNames(selectedRowsData) {
  const getEmployeeName = row => `${row.FirstName} ${row.LastName}`;

  return selectedRowsData.length ? selectedRowsData.map(getEmployeeName).join(', ') : 'Nobody has been selected';
}

export default {
  components: {
    DxButton,
    DxColumn,
    DxDataGrid,
    DxSelectBox,
    DxSelection
  },
  data() {
    return {
      dataGridRefName: 'dataGrid',
      employees,
      prefix: '',
      selectedEmployeeNames: 'Nobody has been selected',
      selectedRowKeys: [],
      selectionChangedBySelectBox: false
    };
  },
  methods: {
    clearSelection() {
      const dataGrid = this.$refs[this.dataGridRefName].instance;

      dataGrid.clearSelection();
    },
    filterSelection({ value }) {
      this.selectionChangedBySelectBox = true;

      let prefix = value;

      if(!prefix) {
        return;
      } else if(prefix === 'All') {
        this.selectedRowKeys = this.employees.map(employee => employee.ID);
      } else {
        this.selectedRowKeys = this.employees.filter(employee => employee.Prefix === prefix).map(employee => employee.ID);
      }

      this.prefix = prefix;
    },
    onSelectionChanged({ selectedRowKeys, selectedRowsData }) {
      if (!this.selectionChangedBySelectBox) {
        this.prefix = null;
      }

      this.selectedEmployeeNames = getEmployeeNames(selectedRowsData);
      this.selectedRowKeys = selectedRowKeys;
      this.selectionChangedBySelectBox = false;
    }
  }
};
</script>
<style scoped>
#grid {
  position: relative;
}

#grid-container {
  margin-top: 10px;
}

#select-prefix {
  width: 150px;
  margin-right: 4px;
  display: inline-block;
  vertical-align: middle;
}

.selected-data {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.selected-data .caption {
  font-weight: bold;
  font-size: 115%;
  margin-right: 4px;
}
</style>
