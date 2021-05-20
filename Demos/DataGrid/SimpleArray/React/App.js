import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import { customers } from './data.js';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];

class App extends React.Component {
  render() {
    return (
      <DataGrid
        dataSource={customers}
        keyExpr="ID"
        defaultColumns={columns}
        showBorders={true}
      />
    );
  }
}

export default App;
