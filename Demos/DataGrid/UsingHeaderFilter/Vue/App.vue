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
            :search-expr="['City', 'State']"
            :editor-options="{ placeholder: 'Search city or state' }"
          />
        </DxHeaderFilter>
      </DxColumn>
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
    };
  },
};
</script>
<style scoped>
#employees {
  max-height: 440px;
}
</style>
