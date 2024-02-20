import React from 'react';
import DataGrid, {
  Scrolling, Paging, Column, HeaderFilter, Search,
} from 'devextreme-react/data-grid';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const dataSource = AspNetData.createStore({
  key: 'Id',
  loadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales',
});

const App = () => (
  <DataGrid
    height={440}
    dataSource={dataSource}
    showBorders={true}
    remoteOperations={true}
    wordWrapEnabled={true}
  >
    <Scrolling mode="virtual" rowRenderingMode="virtual" />
    <Paging defaultPageSize={100} />
    <HeaderFilter visible={true}>
      <Search enabled={true} />
    </HeaderFilter>

    <Column dataField="Id" width={90} />
    <Column dataField="StoreName" caption="Store" width={150} />
    <Column dataField="ProductCategoryName" caption="Category" width={120} />
    <Column dataField="ProductName" caption="Product" />
    <Column dataField="DateKey" caption="Date" dataType="date" format="yyyy-MM-dd" width={110} />
    <Column dataField="SalesAmount" caption="Amount" format="currency" width={100}>
      <HeaderFilter groupInterval={1000} />
    </Column>
  </DataGrid>
);

export default App;
