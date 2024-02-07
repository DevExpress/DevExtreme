import React from 'react';
import DataGrid, {
  Scrolling, Sorting, LoadPanel, DataGridTypes,
} from 'devextreme-react/data-grid';
import { generateData } from './data.ts';

const dataSource = generateData(100000);

const customizeColumns = (columns: DataGridTypes.Column[]) => {
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
