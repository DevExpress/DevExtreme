import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { employees } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEmployeeInfo: false,
      selectedRowPicture: '',
      selectedRowNotes: ''
    };

    this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <DataGrid
          dataSource={employees}
          selection={{ mode: 'single' }}
          showBorders={true}
          hoverStateEnabled={true}
          keyExpr="ID"
          onSelectionChanged={this.onSelectionChanged}
        >
          <Column dataField="Prefix" caption="Title" width={70} />
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="Position" width={180} />
          <Column dataField="BirthDate" dataType="date" />
          <Column dataField="HireDate" dataType="date" />
        </DataGrid>
        {
          this.state.showEmployeeInfo &&
          <div id="employee-info">
            <img src={this.state.selectedRowPicture} className="employee-photo" />
            <p className="employee-notes">{this.state.selectedRowNotes}</p>
          </div>
        }
      </React.Fragment>
    );
  }

  onSelectionChanged({ selectedRowsData }) {
    const data = selectedRowsData[0];

    this.setState({
      showEmployeeInfo: !!data,
      selectedRowNotes: data && data.Notes,
      selectedRowPicture: data && data.Picture
    });
  }

}

export default App;
