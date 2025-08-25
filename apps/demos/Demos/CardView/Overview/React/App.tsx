import React, { useRef } from 'react';
import CardView, {
  CardCover, Column, Selection, Paging, HeaderFilter, SearchPanel, CardViewRef,
} from 'devextreme-react/card-view';
import Button from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import { Employee, employees } from './data.ts';

function imageExpr({ First_Name, Last_Name }: Employee): string {
  return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
}

function altExpr({ First_Name, Last_Name }: Employee): string {
  return `Photo of ${First_Name} ${Last_Name}`;
}

function calculateFullName({ First_Name, Last_Name }: Employee): string {
  return `${First_Name} ${Last_Name}`;
}

function calculateAddress({ State, City }: Employee): string {
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
  return <div className='card-footer'>
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
  </div>;
}

function StatusComponent({ data: { field: { value } } }) {
  const classNameMap = {
    Salaried: 'status--salaried',
    Commission: 'status--commission',
    Terminated: 'status--terminated',
  };

  const className = classNameMap[value];

  return (
    <div className={`status ${className}`}>
      <div className="indicator"></div>
      <div>{ value }</div>
    </div>
  );
}

function EmailComponent({ data: { field: { value, text } } }) {
  return (
    <a href={`mailto:${value}`}>{text}</a>
  );
}

function App() {
  const cardView = useRef<CardViewRef>();

  return (
    <CardView
      dataSource={employees}
      keyExpr="ID"
      cardMinWidth={300}
      cardsPerRow="auto"
      cardFooterComponent={CardFooterComponent}
      ref={cardView}
    >
      <Paging
        pageSize={4}
      />
      <HeaderFilter
        visible={true}
      />
      <SearchPanel
        visible={true}
      />
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
      <Column
        dataField="Department"
      />
      <Column
        dataField="Mobile_Phone"
      />
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
