import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import { orders } from './data.js';

const App = () => (
  <DataGrid
    id="grid"
    dataSource={orders}
    keyExpr="OrderNumber"
    showBorders={true}
  />
);

export default App;
