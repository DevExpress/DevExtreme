import React from 'react';
import CardView, { Column, CardCover } from 'devextreme-react/card-view';
import { houses } from './data.js';

function imageExpr({ ID }) {
  return `https://demos.devexpress.com/ASPxCardViewDemos/Content/HomesPhoto/${ID}.jpg`;
}
function altExpr() {
  return 'Photo of the house';
}
const App = () => (
  <CardView
    dataSource={houses}
    keyExpr="ID"
  >
    <CardCover
      imageExpr={imageExpr}
      altExpr={altExpr}
    />
    <Column dataField="Address" />
    <Column
      dataField="Price"
      format="currency"
      sortOrder="asc"
    />
    <Column dataField="HouseSize" />
    <Column dataField="Baths" />
    <Column
      dataField="Beds"
      sortOrder="desc"
    />
  </CardView>
);
export default App;
