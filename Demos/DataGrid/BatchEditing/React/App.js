import React from 'react';

import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup
} from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import { employees, states } from './data.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectTextOnEditStart: true,
      startEditAction: 'click'
    };
    this.onSelectTextOnEditStartChanged = this.onSelectTextOnEditStartChanged.bind(this);
    this.onStartEditActionChanged = this.onStartEditActionChanged.bind(this);
  }
  onSelectTextOnEditStartChanged(args) {
    this.setState({
      selectTextOnEditStart: args.value
    });
  }
  onStartEditActionChanged(args) {
    this.setState({
      startEditAction: args.value
    });
  }
  render() {
    return (
      <div id="data-grid-demo">
        <DataGrid
          dataSource={employees}
          keyExpr="ID"
          showBorders={true}
        >
          <Paging enabled={false} />
          <Editing
            mode="batch"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
            selectTextOnEditStart={this.state.selectTextOnEditStart}
            startEditAction={this.state.startEditAction} />
          <Column dataField="Prefix" caption="Title" width={70} />
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="Position" width={170} />
          <Column dataField="StateID" caption="State" width={125}>
            <Lookup dataSource={states} valueExpr="ID" displayExpr="Name" />
          </Column>
          <Column dataField="BirthDate" dataType="date" />
        </DataGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              value={this.state.selectTextOnEditStart}
              text="Select Text on Edit Start"
              onValueChanged={this.onSelectTextOnEditStartChanged}
            />
          </div>
          <div className="option">
            <span>Start Edit Action</span>
                &nbsp;
            <SelectBox
              items={['click', 'dblClick']}
              value={this.state.startEditAction}
              onValueChanged={this.onStartEditActionChanged}>
            </SelectBox>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
