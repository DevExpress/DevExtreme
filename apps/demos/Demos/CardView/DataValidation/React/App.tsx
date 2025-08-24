import React from 'react';
import CardView, { Column, CardCover, Editing, SearchPanel, Form, Item, RequiredRule, PatternRule, EmailRule, AsyncRule, CustomRule } from 'devextreme-react/card-view';
import 'devextreme-react/text-area';
import { employees, Employee } from './data.ts';

function altExpr({ fullName }: Employee) {
  return `Photo of ${fullName}`;
}

function imageExpr({ picture }: Employee) {
  return picture;
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
}

function hireDateValidationCallback(params) {
  return new Date(params.value) > new Date(params.data.birthDate);
}

const App = () => (
  <CardView
    dataSource={employees}
    keyExpr="id"
    cardsPerRow="auto"
    cardMinWidth={350}
    height={840}
  >
    <SearchPanel
      visible={true}
    />
    <CardCover
      imageExpr={imageExpr}
      altExpr={altExpr}
    />
    <Editing
      allowAdding={true}
      allowUpdating={true}
      allowDeleting={true}
      popup={{
        title: 'Employee Info',
        showTitle: true,
        width: 700,
        height: 525,
      }}
    >
      <Form>
        <Item
          caption="Personal Data"
          itemType="group"
          colCount={2}
          colSpan={2}
        >
          <Item
            dataField="firstName"
          ></Item>
          <Item
            dataField="lastName"
          ></Item>
          <Item
            dataField="birthDate"
          ></Item>
          <Item
            dataField="picture"
          ></Item>
        </Item>
        <Item
          caption="Main Info"
          itemType="group"
          colCount={2}
          colSpan={2}
        >
          <Item
            dataField="hireDate"
          ></Item>
          <Item
            dataField="title"
          ></Item>
          <Item
            dataField="department"
          ></Item>
          <Item
            dataField="notes"
            editorType="dxTextArea"
            colSpan={2}
            editorOptions={{ height: 100 }}
          ></Item>
          <Item
            dataField="picture"
          ></Item>
        </Item>
        <Item
          caption="Contacts"
          itemType="group"
          colCount={2}
          colSpan={2}
        >
          <Item
            dataField="address"
            colSpan={2}
          ></Item>
          <Item
            dataField="city"
          ></Item>
          <Item
            dataField="zipcode"
          ></Item>
          <Item
            dataField="mobilePhone"
            editorOptions={{
              mask: '+1 (000) 000-0000',
              useMaskedValue: true,
            }}
          ></Item>
          <Item
            dataField="email"
          ></Item>
        </Item>
      </Form>
    </Editing>
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
      <RequiredRule />
    </Column>
    <Column dataField="email">
      <EmailRule />
      <AsyncRule
        message="Email address is not unique"
        ignoreEmptyValue={true}
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
