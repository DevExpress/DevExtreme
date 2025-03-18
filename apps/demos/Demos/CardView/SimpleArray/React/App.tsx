import React from 'react';
import CardView, { Column, CardCover } from 'devextreme-react/card-view';
import { employees } from './data';

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
  <CardView dataSource={employees} keyExpr="ID">
    {columns.map((column, index) => (
      <Column dataField={column} key={index} />
    ))}
    <CardCover imageExpr={imageExpr} altExpr="FirstName" />
  </CardView>
);

export default App;
