import React from 'react';
import DataGrid, { Column, Sorting } from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      positionDisableSorting: false
    };

    this.dataGrid = null;

    this.onPositionSortingChanged = this.onPositionSortingChanged.bind(this);
  }

  render() {
    return (
      <div>
        <DataGrid
          dataSource={employees}
          keyExpr="ID"
          showBorders={true}
          ref={(ref) => this.dataGrid = ref}
        >
          <Sorting mode="multiple" />

          <Column
            dataField="Prefix"
            caption="Title"
            width={70} />
          <Column
            dataField="FirstName"
            defaultSortOrder="asc" />
          <Column
            dataField="LastName"
            defaultSortOrder="asc" />
          <Column dataField="City" />
          <Column dataField="State" />
          <Column
            dataField="Position"
            allowSorting={!this.state.positionDisableSorting}
            width={130} />
          <Column
            dataField="HireDate"
            dataType="date" />
        </DataGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox text="Disable Sorting for the Position Column"
              value={this.state.positionDisableSorting}
              onValueChanged={this.onPositionSortingChanged} />
          </div>
        </div>
      </div>
    );
  }

  onPositionSortingChanged() {
    this.setState({
      positionDisableSorting: !this.state.positionDisableSorting
    });

    this.dataGrid.instance.columnOption(5, 'sortOrder', void 0);
  }
}

export default App;
