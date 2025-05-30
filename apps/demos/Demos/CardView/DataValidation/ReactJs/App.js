import React from 'react';
import CardView, {
  Column,
  CardCover,
  Editing,
  RequiredRule,
  PatternRule,
  EmailRule,
  AsyncRule,
  CustomRule,
} from 'devextreme-react/card-view';
import { employees } from './data.js';

function altExpr({ fullName }) {
  return `Photo of ${fullName}`;
}
function imageExpr({ picture }) {
  return picture;
}
function calculateFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
const emailValidationUrl = 'https://js.devexpress.com/Demos/NetCore/RemoteValidation/CheckUniqueEmailAddress';
async function emailValidationCallback(params) {
  const response = await fetch(emailValidationUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;',
    },
    body: JSON.stringify({
      id: params.data.id,
      email: params.value,
    }),
  });
  const result = await response.json();
  return result;
}
function hireDateValidationCallback(params) {
  return new Date(params.data.hireDate) > new Date(params.data.birthDate);
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
            items: ['firstName', 'lastName', 'birthDate', 'picture'],
          },
          {
            caption: 'Main Info',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: [
              'hireDate',
              'title',
              {
                dataField: 'notes',
                editorType: 'dxTextArea',
                colSpan: 2,
                editorOptions: {
                  height: 100,
                },
              },
            ],
          },
          {
            caption: 'Contacts',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: [
              {
                dataField: 'address',
                colSpan: 2,
              },
              'city',
              'zipcode',
              'mobilePhone',
              'email',
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
    >
      <RequiredRule />
    </Column>
    <Column
      dataField="hireDate"
      dataType="date"
    >
      <RequiredRule />
      <CustomRule
        message="Hire date cannot be earlier than birth date"
        validationCallback={hireDateValidationCallback}
      />
    </Column>
    <Column
      caption="Position"
      dataField="title"
    >
      <RequiredRule />
    </Column>
    <Column dataField="department" />
    <Column dataField="address" />
    <Column dataField="mobilePhone">
      <PatternRule
        message="Your phone must have '(555) 555-5555' format!"
        pattern={/^\(\d{3}\) \d{3}-\d{4}$/i}
      />
    </Column>
    <Column dataField="email">
      <EmailRule />
      <AsyncRule
        message="Email address is not unique"
        validationCallback={emailValidationCallback}
      />
    </Column>
    <Column
      dataField="notes"
      visible={false}
    />
    <Column
      dataField="firstName"
      visible={false}
    >
      <RequiredRule />
    </Column>
    <Column
      dataField="lastName"
      visible={false}
    >
      <RequiredRule />
    </Column>
    <Column
      dataField="city"
      visible={false}
    />
    <Column
      dataField="zipcode"
      visible={false}
    />
    <Column
      dataField="picture"
      visible={false}
    />
  </CardView>
);
export default App;
