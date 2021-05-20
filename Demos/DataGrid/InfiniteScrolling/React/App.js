import React from 'react';

import DataGrid, { Scrolling, Sorting, LoadPanel } from 'devextreme-react/data-grid';
import { generateData } from './data.js';

const dataSource = generateData(100000);

class App extends React.Component {
  render() {
    return (
      <DataGrid
        elementAttr ={{
          id: 'gridContainer'
        }}
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
  }
}

function customizeColumns(columns) {
  columns[0].width = 70;
}

export default App;
