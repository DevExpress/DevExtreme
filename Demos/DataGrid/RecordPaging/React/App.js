import React from 'react';

import DataGrid, { Column, Pager, Paging } from 'devextreme-react/data-grid';
import { customers } from './data.js';

class App extends React.Component {
  render() {
    return (
      <DataGrid
        dataSource={customers}
        showBorders={true}
      >
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true} />

        <Column dataField="CompanyName" />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column dataField="Phone" />
        <Column dataField="Fax" />
      </DataGrid>
    );
  }
}

export default App;
