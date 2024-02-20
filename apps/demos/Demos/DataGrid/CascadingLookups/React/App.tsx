import React from 'react';
import DataGrid, {
  Column, DataGridTypes, Editing, Lookup,
} from 'devextreme-react/data-grid';
import {
  employees, states, cities, Employee,
} from './data.ts';

const onEditorPreparing = (e: DataGridTypes.EditorPreparingEvent) => {
  if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
    const isStateNotSet = e.row.data.StateID === undefined;

    e.editorOptions.disabled = isStateNotSet;
  }
};

const getFilteredCities = (options: { data?: Employee; }) => ({
  store: cities,
  filter: options.data ? ['StateID', '=', options.data.StateID] : null,
});

function setStateValue(rowData: Employee, value) {
  rowData.CityID = null;
  this.defaultSetCellValue(rowData, value);
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
