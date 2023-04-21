import React from 'react';

import PivotGrid, {
  FieldPanel,
  FieldChooser,
  HeaderFilter,
  Search,
  Scrolling,
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
          allowSorting={true}
          allowFiltering={true}
          height={570}
          showBorders={true}
        >
          <FieldPanel visible={true} showFilterFields={false} />
          <FieldChooser allowSearch={true} />
          <HeaderFilter>
            <Search enabled={true} />
          </HeaderFilter>
          <Scrolling mode="virtual" />
        </PivotGrid>
      </React.Fragment>
    );
  }
}

const dataSource = new PivotGridDataSource({
  paginate: true,
  fields: [
    { dataField: '[Customer].[Customer]', area: 'row' },
    { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
    { dataField: '[Ship Date].[Month of Year]', area: 'column' },
    { dataField: '[Measures].[Internet Sales Amount]', area: 'data' },
  ],
  store: new XmlaStore({
    type: 'xmla',
    url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
    catalog: 'Adventure Works DW Standard Edition',
    cube: 'Adventure Works',
  }),
});

export default App;
