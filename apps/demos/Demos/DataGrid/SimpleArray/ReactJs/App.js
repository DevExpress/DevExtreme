import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { customers } from './data.js';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
const App = () => (
  <DataGrid
    dataSource={customers}
    keyExpr="ID"
    defaultColumns={columns}
    showBorders={true}
  >
    {columns.map((column, index) => (
      <Column
        dataField={column}
        key={index}
      />
    ))}
  </DataGrid>
);
export default App;
