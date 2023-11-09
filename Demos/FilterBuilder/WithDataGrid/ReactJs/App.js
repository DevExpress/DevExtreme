import React from 'react';
import FilterBuilder from 'devextreme-react/filter-builder';
import Button from 'devextreme-react/button';
import DataGrid from 'devextreme-react/data-grid';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { filter, fields } from './data.js';

const dataSource = new DataSource({
  store: new ODataStore({
    version: 2,
    fieldTypes: {
      Product_Cost: 'Decimal',
      Product_Sale_Price: 'Decimal',
      Product_Retail_Price: 'Decimal',
    },
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
  }),
  select: [
    'Product_ID',
    'Product_Name',
    'Product_Cost',
    'Product_Sale_Price',
    'Product_Retail_Price',
    'Product_Current_Inventory',
  ],
});
const App = () => {
  const [value, setValue] = React.useState(filter);
  const [gridFilterValue, setGridFilterValue] = React.useState(filter);
  const onValueChanged = React.useCallback(
    (e) => {
      setValue(e.value);
    },
    [setValue],
  );
  const buttonClick = React.useCallback(() => {
    setGridFilterValue(value);
  }, [value, setGridFilterValue]);
  return (
    <div>
      <div className="filter-container">
        <FilterBuilder
          fields={fields}
          value={value}
          onValueChanged={onValueChanged}
        />
        <Button
          text="Apply Filter"
          type="default"
          onClick={buttonClick}
        />
        <div className="dx-clearfix"></div>
      </div>
      <DataGrid
        dataSource={dataSource}
        filterValue={gridFilterValue}
        showBorders={true}
        columns={fields}
        height={300}
      />
    </div>
  );
};
export default App;
