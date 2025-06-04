import React from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import { orders } from './data.js';

const App = () => (
  <CardView
    id="cardView"
    dataSource={orders}
    cardMinWidth={100}
    wordWrapEnabled={true}
    keyExpr="ID"
    allowColumnReordering={true}
  >
    <Column
      dataField="OrderNumber"
      allowReordering={false}
    />
    <Column dataField="SaleAmount" />
    <Column dataField="Customer" />
    <Column dataField="Location" />
    <Column
      dataField="OrderDate"
      dataType="date"
    />
    <Column
      dataField="DeliveryDate"
      dataType="date"
    />
  </CardView>
);
export default App;
