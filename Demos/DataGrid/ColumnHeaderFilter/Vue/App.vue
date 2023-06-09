<template>
  <div>
    <DxDataGrid
      id="employees"
      :data-source="employees"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      key-expr="ID"
    >
      <DxHeaderFilter
        :visible="true"
      />

      <DxColumn
        data-field="FirstName"
      />
      <DxColumn
        data-field="LastName"
      />
      <DxColumn
        data-field="Position"
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
        data-field="HomePhone"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />
    </DxDataGrid>
  </div>
</template>
<script>
import {
  DxDataGrid, DxHeaderFilter, DxSearch, DxColumn,
} from 'devextreme-vue/data-grid';
import { employees } from './data.js';

export default {
  components: {
    DxDataGrid, DxHeaderFilter, DxSearch, DxColumn,
  },
  data() {
    return {
      employees,
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
