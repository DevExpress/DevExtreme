import React from 'react';
import CardView, { Column, CardCover, Paging, Sorting } from 'devextreme-react/card-view';
import { houses, House } from './data.ts';

function imageExpr({ ID }: House): string {
  return `https://demos.devexpress.com/ASPxCardViewDemos/Content/HomesPhoto/${ID}.jpg`;
}

function altExpr(): string {
  return 'Photo of the house';
}

const App = () => (
  <CardView
    dataSource={houses}
    keyExpr="ID"
    cardsPerRow={2}
  >
    <Paging
      pageSize={4}
    />
    <Sorting
      mode="multiple"
    />
    <CardCover
      imageExpr={imageExpr}
      altExpr={altExpr}
    />
    <Column
      dataField="Address"
    />
    <Column
      dataField="Price"
      format="currency"
      defaultSortOrder="asc"
    />
    <Column
      dataField="HouseSize"
    />
    <Column
      dataField="Baths"
    />
    <Column
      dataField="Beds"
      defaultSortOrder="desc"
    />
  </CardView>
);

export default App;
