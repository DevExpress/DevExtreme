import React from 'react';
import TreeList from 'devextreme-react/tree-list';
import { employees } from './data.js';

class App extends React.Component {
  render() {
    return (
      <TreeList
        dataSource={employees}
        keyExpr="ID"
        parentIdExpr="Head_ID"
        showBorders={true}
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
        paging={{
          enabled: true,
          pageSize: 10
        }}
        scrolling={{ mode: 'standard' }}
        focusedRowEnabled={true}
        columns={[
          'Full_Name',
          {
            dataField: 'Title',
            caption: 'Position'
          },
          'City',
          'State'
        ]}
        expandedRowKeys={[1, 2, 3, 5]}
      />
    );
  }
}

export default App;
