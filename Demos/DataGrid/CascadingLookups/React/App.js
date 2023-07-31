import React from 'react';
import DataGrid, { Column, Editing, Lookup } from 'devextreme-react/data-grid';
import service from './data.js';

const onEditorPreparing = (e) => {
  if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
    e.editorOptions.disabled = (typeof e.row.data.StateID !== 'number');
  }
};

const dataSource = service.getEmployees();
const states = service.getStates();
const cities = service.getCities();

const getFilteredCities = (options) => ({
  store: cities,
  filter: options.data ? ['StateID', '=', options.data.StateID] : null,
});

function setStateValue(rowData, value) {
  rowData.CityID = null;
  this.defaultSetCellValue(rowData, value);
}

const App = () => (
  <div id="data-grid-demo">
    <DataGrid
      dataSource={dataSource}
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
        <Lookup dataSource={getFilteredCities} displayExpr="Name" valueExpr="ID" />
      </Column>
    </DataGrid>
  </div>
);

export default App;
