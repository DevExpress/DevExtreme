<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      :expanded-row-keys="expandedRowKeys"
      :filter-value="filterValue"
      :show-borders="true"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxFilterRow
        :visible="true"
      />
      <DxFilterPanel
        :visible="true"
      />
      <DxHeaderFilter
        :visible="true"
      />
      <DxColumn
        data-field="Full_Name"
        data-type="string"
      />
      <DxColumn
        data-field="Title"
        caption="Position"
        data-type="string"
      />
      <DxColumn
        data-field="City"
        data-type="string"
      />
      <DxColumn
        data-field="State"
        data-type="string"
      />
      <DxColumn
        data-field="Mobile_Phone"
        data-type="string"
      />
      <DxColumn
        data-field="Hire_Date"
        data-type="date"
      />
    </DxTreeList>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxFilterRow, DxFilterPanel, DxHeaderFilter, DxColumn } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxFilterRow, DxFilterPanel, DxHeaderFilter, DxColumn
  },
  data() {
    return {
      employees: employees,
      expandedRowKeys: [1],
      filterValue: ['City', '=', 'Bentonville']
    };
  }
};
</script>
<style scoped>
.demo-container {
    height: 570px;
}

#employees {
    height: 440px;
}
</style>
