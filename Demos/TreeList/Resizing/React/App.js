import React from 'react';
import { TreeList, Column } from 'devextreme-react/tree-list';
import { SelectBox } from 'devextreme-react/select-box';
import { employees, columnResizingModeLabel } from './data.js';

const resizingModes = ['nextColumn', 'widget'];
const expandedRowKeys = [1, 3, 6];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnResizingMode: 'nextColumn',
    };

    this.onResizingModeChanged = this.onResizingModeChanged.bind(this);
  }

  render() {
    const { columnResizingMode } = this.state;

    return (
      <div>
        <TreeList
          id="employees"
          dataSource={employees}
          allowColumnResizing={true}
          columnResizingMode={columnResizingMode}
          columnMinWidth={50}
          columnAutoWidth={true}
          showRowLines={true}
          showBorders={true}
          defaultExpandedRowKeys={expandedRowKeys}
          keyExpr="ID"
          parentIdExpr="Head_ID"
        >
          <Column dataField="Title" caption="Position" />
          <Column dataField="Full_Name" />
          <Column dataField="City" />
          <Column dataField="State" />
          <Column dataField="Hire_Date" dataType="date" />
        </TreeList>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Column resizing mode:</span>
            <SelectBox
              items={resizingModes}
              value={columnResizingMode}
              inputAttr={columnResizingModeLabel}
              width={250}
              onValueChanged={this.onResizingModeChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  onResizingModeChanged(e) {
    this.setState({
      columnResizingMode: e.value,
    });
  }
}

export default App;
