import React from 'react';

import DataGrid, { Scrolling, Paging } from 'devextreme-react/data-grid';
import { generateData } from './data.js';

const dataSource = generateData(50, 500);

class App extends React.Component {
  render() {
    return (
      <DataGrid
        elementAttr ={{
          id: 'gridContainer'
        }}
        dataSource={dataSource}
        keyExpr="field1"
        showBorders={true}
        columnWidth={100}
      >
        <Scrolling columnRenderingMode="virtual" />
        <Paging enabled={false} />
      </DataGrid>
    );
  }
}

export default App;
