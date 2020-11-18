import React from 'react';

import DataGrid, { Scrolling, Paging, Column, HeaderFilter } from 'devextreme-react/data-grid';
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
        remoteOperations={true}
        wordWrapEnabled={true}
      >
        <Scrolling mode="virtual" rowRenderingMode="virtual" />
        <Paging defaultPageSize={100} />
        <HeaderFilter visible={true} allowSearch={true} />

        <Column dataField="Id" width={75} />
        <Column dataField="StoreName" caption="Store" width={150} />
        <Column dataField="ProductCategoryName" caption="Category" width={120} />
        <Column dataField="ProductName" caption="Product" />
        <Column dataField="DateKey" caption="Date" dataType="date" format="yyyy-MM-dd" width={100} />
        <Column dataField="SalesAmount" caption="Amount" format="currency" width={100}>
          <HeaderFilter groupInterval={1000} />
        </Column>
      </DataGrid>
    );
  }
}

export default App;
