import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import { customers } from './data.ts';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];

const App = () => (
  <DataGrid
    dataSource={customers}
    keyExpr="ID"
    defaultColumns={columns}
    showBorders={true}
  />
);

export default App;
