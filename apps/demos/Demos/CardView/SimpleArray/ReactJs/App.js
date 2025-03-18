import React from 'react';
import CardView from 'devextreme-react/card-view';
import { employees } from './data.js';

const columns = [
  'ID',
  'FirstName',
  'LastName',
  'Prefix',
  'Position',
  'Picture',
  'BirthDate',
  'HireDate',
  'Address',
];

const imageExpr = (data) => 
  `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/${data.Picture}`;

const App = () => (
  <CardView 
    dataSource={employees} 
    keyExpr="ID"
    // TODO: Should be converted to proper nested components
    columns={columns}
    cardCover={{
      imageExpr,
      altExpr: (data) => (data).FirstName,
    }}
  >
  </CardView>
);

export default App;
