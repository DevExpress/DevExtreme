import React from 'react';
import DataGrid, { Pager } from 'devextreme-react/data-grid';
import { orders } from './data.js';

const App = () => (
  <DataGrid
    id="grid"
    dataSource={orders}
    keyExpr="OrderNumber"
    showBorders={true}
  >
    <Pager visible={true} />
  </DataGrid>
);
export default App;
