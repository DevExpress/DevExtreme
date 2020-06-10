<template>
  <div id="data-grid-demo">
    <DxDataGrid
      :data-source="employees"
      :show-borders="true"
      key-expr="ID"
      @editorPreparing="onEditorPreparing"
    >
      <DxEditing
        :allow-updating="true"
        :allow-adding="true"
        mode="row"
      />
      <DxColumn
        data-field="FirstName"
      />
      <DxColumn
        data-field="LastName"
      />
      <DxColumn
        data-field="Position"
      />
      <DxColumn
        :set-cell-value="setStateValue"
        data-field="StateID"
        caption="State"
      >
        <DxLookup
          :data-source="states"
          display-expr="Name"
          value-expr="ID"
        />
      </DxColumn>
      <DxColumn
        data-field="CityID"
        caption="City"
      >
        <DxLookup
          :data-source="getFilteredCities"
          display-expr="Name"
          value-expr="ID"
        />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn, DxEditing, DxLookup } from 'devextreme-vue/data-grid';
import service from './data.js';

const employees = service.getEmployees();
const states = service.getStates();
const cities = service.getCities();

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxLookup
  },
  data() {
    return {
      employees,
      states,
      setStateValue(rowData, value) {
        rowData.CityID = null;
        this.defaultSetCellValue(rowData, value);
      }
    };
  },
  methods: {
    getFilteredCities: (options) => {
      return {
        store: cities,
        filter: options.data ? ['StateID', '=', options.data.StateID] : null
      };
    },
    onEditorPreparing(e) {
      if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
        e.editorOptions.disabled = (typeof e.row.data.StateID !== 'number');
      }
    }
  }
};
</script>
<style>
#data-grid-demo {
  min-height: 700px;
}
</style>
