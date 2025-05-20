import React from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import { customers } from './data.ts';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];

const App = () => (
  <CardView
    dataSource={customers}
    keyExpr="ID"
    defaultColumns={columns}
  >
    { columns.map((column, index) => <Column dataField={column} key={index} />) }
  </CardView>
);

export default App;
