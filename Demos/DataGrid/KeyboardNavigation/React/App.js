import React from 'react';
import DataGrid, {
  Column,
  Lookup,
  Editing,
  HeaderFilter,
  FilterPanel,
  FilterRow,
  Pager,
  Paging } from 'devextreme-react/data-grid';
import { employees, states } from './data.js';

const allowedPageSizes = [5, 10];

class App extends React.Component {
  render() {
    return (
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        focusedRowEnabled={true}
        showBorders={true}
      >
        <Editing
          allowUpdating={true}
          allowDeleting={true}
          selectTextOnEditStart={true}
          useIcons={true}
        />
        <HeaderFilter visible={true} />
        <FilterPanel visible={true} />
        <FilterRow visible={true} />
        <Pager
          allowedPageSizes={allowedPageSizes}
          showPageSizeSelector={true}
          showNavigationButtons={true}
        />
        <Paging defaultPageSize={10} />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="Position" />
        <Column
          dataField="StateID"
          caption="State"
          dataType="number">
          <Lookup
            dataSource={states}
            valueExpr="ID"
            displayExpr="Name"
          />
        </Column>
      </DataGrid>
    );
  }
}

export default App;
