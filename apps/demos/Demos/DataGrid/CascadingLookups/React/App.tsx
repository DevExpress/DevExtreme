import React from 'react';
import DataGrid, {
  Column, Editing, Lookup,
} from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import {
  employees, states, cities,
} from './data.ts';
import type { Employee } from './data.ts';

const onEditorPreparing = (e: DataGridTypes.EditorPreparingEvent) => {
  if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
    e.editorOptions.disabled = e.row?.data.StateID === undefined;
  }
};

const getFilteredCities = (options: { data?: Employee; }) => ({
  store: cities,
  filter: options.data ? ['StateID', '=', options.data.StateID] : null,
});

function setStateValue(this: DataGridTypes.Column, rowData: Employee, value: number) {
  rowData.CityID = null;
  this.defaultSetCellValue?.(rowData, value, undefined);
}

const App = () => (
  <div id="data-grid-demo">
    <DataGrid
      dataSource={employees}
      keyExpr="ID"
      showBorders={true}
      onEditorPreparing={onEditorPreparing}
    >
      <Editing
        mode="row"
        allowUpdating={true}
        allowAdding={true}>
      </Editing>
      <Column dataField="FirstName" />
      <Column dataField="LastName" />
      <Column dataField="Position" />
      <Column dataField="StateID" caption="State" setCellValue={setStateValue}>
        <Lookup dataSource={states} displayExpr="Name" valueExpr="ID" />
      </Column>
      <Column dataField="CityID" caption="City">
        <Lookup dataSource={getFilteredCities as any} displayExpr="Name" valueExpr="ID" />
      </Column>
    </DataGrid>
  </div>
);

export default App;
