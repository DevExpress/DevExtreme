import React from 'react';

import PivotGrid, {
  FieldChooser,
} from 'devextreme-react/pivot-grid';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import XmlaStore from 'devextreme/ui/pivot_grid/xmla_store';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="long-title">
          <h3>Sales Statistics</h3>
        </div>
        <PivotGrid
          dataSource={dataSource}
          allowSortingBySummary={true}
          allowSorting={true}
          allowFiltering={true}
          allowExpandAll={true}
          height={570}
          showBorders={true}
        >
          <FieldChooser enabled={true} allowSearch={true} />
        </PivotGrid>
      </React.Fragment>
    );
  }
}

const dataSource = new PivotGridDataSource({
  fields: [
    { dataField: '[Product].[Category]', area: 'row' },
    {
      dataField: '[Product].[Subcategory]',
      area: 'row',
      headerFilter: {
        search: {
          enabled: true,
        },
      },
    },
    { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
    { dataField: '[Ship Date].[Month of Year]', area: 'column' },
    { dataField: '[Measures].[Reseller Freight Cost]', area: 'data', format: 'currency' },
  ],
  store: new XmlaStore({
    type: 'xmla',
    url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
    catalog: 'Adventure Works DW Standard Edition',
    cube: 'Adventure Works',
  }),
});

export default App;
