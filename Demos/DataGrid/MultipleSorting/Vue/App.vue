<template>
  <div>
    <DxDataGrid
      :ref="dataGridRefName"
      :data-source="employees"
      key-expr="ID"
      :show-borders="true"
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
<script>
import {
  DxColumn,
  DxDataGrid,
  DxSorting
} from 'devextreme-vue/data-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import { employees } from './data.js';

export default {
  components: {
    DxCheckBox,
    DxColumn,
    DxDataGrid,
    DxSorting
  },
  data() {
    return {
      positionDisableSorting: false,
      dataGridRefName: 'dataGrid',
      employees
    };
  },
  methods: {
    onValueChanged() {
      const dataGrid = this.$refs[this.dataGridRefName].instance;

      dataGrid.columnOption(5, 'sortOrder', void 0);
    }
  }
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
