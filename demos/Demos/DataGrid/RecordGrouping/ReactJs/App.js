import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
} from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';
import { customers } from './data.js';

const App = () => {
  const [autoExpandAll, setAutoExpandAll] = useState(true);
  const onAutoExpandAllChanged = useCallback(() => {
    setAutoExpandAll((previousAutoExpandAll) => !previousAutoExpandAll);
  }, []);
  return (
    <div>
      <DataGrid
        dataSource={customers}
        keyExpr="ID"
        allowColumnReordering={true}
        width="100%"
        showBorders={true}
      >
        <GroupPanel visible={true} />
        <SearchPanel visible={true} />
        <Grouping autoExpandAll={autoExpandAll} />
        <Paging defaultPageSize={10} />

        <Column
          dataField="CompanyName"
          dataType="string"
        />
        <Column
          dataField="Phone"
          dataType="string"
        />
        <Column
          dataField="Fax"
          dataType="string"
        />
        <Column
          dataField="City"
          dataType="string"
        />
        <Column
          dataField="State"
          dataType="string"
          groupIndex={0}
        />
      </DataGrid>

      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text="Expand All Groups"
            id="autoExpand"
            value={autoExpandAll}
            onValueChanged={onAutoExpandAllChanged}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
