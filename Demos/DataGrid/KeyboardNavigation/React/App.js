import React from 'react';
import DataGrid, { Column, Lookup } from 'devextreme-react/data-grid';
import { employees, states } from './data.js';

class App extends React.Component {
  render() {
    return (
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        editing = {{
          allowUpdating: true,
          allowDeleting: true,
          selectTextOnEditStart: true,
          useIcons: true
        }}
        headerFilter={{ visible: true }}
        filterPanel={{ visible: true }}
        filterRow={{ visible: true }}
        pager={
          {
            allowedPageSizes: [5, 10],
            showPageSizeSelector: true,
            showNavigationButtons: true
          }
        }
        paging={{ pageSize: 10 }}
        focusedRowEnabled={true}
        showBorders={true}
      >
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
