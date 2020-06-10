<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      :show-borders="true"
      :column-hiding-enabled="true"
      :show-row-lines="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn
        data-field="Full_Name"
      />
      <DxColumn
        data-field="City"
      />
      <DxColumn
        :hiding-priority="0"
        data-field="State"
      />
      <DxColumn
        :hiding-priority="1"
        data-field="Mobile_Phone"
      />
      <DxColumn
        :hiding-priority="2"
        data-field="Hire_Date"
        data-type="date"
      />
      <DxColumnChooser
        :enabled="true"
        mode="select"
      />
    </DxTreeList>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxColumn, DxColumnChooser } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxColumn, DxColumnChooser
  },
  data() {
    return {
      employees: employees,
      expandedRowKeys: [1]
    };
  }
};
</script>
<style scoped>
#employees {
    padding: 10px;
}
</style>
