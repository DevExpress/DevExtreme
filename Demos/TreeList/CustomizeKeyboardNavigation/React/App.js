import React from 'react';

import TreeList, {
  Column,
  Editing,
  KeyboardNavigation
} from 'devextreme-react/tree-list';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.js';

const expandedRowKeys = [1, 2, 4, 5];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.enterKeyActions = ['startEdit', 'moveFocus'];
    this.enterKeyDirections = ['none', 'column', 'row'];
    this.state = {
      editOnKeyPress: true,
      enterKeyAction: 'moveFocus',
      enterKeyDirection: 'column'
    };
    this.onFocusedCellChanging = e => {
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
      <div id="tree-list-demo">
        <TreeList
          id="employees"
          dataSource={employees}
          keyExpr="ID"
          parentIdExpr="Head_ID"
          columnAutoWidth={true}
          defaultExpandedRowKeys={expandedRowKeys}
          onFocusedCellChanging={this.onFocusedCellChanging}>
          <KeyboardNavigation
            editOnKeyPress={this.state.editOnKeyPress}
            enterKeyAction={this.state.enterKeyAction}
            enterKeyDirection={this.state.enterKeyDirection} />
          <Editing
            mode="batch"
            allowUpdating={true}
            startEditAction="dblClick" />
          <Column
            dataField="Full_Name">
          </Column>
          <Column
            dataField="Prefix"
            caption="Title">
          </Column>
          <Column
            dataField="Title"
            caption="Position">
          </Column>
          <Column
            dataField="City">
          </Column>
          <Column
            dataField="Hire_Date"
            dataType="date">
          </Column>
        </TreeList>
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
                value={this.state.enterKeyAction}
                onValueChanged={this.enterKeyActionChanged} />
            </div>
            <div className="option">
              <span className="option-caption">Enter Key Direction</span>
              <SelectBox className="select"
                items={this.enterKeyDirections}
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
