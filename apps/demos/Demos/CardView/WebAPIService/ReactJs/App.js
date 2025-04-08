import React, { useRef } from 'react';
import { CardView, Column, Pager } from 'devextreme-react/card-view';
import 'devextreme/dist/css/dx.fluent.blue.light.css';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi/Orders';

const dataSource = AspNetData.createStore({
  key: 'OrderID',
  loadUrl: url,
});

const columns = ["OrderID", "OrderDate", "ShippedDate", "Freight", "ShipName", "ShipCity", "ShipCountry"];

const App = () => {
  const cardViewRef = useRef(null);

  return (
    <CardView
      ref={cardViewRef}
      dataSource={dataSource}
      keyExpr="OrderID"
      remoteOperations={true}
      width="100%"
      cardsPerRow={3}
      paging={{ pageSize: 6 }}
      // Todo: Use nested column component instead
      columns={columns}
    >
      <Pager
        allowedPageSizes={[3, 6, 9, 12, 30]}
        showInfo={true}
        showNavigationButtons={true}
        showPageSizeSelector={true}
        visible={true}
      />

     {/*  <Column dataField="OrderID" />
      <Column dataField="OrderDate" dataType="date" />
      <Column dataField="ShippedDate" dataType="date" />
      <Column dataField="Freight" />
      <Column dataField="ShipName" />
      <Column dataField="ShipCity" />
      <Column dataField="ShipCountry" /> */}
    </CardView>
  );
};

export default App;
