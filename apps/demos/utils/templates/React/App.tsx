import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import { customers } from './data.ts';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];

class App extends React.Component {
  render() {
    return (
      <DataGrid
        dataSource={customers}
        defaultColumns={columns}
        showBorders={true}
      />
    );
  }
}

export default App;
