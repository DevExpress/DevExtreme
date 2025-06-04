import React from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import { customers } from './data.js';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
const App = () => (
  <CardView
    dataSource={customers}
    keyExpr="ID"
    cardMinWidth={100}
    wordWrapEnabled={true}
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
