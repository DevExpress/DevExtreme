import React from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import { customers } from './data.js';

const columns = ['CompanyName', 'Address', 'City', 'State', 'Zipcode', 'Phone'];
const App = () => (
  <CardView
    dataSource={customers}
    keyExpr="ID"
  >
    {columns.map((column, index) => (
      <Column
        dataField={column}
        key={index}
      />
    ))}
  </CardView>
);
export default App;
