import React from 'react';
import CardView, { Column, Paging } from 'devextreme-react/card-view';
import { customers } from './data.js';

const columns = ['Company', 'Address', 'City', 'State', 'Zipcode', 'Phone'];
const App = () => (
  <CardView
    dataSource={customers}
    keyExpr="ID"
    cardsPerRow={2}
  >
    <Paging pageSize={4} />
    {columns.map((column, index) => (
      <Column
        dataField={column}
        key={index}
      />
    ))}
  </CardView>
);
export default App;
