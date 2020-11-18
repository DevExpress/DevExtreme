import React from 'react';

import DataGrid, {
  Column,
  Sorting,
  Paging
} from 'devextreme-react/data-grid';
import service from './data.js';
import DiffCell from './DiffCell.js';
import ChartCell from './ChartCell.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = service.getWeekData();
  }
  render() {
    return (
      <DataGrid id="gridContainer"
        dataSource={this.dataSource}
        showRowLines={true}
        showColumnLines={false}
        showBorders={true}>
        <Sorting mode="none" />
        <Paging defaultPageSize={10} />
        <Column dataField="date" width={110} dataType="date" />
        <Column caption="Open" cellRender={DiffCell} />
        <Column caption="Close" cellRender={DiffCell} />
        <Column caption="Dynamics" minWidth={320} cellRender={ChartCell} />
        <Column caption="High" cellRender={DiffCell} />
        <Column caption="Low" cellRender={DiffCell} />
      </DataGrid>
    );
  }
}

export default App;
