<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      :show-row-lines="true"
      :show-borders="true"
      :column-auto-width="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxSelection
        mode="single"
      />
      <DxColumn
        data-field="Full_Name"
      />
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn
        data-field="City"
      />
      <DxColumn
        data-field="State"
      />
      <DxColumn
        :width="120"
        data-field="Hire_Date"
        data-type="date"
      />
    </DxTreeList>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxSelection, DxColumn } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxSelection, DxColumn
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
    max-height: 440px;
}
</style>
