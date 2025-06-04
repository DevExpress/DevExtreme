import React from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import { customers } from './data.ts';

const columns = ['CompanyName', 'Address', 'City', 'State', 'Zipcode', 'Phone'];

const App = () => (
  <CardView
    dataSource={customers}
    keyExpr="ID"
    cardMinWidth={100}
    wordWrapEnabled={true}
  >
    { columns.map((column, index) => <Column dataField={column} key={index} />) }
  </CardView>
);

export default App;
