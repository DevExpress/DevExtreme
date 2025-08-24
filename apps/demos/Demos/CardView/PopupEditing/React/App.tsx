import React from 'react';
import CardView, { Column, CardCover, Editing, SearchPanel, Form, Item } from 'devextreme-react/card-view';
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
    />
    <Column
      dataField="hireDate"
      dataType="date"
    />
    <Column
      caption="Position"
      dataField="title"
    />
    <Column dataField="department" />
    <Column dataField="address" />
    <Column dataField="mobilePhone" />
    <Column dataField="email" />
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
    <Column
      dataField="picture"
      visible={false}
    />
  </CardView>
);

export default App;
