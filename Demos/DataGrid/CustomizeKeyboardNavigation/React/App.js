import React from 'react';

import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
  KeyboardNavigation,
} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import {
  employees, states, keyActionLabel, keyDirectionLabel,
} from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.enterKeyActions = ['startEdit', 'moveFocus'];
    this.enterKeyDirections = ['none', 'column', 'row'];
    this.state = {
      editOnKeyPress: true,
      enterKeyAction: 'moveFocus',
      enterKeyDirection: 'column',
    };
    this.onFocusedCellChanging = (e) => {
      e.isHighlighted = true;
    };
    this.editOnKeyPressChanged = this.editOnKeyPressChanged.bind(this);
    this.enterKeyActionChanged = this.enterKeyActionChanged.bind(this);
    this.enterKeyDirectionChanged = this.enterKeyDirectionChanged.bind(this);
  }

  editOnKeyPressChanged(e) {
    this.setState({ editOnKeyPress: e.value });
  }

  enterKeyActionChanged(e) {
    this.setState({ enterKeyAction: e.value });
  }

  enterKeyDirectionChanged(e) {
    this.setState({ enterKeyDirection: e.value });
  }

  render() {
    return (
      <div id="data-grid-demo">
        <DataGrid
          dataSource={employees}
          keyExpr="ID"
          showBorders={true}
          onFocusedCellChanging={this.onFocusedCellChanging}>
          <KeyboardNavigation
            editOnKeyPress={this.state.editOnKeyPress}
            enterKeyAction={this.state.enterKeyAction}
            enterKeyDirection={this.state.enterKeyDirection} />
          <Paging enabled={false} />
          <Editing
            mode="batch"
            allowUpdating={true}
            startEditAction="dblClick" />
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
          <div className="option-container">
            <div className="option check-box">
              <CheckBox text="Edit On Key Press"
                value={this.state.editOnKeyPress}
                onValueChanged={this.editOnKeyPressChanged} />
            </div>
            <div className="option">
              <span className="option-caption">Enter Key Action</span>
              <SelectBox className="select"
                items={this.enterKeyActions}
                inputAttr={keyActionLabel}
                value={this.state.enterKeyAction}
                onValueChanged={this.enterKeyActionChanged} />
            </div>
            <div className="option">
              <span className="option-caption">Enter Key Direction</span>
              <SelectBox className="select"
                items={this.enterKeyDirections}
                inputAttr={keyDirectionLabel}
                value={this.state.enterKeyDirection}
                onValueChanged={this.enterKeyDirectionChanged} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
