import React from 'react';

import 'devextreme/data/odata/store';
import DataGrid, { Column } from 'devextreme-react/data-grid';

const dataSourceOptions = {
  store: {
    type: 'odata',
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
    key: 'Product_ID'
  },
  select: [
    'Product_ID',
    'Product_Name',
    'Product_Cost',
    'Product_Sale_Price',
    'Product_Retail_Price',
    'Product_Current_Inventory'
  ],
  filter: ['Product_Current_Inventory', '>', 0]
};

class App extends React.Component {
  render() {
    return (
      <DataGrid
        dataSource={dataSourceOptions}
        showBorders={true}
      >
        <Column dataField="Product_ID" />
        <Column
          dataField="Product_Name"
          width={250}
        />
        <Column
          dataField="Product_Cost"
          caption="Cost"
          dataType="number"
          format="currency"
        />
        <Column
          dataField="Product_Sale_Price"
          caption="Sale Price"
          dataType="number"
          format="currency"
        />
        <Column
          dataField="Product_Retail_Price"
          caption="Retail Price"
          dataType="number"
          format="currency"
        />
        <Column
          dataField="Product_Current_Inventory"
          caption="Inventory"
        />
      </DataGrid>
    );
  }
}

export default App;
