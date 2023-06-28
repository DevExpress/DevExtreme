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
      <DxHeaderFilter
        :visible="true"
      />
      <DxSelection
        mode="single"
      />
      <DxColumn
        data-field="Full_Name"
      />
      <DxColumn
        data-field="Title"
        caption="Position"
      >
        <DxHeaderFilter
          :allow-select-all="false"
        >
          <DxSearch
            :enabled="true"
          />
        </DxHeaderFilter>
      </DxColumn>
      <DxColumn
        data-field="City"
      >
        <DxHeaderFilter>
          <DxSearch
            :enabled="true"
            :search-expr="searchExpr"
            :editor-options="editorOptions"
          />
        </DxHeaderFilter>
      </DxColumn>
      <DxColumn
        data-field="State"
      />
      <DxColumn
        data-field="Mobile_Phone"
      />
      <DxColumn
        data-field="Hire_Date"
        data-type="date"
      />
    </DxTreeList>
  </div>
</template>
<script>
import {
  DxTreeList, DxHeaderFilter, DxSearch, DxSelection, DxColumn,
} from 'devextreme-vue/tree-list';
import { employees } from './data.js';

export default {
  components: {
    DxTreeList, DxHeaderFilter, DxSearch, DxSelection, DxColumn,
  },
  data() {
    return {
      employees,
      expandedRowKeys: [1],
      searchExpr: ['City', 'State'],
      editorOptions: { placeholder: 'Search city or state' },
    };
  },
};
</script>
<style scoped>
#employees {
  max-height: 440px;
}
</style>
