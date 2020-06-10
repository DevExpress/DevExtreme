import React from 'react';

import PivotGrid, {
  FieldChooser
} from 'devextreme-react/pivot-grid';
import CheckBox from 'devextreme-react/check-box';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import sales from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTotalsPrior: false,
      dataFieldArea: false,
      rowHeaderLayout: true
    };
    this.onShowTotalsPriorChanged = this.onShowTotalsPriorChanged.bind(this);
    this.onDataFieldAreaChanged = this.onDataFieldAreaChanged.bind(this);
    this.onRowHeaderLayoutChanged = this.onRowHeaderLayoutChanged.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <PivotGrid
          id="sales"
          showTotalsPrior={this.state.showTotalsPrior ? 'both' : 'none'}
          dataFieldArea={this.state.dataFieldArea ? 'row' : 'column'}
          rowHeaderLayout={this.state.rowHeaderLayout ? 'tree' : 'standard'}
          wordWrapEnabled={false}
          dataSource={dataSource}
          showBorders={true}
          height="440">
          <FieldChooser height="500" />
        </PivotGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox id="show-totals-prior"
              text="Show Totals Prior"
              value={this.state.showTotalsPrior}
              onValueChanged={this.onShowTotalsPriorChanged} />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox id="data-field-area"
              text="Data Field Headers in Rows"
              value={this.state.dataFieldArea}
              onValueChanged={this.onDataFieldAreaChanged} />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox id="row-header-layout"
              text="Tree Row Header Layout"
              value={this.state.rowHeaderLayout}
              onValueChanged={this.onRowHeaderLayoutChanged} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  onShowTotalsPriorChanged(data) {
    this.setState({
      showTotalsPrior: data.value
    });
  }

  onDataFieldAreaChanged(data) {
    this.setState({
      dataFieldArea: data.value
    });
  }

  onRowHeaderLayoutChanged(data) {
    this.setState({
      rowHeaderLayout: data.value
    });
  }
}

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    dataField: 'region',
    expanded: true,
    area: 'row'
  }, {
    caption: 'Country',
    dataField: 'country',
    expanded: true,
    area: 'row'
  }, {
    caption: 'City',
    dataField: 'city',
    area: 'row'
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column'
  }, {
    caption: 'Sales',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data'
  }, {
    caption: 'Percent',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    summaryDisplayMode: 'percentOfRowGrandTotal',
    area: 'data'
  }],
  store: sales
});

export default App;
