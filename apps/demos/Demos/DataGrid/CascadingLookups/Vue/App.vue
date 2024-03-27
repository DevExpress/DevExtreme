<template>
  <div id="data-grid-demo">
    <DxDataGrid
      :data-source="employees"
      :show-borders="true"
      key-expr="ID"
      @editor-preparing="onEditorPreparing"
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
<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxEditing, DxLookup, DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import {
  employees, states, cities, Employee, City,
} from './data.ts';

function setStateValue(
  this: DxDataGridTypes.Column, newData: Employee, value: number, currentRowData: Employee,
) {
  newData.CityID = null;

  this.defaultSetCellValue!(newData, value, currentRowData);
}

const getFilteredCities = (options: { data: City }) => ({
  store: cities,
  filter: options.data ? ['StateID', '=', options.data.StateID] : null,
});

const onEditorPreparing = (e: DxDataGridTypes.EditorPreparingEvent<Employee>) => {
  if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
    const isStateNotSet = e.row!.data.StateID === undefined;

    e.editorOptions.disabled = isStateNotSet;
  }
};
</script>
<style>
#data-grid-demo {
  min-height: 700px;
}
</style>
