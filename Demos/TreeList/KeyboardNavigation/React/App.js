import React from 'react';
import TreeList, {
  Pager,
  Paging,
  Editing,
  HeaderFilter,
  FilterPanel,
  FilterRow,
  Scrolling,
  Column } from 'devextreme-react/tree-list';
import { employees } from './data.js';

const allowedPageSizes = [5, 10];

class App extends React.Component {
  render() {
    return (
      <TreeList
        dataSource={employees}
        keyExpr="ID"
        parentIdExpr="Head_ID"
        showBorders={true}
        focusedRowEnabled={true}
        defaultExpandedRowKeys={[1, 2, 3, 5]}
      >
        <Editing
          allowUpdating={true}
          allowDeleting={true}
          selectTextOnEditStart={true}
          useIcons={true}
        />
        <HeaderFilter
          visible={true}
        />
        <FilterPanel
          visible={true}
        />
        <FilterRow
          visible={true}
        />
        <Scrolling
          mode="standard"
        />
        <Column dataField="Full_Name" />
        <Column
          dataField="Title"
          caption="Position"
        />
        <Column dataField="City" />
        <Column dataField= "State" />
        <Pager
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Paging
          enabled={true}
          defaultPageSize={10}
        />
      </TreeList>
    );
  }
}

export default App;
