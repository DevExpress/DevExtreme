import React from 'react';

import PivotGrid, {
  FieldChooser,
  Scrolling
} from 'devextreme-react/pivot-grid';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import sales from './data.js';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <PivotGrid
          dataSource={dataSource}
          allowSortingBySummary={true}
          allowSorting={true}
          allowFiltering={true}
          allowExpandAll={true}
          height={560}
          showBorders={true}>
          <FieldChooser enabled={false} />
          <Scrolling mode="virtual" />
        </PivotGrid>
      </React.Fragment>
    );
  }
}

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
    expanded: true
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
    groupInterval: 'quarter',
    expanded: true
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

export default App;
