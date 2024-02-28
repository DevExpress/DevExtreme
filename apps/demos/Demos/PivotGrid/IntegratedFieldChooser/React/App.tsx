import React, { useState } from 'react';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import SelectBox from 'devextreme-react/select-box';

import PivotGrid, {
  FieldChooser,
} from 'devextreme-react/pivot-grid';

const applyChangesModeLabel = { 'aria-label': 'Apply Changes Mode' };

const App = () => {
  const [applyChangesMode, setApplyChangesMode] = useState<'instantly' | 'onDemand'>('instantly');

  return (
    <React.Fragment>
      <PivotGrid
        dataSource={dataSource}
        allowSortingBySummary={true}
        allowFiltering={true}
        allowSorting={true}
        height={470}
        showBorders={true}
      >
        <FieldChooser
          enabled={true}
          allowSearch={true}
          applyChangesMode={applyChangesMode} />
      </PivotGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Apply Changes Mode:</span>
          <SelectBox
            items={applyChangesModes}
            width={180}
            inputAttr={applyChangesModeLabel}
            value={applyChangesMode}
            onValueChange={setApplyChangesMode}>
          </SelectBox>
        </div>
      </div>
    </React.Fragment>
  );
};

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
    { dataField: '[Measures].[Customer Count]', area: 'data' },
  ],
  store: {
    type: 'xmla',
    url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
    catalog: 'Adventure Works DW Standard Edition',
    cube: 'Adventure Works',
  },
});

const applyChangesModes = ['instantly', 'onDemand'];

export default App;
