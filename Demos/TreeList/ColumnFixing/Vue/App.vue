<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn
        :fixed="true"
        data-field="Full_Name"
      />
      <DxColumn
        data-field="City"
      />
      <DxColumn
        data-field="State"
      />
      <DxColumn
        data-field="Mobile_Phone"
      />
      <DxColumn
        data-field="Email"
      />
      <DxColumn
        data-field="Hire_Date"
        data-type="date"
      />
      <DxColumn
        data-field="Birth_Date"
        data-type="date"
      />
      <DxColumn
        data-field="Skype"
      />
      <DxColumnFixing
        :enabled="true"
      />
    </DxTreeList>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxColumn, DxColumnFixing } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxColumn, DxColumnFixing
  },
  data() {
    return {
      employees: employees,
      expandedRowKeys: [1, 2, 10]
    };
  }
};
</script>
<style scoped>
#employees {
    max-height: 440px;
}
</style>
