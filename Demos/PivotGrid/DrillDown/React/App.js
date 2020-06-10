import React from 'react';
import {
  PivotGrid,
  FieldChooser
} from 'devextreme-react/pivot-grid';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import { sales } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popupTitle: '',
      drillDownDataSource: null,
      popupVisible: false
    };
    this.onCellClick = this.onCellClick.bind(this);
    this.onHiding = this.onHiding.bind(this);
    this.onShown = this.onShown.bind(this);
    this.getDataGridInstance = this.getDataGridInstance.bind(this);
  }
  render() {
    let { drillDownDataSource, popupTitle, popupVisible } = this.state;

    return (
      <React.Fragment>
        <PivotGrid
          id="sales"
          allowSortingBySummary={true}
          allowSorting={true}
          allowFiltering={true}
          allowExpandAll={true}
          showBorders={true}
          dataSource={dataSource}
          onCellClick={this.onCellClick}
        >
          <FieldChooser enabled={false} />
        </PivotGrid>
        <Popup
          visible={popupVisible}
          width={600}
          height={400}
          title={popupTitle}
          onHiding={this.onHiding}
          onShown={this.onShown}
        >
          <DataGrid
            width={560}
            height={300}
            dataSource={drillDownDataSource}
            ref={this.getDataGridInstance}
          >
            <Column dataField="region" />
            <Column dataField="city" />
            <Column dataField="amount" dataType="number" format="currency" />
            <Column dataField="date" dataType="date" />
          </DataGrid>
        </Popup>
      </React.Fragment>
    );
  }
  getDataGridInstance(ref) {
    this.dataGrid = ref.instance;
  }
  onCellClick(e) {
    if (e.area == 'data') {
      var pivotGridDataSource = e.component.getDataSource(),
        rowPathLength = e.cell.rowPath.length,
        rowPathName = e.cell.rowPath[rowPathLength - 1];

      this.setState({
        popupTitle: `${rowPathName ? rowPathName : 'Total'} Drill Down Data`,
        drillDownDataSource: pivotGridDataSource.createDrillDownDataSource(e.cell),
        popupVisible: true
      });
    }
  }
  onHiding() {
    this.setState({
      popupVisible: false
    });
  }
  onShown() {
    this.dataGrid.updateDimensions();
  }
}
export default App;

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row'
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row'
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column'
  }, {
    caption: 'Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data'
  }],
  store: sales
});
