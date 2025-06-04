import React, { useRef } from 'react';
import CardView, { CardCover, Column, Selection } from 'devextreme-react/card-view';
import Button from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import { employees } from './data.js';
// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};
// TODO: Nested component does not exist
const searchPanelConfig = {
  visible: true,
};
function imageExpr({ First_Name, Last_Name }) {
  return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
}
function altExpr({ First_Name, Last_Name }) {
  return `Photo of ${First_Name} ${Last_Name}`;
}
function calculateFullName({ First_Name, Last_Name }) {
  return `${First_Name} ${Last_Name}`;
}
function calculateAddress({ State, City }) {
  return `${City}, ${State}`;
}
function CardFooterComponent() {
  return (
    <div className="footer">
      <Button
        text="Call"
        icon="tel"
        type="default"
        stylingMode="contained"
        onClick={() => {
          notify('The "Call" button is clicked.');
        }}
      />
      <Button
        text="Send Email"
        icon="send"
        type="default"
        stylingMode="contained"
        onClick={() => {
          notify('The "Send Email" button is clicked.');
        }}
      />
    </div>
  );
}
function StatusComponent({
  data: {
    field: { value },
  },
}) {
  const className = value === 'Salaried' ? 'status-ok' : 'status-warning';
  return (
    <div className={className}>
      <span className="indicator"></span>
      <span>{value}</span>
    </div>
  );
}
function EmailComponent({
  data: {
    field: { value, text },
  },
}) {
  return <a href={`mailto:${value}`}>{text}</a>;
}
function App() {
  const cardView = useRef();
  return (
    <CardView
      dataSource={employees}
      keyExpr="ID"
      cardMinWidth={250}
      cardsPerRow="auto"
      headerFilter={headerFilterConfig}
      searchPanel={searchPanelConfig}
      cardFooterComponent={CardFooterComponent}
      ref={cardView}
    >
      <Selection mode="multiple" />
      <CardCover
        imageExpr={imageExpr}
        altExpr={altExpr}
      />

      <Column
        dataField="Status"
        fieldValueComponent={StatusComponent}
      />
      <Column
        caption="Full Name"
        calculateFieldValue={calculateFullName}
      />
      <Column
        caption="Position"
        dataField="Title"
      />
      <Column dataField="Department" />
      <Column dataField="Mobile_Phone" />
      <Column
        dataField="Email"
        fieldValueComponent={EmailComponent}
      />
      <Column
        caption="Address"
        calculateFieldValue={calculateAddress}
      />
    </CardView>
  );
}
export default App;
