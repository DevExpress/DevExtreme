<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      :show-row-lines="true"
      :show-borders="true"
      :column-auto-width="true"
      :filter-mode="filterMode"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxSearchPanel
        :visible="true"
        text="Manager"
      />
      <DxColumn
        data-field="Title"
        caption="Position"
        data-type="string"
      />
      <DxColumn
        data-field="Full_Name"
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
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Filter Mode</span>
        <DxSelectBox
          :items="filterModes"
          v-model:value="filterMode"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxColumn, DxSearchPanel } from 'devextreme-vue/tree-list';
import DxSelectBox from 'devextreme-vue/select-box';

export default {
  components: {
    DxSelectBox,
    DxTreeList,
    DxColumn,
    DxSearchPanel
  },
  data() {
    return {
      employees: employees,
      filterMode: 'matchOnly',
      filterModes: ['matchOnly', 'withAncestors', 'fullBranch']
    };
  }
};
</script>
<style scoped>
#employees {
  height: 440px;
}

.options {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
}

.options .caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.option > span {
  width: 120px;
  display: inline-block;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  max-width: 350px;
}
</style>
