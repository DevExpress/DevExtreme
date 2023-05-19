<template>
  <div>
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
      <DxToolbar>
        <DxItem location="before">
          <DxSelectBox
            :data-source="prefixOptions"
            :value="prefix"
            :input-attr="{ 'aria-label': 'Title' }"
            placeholder="Select title"
            width="150px"
            @value-changed="filterSelection"
          />
        </DxItem>
        <DxItem location="before">
          <DxButton
            :disabled="!selectedRowKeys.length"
            text="Clear Selection"
            @click="clearSelection"
          />
        </DxItem>
      </DxToolbar>
    </DxDataGrid>
    <div class="selected-data">
      <span class="caption">Selected Records:</span>{{ ' ' }}
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
  DxSelection,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import DxSelectBox from 'devextreme-vue/select-box';
import { employees } from './data.js';

export default {
  components: {
    DxButton,
    DxColumn,
    DxDataGrid,
    DxSelectBox,
    DxSelection,
    DxToolbar,
    DxItem,
  },
  data() {
    return {
      dataGridRefName: 'dataGrid',
      employees,
      prefix: '',
      prefixOptions: ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'],
      selectedRowsData: [],
      selectionChangedBySelectBox: false,
    };
  },
  computed: {
    selectedRowKeys() {
      return this.selectedRowsData.map((employee) => employee.ID);
    },
    selectedEmployeeNames() {
      const selectedRowsData = this.selectedRowsData;
      const getEmployeeName = (row) => `${row.FirstName} ${row.LastName}`;
      return selectedRowsData.length ? selectedRowsData.map(getEmployeeName).join(', ') : 'Nobody has been selected';
    },
  },
  methods: {
    clearSelection() {
      const dataGrid = this.$refs[this.dataGridRefName].instance;

      dataGrid.clearSelection();
    },
    filterSelection({ value }) {
      this.selectionChangedBySelectBox = true;

      const prefix = value;

      if (!prefix) {
        return;
      } if (prefix === 'All') {
        this.selectedRowsData = this.employees;
      } else {
        this.selectedRowsData = this.employees
          .filter((employee) => employee.Prefix === prefix);
      }

      this.prefix = prefix;
    },
    onSelectionChanged({ selectedRowsData }) {
      if (!this.selectionChangedBySelectBox) {
        this.prefix = null;
      }

      this.selectedRowsData = selectedRowsData;
      this.selectionChangedBySelectBox = false;
    },
  },
};
</script>
<style scoped>
#grid {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
