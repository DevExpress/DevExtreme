import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employees = service.getEmployees();
    this.state = {
      showColumnLines: false,
      showRowLines: true,
      showBorders: true,
      rowAlternationEnabled: true
    };
    this.onValueChanged = this.onValueChanged.bind(this);
  }
  onValueChanged(e) {
    let optionName = null;
    switch (e.component.option('text')) {
      case 'Show Row Lines': {
        optionName = 'showRowLines';
        break;
      }
      case 'Show Borders': {
        optionName = 'showBorders';
        break;
      }
      case 'Alternating Row Color': {
        optionName = 'rowAlternationEnabled';
        break;
      }
      default: {
        optionName = 'showColumnLines';
        break;
      }
    }
    this.setState({
      [optionName]: e.value
    });
  }
  render() {
    const { showColumnLines, showRowLines, showBorders, rowAlternationEnabled } = this.state;
    return (
      <React.Fragment>
        <DataGrid dataSource={this.employees}
          keyExpr="ID"
          showColumnLines={showColumnLines}
          showRowLines={showRowLines}
          showBorders={showBorders}
          rowAlternationEnabled={rowAlternationEnabled}>
          <Column dataField="Prefix" width={80} caption="Title" />
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="City" />
          <Column dataField="State" />
          <Column dataField="Position" width={130} />
          <Column dataField="BirthDate" width={100} dataType="date" />
          <Column dataField="HireDate" width={100} dataType="date" />
        </DataGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              text="Show Column Lines"
              value={showColumnLines}
              onValueChanged={this.onValueChanged} />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              text="Show Row Lines"
              value={showRowLines}
              onValueChanged={this.onValueChanged} />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              text="Show Borders"
              value={showBorders}
              onValueChanged={this.onValueChanged} />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              text="Alternating Row Color"
              value={rowAlternationEnabled}
              onValueChanged={this.onValueChanged} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
