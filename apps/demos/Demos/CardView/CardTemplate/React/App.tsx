import React from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import { Vehicle, vehicles } from './data.ts';
import VehicleCard from './VehicleCard.tsx';

const cardTemplate = (model) => <VehicleCard vehicle={model.card.data as Vehicle} />

const App = () => (
  <CardView
    dataSource={vehicles}
    cardsPerRow="auto"
    cardMinWidth={260}
    cardMaxWidth={260}
    // todo: move to nested
    searchPanel={{
      visible: true,
    }}
    paging={{
      pageSize: 12,
    }}
    headerFilter={{
      visible: true,
    }}
    cardRender={cardTemplate}
  >
    <Column dataField='TrademarkName'></Column>
    <Column dataField='Name'></Column>
    <Column
      dataField='Price'
      format='currency'
    ></Column>
    <Column dataField='CategoryName'></Column>

    <Column dataField='Modification'></Column>
    <Column dataField='BodyStyleName'></Column>
    <Column dataField='Horsepower'></Column>
  </CardView>
);

export default App;

