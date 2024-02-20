import React, { useState } from 'react';
import PivotGrid, { FieldChooser } from 'devextreme-react/pivot-grid';
import CheckBox from 'devextreme-react/check-box';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import sales from './data.js';

const App = () => {
  const [showTotalsPrior, setShowTotalsPrior] = useState(false);
  const [dataFieldArea, setDataFieldArea] = useState(false);
  const [rowHeaderLayout, setRowHeaderLayout] = useState(true);
  return (
    <React.Fragment>
      <PivotGrid
        id="sales"
        showTotalsPrior={showTotalsPrior ? 'both' : 'none'}
        dataFieldArea={dataFieldArea ? 'row' : 'column'}
        rowHeaderLayout={rowHeaderLayout ? 'tree' : 'standard'}
        wordWrapEnabled={false}
        dataSource={dataSource}
        showBorders={true}
        height="440"
      >
        <FieldChooser height={500} />
      </PivotGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            id="show-totals-prior"
            text="Show Totals Prior"
            value={showTotalsPrior}
            onValueChange={setShowTotalsPrior}
          />
        </div>
        &nbsp;
        <div className="option">
          <CheckBox
            id="data-field-area"
            text="Data Field Headers in Rows"
            value={dataFieldArea}
            onValueChange={setDataFieldArea}
          />
        </div>
        &nbsp;
        <div className="option">
          <CheckBox
            id="row-header-layout"
            text="Tree Row Header Layout"
            value={rowHeaderLayout}
            onValueChange={setRowHeaderLayout}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
const dataSource = new PivotGridDataSource({
  fields: [
    {
      caption: 'Region',
      dataField: 'region',
      expanded: true,
      area: 'row',
    },
    {
      caption: 'Country',
      dataField: 'country',
      expanded: true,
      area: 'row',
    },
    {
      caption: 'City',
      dataField: 'city',
      area: 'row',
    },
    {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    },
    {
      caption: 'Sales',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
    },
    {
      caption: 'Percent',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      summaryDisplayMode: 'percentOfRowGrandTotal',
      area: 'data',
    },
  ],
  store: sales,
});
export default App;
