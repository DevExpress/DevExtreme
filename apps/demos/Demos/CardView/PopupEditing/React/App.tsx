import React from 'react';
import CardView, { Column, CardCover, Editing } from 'devextreme-react/card-view';
import { employees, Employee } from './data.ts';

function altExpr({ fullName }: Employee) {
  return `Photo of ${fullName}`;
}

function imageExpr({ picture }: Employee) {
  return picture && `../../../../${picture}`;
}

function calculateFullName({firstName, lastName}: Employee) {
  return `${firstName} ${lastName}`;
}

const App = () => (
  <CardView
    dataSource={employees}
    keyExpr="id"
    // todo: move to nested components
    searchPanel={{
      visible: true,
    }}
  >
    <CardCover
      imageExpr={imageExpr}
      altExpr={altExpr}
    />
    <Editing
      allowAdding={true}
      allowUpdating={true}
      allowDeleting={true}
      // todo: move to nested components
      popup={{
        title: 'Employee Info',
        showTitle: true,
        width: 700,
        height: 525,
      }}
      // todo: move to nested components
      form={{
        items: [
          {
            caption: 'Personal Data',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: ['firstName', 'lastName', 'birthDate'],
          }, {
            caption: 'Main Info',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: ['hireDate', 'title', {
              dataField: 'notes',
              editorType: 'dxTextArea',
              colSpan: 2,
              editorOptions: {
                height: 100,
              },
            }],
          }, {
            caption: 'Contacts',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: [
              {
                dataField: 'address',
                colSpan: 2,
              }, 'city', 'zipcode', 'mobilePhone', 'email',
            ],
          },
        ],
      }}
    />
    <Column
      caption="Full Name"
      calculateFieldValue={calculateFullName}
    />
    <Column
      dataField="birthDate"
      dataType="date"
    />
    <Column
      dataField="hireDate"
      dataType="date"
    />
    <Column
      caption="Position"
      dataField="title"
    />
    <Column dataField="department"/>
    <Column dataField="address"/>
    <Column dataField="mobilePhone"/>
    <Column dataField="email"/>
    <Column
      dataField="notes"
      visible={false}
    />
    <Column
      dataField="firstName"
      visible={false}
    />
    <Column
      dataField="lastName"
      visible={false}
    />
    <Column
      dataField="city"
      visible={false}
    />
    <Column
      dataField="zipcode"
      visible={false}
    />
  </CardView>
);

export default App;
