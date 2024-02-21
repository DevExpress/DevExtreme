import React from 'react';

import PivotGrid, {
  FieldChooser,
  Scrolling,
} from 'devextreme-react/pivot-grid';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import sales from './data.ts';

const App = () => (
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
);

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
  }, {
    groupName: 'date',
    groupInterval: 'year',
    expanded: true,
  }, {
    groupName: 'date',
    groupInterval: 'quarter',
    expanded: true,
  }, {
    groupName: 'date',
    groupInterval: 'month',
    visible: false,
  }, {
    caption: 'Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }, {
    caption: 'Running Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
    runningTotal: 'row',
    allowCrossGroupCalculation: true,
  }],
  store: sales,
});

export default App;
