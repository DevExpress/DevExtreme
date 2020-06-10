import React from 'react';

import { PivotGrid, Scrolling } from 'devextreme-react/pivot-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const dataSource = {
  remoteOperations: true,
  store: createStore({
    key: 'OrderID',
    loadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales/Orders'
  }),
  fields: [{
    caption: 'Category',
    dataField: 'ProductCategoryName',
    width: 250,
    expanded: true,
    sortBySummaryField: 'SalesAmount',
    sortBySummaryPath: [],
    sortOrder: 'desc',
    area: 'row'
  }, {
    caption: 'Subcategory',
    dataField: 'ProductSubcategoryName',
    width: 250,
    sortBySummaryField: 'SalesAmount',
    sortBySummaryPath: [],
    sortOrder: 'desc',
    area: 'row'
  }, {
    caption: 'Product',
    dataField: 'ProductName',
    area: 'row',
    sortBySummaryField: 'SalesAmount',
    sortBySummaryPath: [],
    sortOrder: 'desc',
    width: 250
  }, {
    caption: 'Date',
    dataField: 'DateKey',
    dataType: 'date',
    area: 'column'
  }, {
    caption: 'Amount',
    dataField: 'SalesAmount',
    summaryType: 'sum',
    format: 'currency',
    area: 'data'
  }, {
    caption: 'Store',
    dataField: 'StoreName'
  }, {
    caption: 'Quantity',
    dataField: 'SalesQuantity',
    summaryType: 'sum'
  }, {
    caption: 'Unit Price',
    dataField: 'UnitPrice',
    format: 'currency',
    summaryType: 'sum'
  }, {
    dataField: 'Id',
    visible: false
  }]
};

class App extends React.Component {
  render() {
    return (
      <PivotGrid
        allowSorting={true}
        allowSortingBySummary={true}
        allowFiltering={true}
        height={620}
        showBorders={true}
        rowHeaderLayout="tree"
        dataSource={dataSource}>

        <Scrolling mode="virtual" />
      </PivotGrid>
    );
  }
}

export default App;
