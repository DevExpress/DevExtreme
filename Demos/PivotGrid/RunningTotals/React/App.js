import React from 'react';

import PivotGrid, {
  FieldChooser,
  Scrolling
} from 'devextreme-react/pivot-grid';
import CheckBox from 'devextreme-react/check-box';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import sales from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.changeAllowCrossGroupCalculation = this.changeAllowCrossGroupCalculation.bind(this);
    this.state = {
      allowCrossGroupCalculation: true
    };
  }

  changeAllowCrossGroupCalculation(e) {
    this.setState({ allowCrossGroupCalculation: e.value });
    dataSource.field(6, { allowCrossGroupCalculation: this.state.allowCrossGroupCalculation });
    dataSource.load();
  }

  render() {
    return (
      <React.Fragment>
        <PivotGrid
          id="sales"
          dataSource={dataSource}
          allowSortingBySummary={true}
          allowSorting={true}
          allowFiltering={true}
          allowExpandAll={true}
          showBorders={true}
          showTotalsPrior="rows"
          showColumnTotals={false}>
          <FieldChooser enabled={false} />
          <Scrolling mode="virtual" />
        </PivotGrid>
        <CheckBox
          value={this.state.allowCrossGroupCalculation}
          text="Allow cross-group running totals accumulation"
          onValueChanged={this.changeAllowCrossGroupCalculation}
        />
      </React.Fragment>
    );
  }
}

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
    groupName: 'date',
    groupInterval: 'year',
    expanded: true
  }, {
    groupName: 'date',
    groupInterval: 'month',
    visible: false
  }, {
    caption: 'Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data'
  }, {
    caption: 'Running Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
    runningTotal: 'row',
    allowCrossGroupCalculation: true
  }],
  store: sales
});

export default App;
