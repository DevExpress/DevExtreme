import React from 'react';
import { TreeList, Column, SearchPanel } from 'devextreme-react/tree-list';
import SelectBox from 'devextreme-react/select-box';
import { employees, filterLabel } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterMode: 'matchOnly',
    };
    this.filterModes = ['matchOnly', 'withAncestors', 'fullBranch'];
    this.onFilterModeChange = this.onFilterModeChange.bind(this);
  }

  onFilterModeChange(args) {
    this.setState({
      filterMode: args.value,
    });
  }

  render() {
    return (
      <React.Fragment>
        <TreeList
          id="employees"
          dataSource={employees}
          showRowLines={true}
          showBorders={true}
          columnAutoWidth={true}
          keyExpr="ID"
          parentIdExpr="Head_ID"
          filterMode={this.state.filterMode}>
          <SearchPanel
            visible={true}
            defaultText="Manager" />
          <Column
            dataField="Title"
            caption="Position"
            dataType="string" />
          <Column
            dataField="Full_Name"
            dataType="string" />
          <Column
            dataField="City"
            dataType="string" />
          <Column
            dataField="State"
            dataType="string" />
          <Column
            dataField="Mobile_Phone"
            dataType="string" />
          <Column
            dataField="Hire_Date"
            dataType="date" />
        </TreeList>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Filter Mode </span>
            <SelectBox
              items={this.filterModes}
              value={this.state.filterMode}
              inputAttr={filterLabel}
              onValueChanged={this.onFilterModeChange}>
            </SelectBox>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
