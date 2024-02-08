import React from 'react';
import DataGrid from 'devextreme-react/data-grid';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
const App = () => (
  <DataGrid
    dataSource="../../../../data/customers.json"
    defaultColumns={columns}
    showBorders={true}
  />
);
export default App;
