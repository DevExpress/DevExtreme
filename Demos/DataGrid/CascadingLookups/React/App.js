import React from 'react';

import DataGrid, { Column, Editing, Lookup } from 'devextreme-react/data-grid';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = service.getEmployees();
    this.states = service.getStates();
    this.cities = service.getCities();
    this.getFilteredCities = this.getFilteredCities.bind(this);
  }
  getFilteredCities(options) {
    return {
      store: this.cities,
      filter: options.data ? ['StateID', '=', options.data.StateID] : null
    };
  }
  onEditorPreparing(e) {
    if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
      e.editorOptions.disabled = (typeof e.row.data.StateID !== 'number');
    }
  }
  setStateValue(rowData, value) {
    rowData.CityID = null;
    this.defaultSetCellValue(rowData, value);
  }
  render() {
    return (
      <div id="data-grid-demo">
        <DataGrid
          dataSource={this.dataSource}
          keyExpr="ID"
          showBorders={true}
          onEditorPreparing={this.onEditorPreparing}
        >
          <Editing
            mode="row"
            allowUpdating={true}
            allowAdding={true}>
          </Editing>
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="Position" />
          <Column dataField="StateID" caption="State" setCellValue={this.setStateValue}>
            <Lookup dataSource={this.states} displayExpr="Name" valueExpr="ID" />
          </Column>
          <Column dataField="CityID" caption="City">
            <Lookup dataSource={this.getFilteredCities} displayExpr="Name" valueExpr="ID" />
          </Column>
        </DataGrid>
      </div>
    );
  }
}

export default App;
