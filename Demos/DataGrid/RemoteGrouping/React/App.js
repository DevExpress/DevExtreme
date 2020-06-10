import React from 'react';

import DataGrid, { Scrolling, RemoteOperations, Column, Grouping, GroupPanel, Summary, GroupItem } from 'devextreme-react/data-grid';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const dataSource = AspNetData.createStore({
  key: 'Id',
  loadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales'
});

class App extends React.Component {
  render() {
    return (
      <DataGrid
        elementAttr ={{
          id: 'gridContainer'
        }}
        dataSource={dataSource}
        showBorders={true}
        wordWrapEnabled={true}
      >
        <RemoteOperations groupPaging={true} />
        <Scrolling mode="virtual" />
        <Grouping autoExpandAll={false} />
        <GroupPanel visible={true} />

        <Column dataField="Id" dataType="number" width={75} />
        <Column dataField="ProductSubcategoryName" caption="Subcategory" width={150} />
        <Column dataField="StoreName" caption="Store" width={150} groupIndex={0} />
        <Column dataField="ProductCategoryName" caption="Category" width={120} groupIndex={1} />
        <Column dataField="ProductName" caption="Product" />
        <Column dataField="DateKey" caption="Date" dataType="date" format="yyyy-MM-dd" width={100} />
        <Column dataField="SalesAmount" caption="Amount" format="currency" width={100} />

        <Summary>
          <GroupItem
            column="Id"
            summaryType="count" />
        </Summary>
      </DataGrid>
    );
  }
}

export default App;
