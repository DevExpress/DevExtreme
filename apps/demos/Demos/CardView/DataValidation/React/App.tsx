import React from 'react';
import CardView, { Column, CardCover, Editing, RequiredRule, PatternRule, EmailRule, AsyncRule } from 'devextreme-react/card-view';
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
};

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
    >
      <RequiredRule/>
    </Column>
    <Column
      dataField="hireDate"
      dataType="date"
    >
      <RequiredRule/> 
    </Column>
    <Column
      caption="Position"
      dataField="title"
    >
      <RequiredRule/>
    </Column>
    <Column dataField="department"/>
    <Column dataField="address"/>
    <Column dataField="mobilePhone">
      <RequiredRule/>
      <PatternRule
        message="Your phone must have '(555) 555-5555' format!"
        pattern={/^\(\d{3}\) \d{3}-\d{4}$/i}
      />
    </Column>
    <Column dataField="email">
      <RequiredRule/>
      <EmailRule/>
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
