import React from 'react';
import DataGrid, { Scrolling, Sorting, LoadPanel } from 'devextreme-react/data-grid';
import { generateData } from './data.js';

const dataSource = generateData(100000);

const customizeColumns = (columns) => {
  columns[0].width = 70;
};

const App = () => (
  <DataGrid
    height={440}
    dataSource={dataSource}
    keyExpr="id"
    showBorders={true}
    customizeColumns={customizeColumns}
  >
    <Sorting mode="none" />
    <Scrolling mode="infinite" />
    <LoadPanel enabled={false} />
  </DataGrid>
);

export default App;
