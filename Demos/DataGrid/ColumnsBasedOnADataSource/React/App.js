import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import { orders } from './data.js';

class App extends React.Component {
  render() {
    return (
      <DataGrid
        id="grid"
        dataSource={orders}
        keyExpr="OrderNumber"
        showBorders={true}
      />
    );
  }
}

export default App;
