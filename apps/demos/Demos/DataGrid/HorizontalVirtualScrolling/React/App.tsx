import React from 'react';
import DataGrid, { Scrolling, Paging } from 'devextreme-react/data-grid';
import { generateData } from './data.ts';

const dataSource = generateData(50, 500);

const App = () => (
  <DataGrid
    height={440}
    dataSource={dataSource}
    keyExpr="field1"
    showBorders={true}
    columnWidth={100}
  >
    <Scrolling columnRenderingMode="virtual" />
    <Paging enabled={false} />
  </DataGrid>
);

export default App;
