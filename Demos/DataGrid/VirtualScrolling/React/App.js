import React from 'react';

import DataGrid, { Scrolling, Sorting, LoadPanel } from 'devextreme-react/data-grid';
import { generateData } from './data.js';

const dataSource = generateData(100000);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadPanelEnabled: true
    };
    this.onContentReady = this.onContentReady.bind(this);
  }

  render() {
    return (
      <DataGrid
        elementAttr={{
          id: 'gridContainer'
        }}
        dataSource={dataSource}
        keyExpr="id"
        showBorders={true}
        customizeColumns={this.customizeColumns}
        onContentReady={this.onContentReady}
      >
        <Sorting mode="none" />
        <Scrolling mode="virtual" />
        <LoadPanel enabled={this.state.loadPanelEnabled} />
      </DataGrid>
    );
  }

  customizeColumns(columns) {
    columns[0].width = 70;
  }

  onContentReady() {
    this.setState({
      loadPanelEnabled: false
    });
  }
}

export default App;
