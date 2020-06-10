import React from 'react';
import { PivotGrid, HeaderFilter, FieldChooser, FieldPanel } from 'devextreme-react/pivot-grid';
import { CheckBox } from 'devextreme-react/check-box';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import XmlaStore from 'devextreme/ui/pivot_grid/xmla_store';

const dataSource = new PivotGridDataSource({
  fields: [
    { dataField: '[Product].[Category]', area: 'column' },
    { dataField: '[Product].[Subcategory]', area: 'column' },
    { dataField: '[Customer].[City]', area: 'row' },
    { dataField: '[Measures].[Internet Total Product Cost]', area: 'data', format: 'currency' },
    {
      dataField: '[Customer].[Country]',
      area: 'filter',
      filterValues: ['[Customer].[Country].&[United Kingdom]']
    },
    {
      dataField: '[Ship Date].[Calendar Year]',
      area: 'filter',
      filterValues: ['[Ship Date].[Calendar Year].&[2004]']
    }
  ],
  store: new XmlaStore({
    type: 'xmla',
    url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
    catalog: 'Adventure Works DW Standard Edition',
    cube: 'Adventure Works'
  })
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allowSearch: true,
      showRelevantValues: true
    };

    this.onAllowSearchChanged = this.onAllowSearchChanged.bind(this);
    this.onShowRelevantValuesChanged = this.onShowRelevantValuesChanged.bind(this);
  }
  render() {
    const { allowSearch, showRelevantValues } = this.state;

    return (
      <div>
        <PivotGrid
          id="sales"
          allowFiltering={true}
          allowSorting={true}
          allowSortingBySummary={true}
          height={570}
          showBorders={true}
          dataSource={dataSource}
        >
          <HeaderFilter
            allowSearch={allowSearch}
            showRelevantValues={showRelevantValues}
            width={300}
            height={400}
          />
          <FieldChooser allowSearch={true} />
          <FieldPanel visible={true} />
        </PivotGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              value={allowSearch}
              text="Allow Search"
              onValueChanged={this.onAllowSearchChanged}
            />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              value={showRelevantValues}
              text="Show Relevant Values"
              onValueChanged={this.onShowRelevantValuesChanged}
            />
          </div>
        </div>
      </div>
    );
  }
  onAllowSearchChanged(data) {
    this.setState({
      allowSearch: data.value
    });
  }
  onShowRelevantValuesChanged(data) {
    this.setState({
      showRelevantValues: data.value
    });
  }
}

export default App;
