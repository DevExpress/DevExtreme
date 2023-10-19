import React from 'react';
import {
  TreeList, Column, SearchPanel, TreeListTypes,
} from 'devextreme-react/tree-list';
import SelectBox from 'devextreme-react/select-box';
import { employees, filterLabel } from './data.ts';

const filterModes = ['matchOnly', 'withAncestors', 'fullBranch'];

const App = () => {
  const [filterMode, setFilterMode] = React.useState<TreeListTypes.TreeListFilterMode>('matchOnly');

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
        filterMode={filterMode}>
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
            items={filterModes}
            value={filterMode}
            inputAttr={filterLabel}
            onValueChange={setFilterMode}>
          </SelectBox>
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
