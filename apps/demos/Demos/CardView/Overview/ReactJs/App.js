import React, { useRef } from 'react';
import CardView, {
  CardCover,
  Column,
  Selection,
  Paging,
  HeaderFilter,
  SearchPanel,
} from 'devextreme-react/card-view';
import Button from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import { employees } from './data.js';

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
function notifyCall() {
  notify({
    message: 'The "Call" button is clicked.',
    maxWidth: 560,
  });
}
function notifySendEmail() {
  notify({
    message: 'The "Send Email" button is clicked.',
    maxWidth: 560,
  });
}
function CardFooterComponent() {
  return (
    <div className="card-footer">
      <Button
        text="Call"
        icon="tel"
        type="default"
        stylingMode="contained"
        onClick={notifyCall}
      />
      <Button
        text="Send Email"
        icon="message"
        type="default"
        stylingMode="contained"
        onClick={notifySendEmail}
      />
    </div>
  );
}
function StatusComponent({ data }) {
  const classNameMap = {
    Salaried: 'status--salaried',
    Commission: 'status--commission',
    Terminated: 'status--terminated',
  };
  const className = classNameMap[data.field.value];
  return (
    <div className={`status ${className}`}>
      <div className="indicator"></div>
      <div>{data.field.value}</div>
    </div>
  );
}
function EmailComponent({ data }) {
  return <a href={`mailto:${data.field.value}`}>{data.field.text}</a>;
}
function App() {
  const cardView = useRef();
  return (
    <CardView
      dataSource={employees}
      keyExpr="ID"
      cardMinWidth={300}
      cardsPerRow="auto"
      cardFooterComponent={CardFooterComponent}
      ref={cardView}
    >
      <Paging pageSize={4} />
      <HeaderFilter visible={true} />
      <SearchPanel visible={true} />
      <Selection mode="multiple" />
      <CardCover
        imageExpr={imageExpr}
        altExpr={altExpr}
      />

      <Column
        dataField="Status"
        fieldValueComponent={StatusComponent}
        allowSearch={false}
      />
      <Column
        caption="Full Name"
        allowFiltering={true}
        allowSorting={true}
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
        allowSearch={false}
      />
      <Column
        caption="Address"
        allowFiltering={true}
        allowSorting={true}
        calculateFieldValue={calculateAddress}
      />
    </CardView>
  );
}
export default App;
