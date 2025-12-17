import React, { useState } from 'react';

import { TreeList, Column, SearchPanel } from 'devextreme-react/tree-list';
import type { TreeListTypes } from 'devextreme-react/tree-list';
import SelectBox from 'devextreme-react/select-box';

import { employees, filterLabel } from './data.ts';

const filterModes: TreeListTypes.TreeListFilterMode[] = ['matchOnly', 'withAncestors', 'fullBranch'];

const App = () => {
  const [filterMode, setFilterMode] = useState<TreeListTypes.TreeListFilterMode>('matchOnly');

  return (
    <>
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
    </>
  );
};

export default App;
