import React from 'react';
import {
  TreeList, Selection, FilterRow, StateStoring, Column,
} from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1, 2, 10];

const reloadPage = () => {
  window.location.reload();
};

const App = () => {
  const treeList = React.useRef(null);

  const onStateResetClick = React.useCallback(() => {
    treeList.current.instance.state(null);
  }, []);

  return (
    <div>
      <div id="descContainer">Sort and filter data, reorder and resize columns, select and expand rows. Once you are done, <a onClick={reloadPage}>refresh</a> the web page to see that the grid’s state is automatically persisted to continue working from where you stopped or you can <a onClick={onStateResetClick}>reset</a> the grid to its initial state.</div>
      <TreeList
        id="employees"
        ref={treeList}
        dataSource={employees}
        allowColumnReordering={true}
        allowColumnResizing={true}
        showBorders={true}
        defaultExpandedRowKeys={expandedRowKeys}
        keyExpr="ID"
        parentIdExpr="Head_ID"
      >
        <Selection recursive={true} mode="multiple" />
        <FilterRow visible={true} />
        <StateStoring enabled={true} type="localStorage" storageKey="treeListStorage" />
        <Column dataField="Full_Name" />
        <Column dataField="Title" caption="Position" />
        <Column dataField="City" />
        <Column width={160} dataField="Hire_Date" dataType="date" />
      </TreeList>
    </div>
  );
};

export default App;
