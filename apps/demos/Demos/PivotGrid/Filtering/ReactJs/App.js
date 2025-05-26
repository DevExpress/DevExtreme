import React, { useState } from 'react';
import {
  PivotGrid,
  HeaderFilter,
  Search,
  FieldChooser,
  FieldPanel,
} from 'devextreme-react/pivot-grid';
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
      filterValues: ['[Customer].[Country].&[United Kingdom]'],
    },
    {
      dataField: '[Ship Date].[Calendar Year]',
      area: 'filter',
      filterValues: ['[Ship Date].[Calendar Year].&[2004]'],
    },
  ],
  store: new XmlaStore({
    url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
    catalog: 'Adventure Works DW Standard Edition',
    cube: 'Adventure Works',
  }),
});
const App = () => {
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [showRelevantValues, setShowRelevantValues] = useState(true);
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
          showRelevantValues={showRelevantValues}
          width={300}
          height={400}
        >
          <Search enabled={searchEnabled} />
        </HeaderFilter>
        <FieldChooser allowSearch={true} />
        <FieldPanel visible={true} />
      </PivotGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="option">
            <CheckBox
              value={searchEnabled}
              text="Allow Search"
              onValueChange={setSearchEnabled}
            />
          </div>
          <div className="option">
            <CheckBox
              value={showRelevantValues}
              text="Show Relevant Values"
              onValueChange={setShowRelevantValues}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
