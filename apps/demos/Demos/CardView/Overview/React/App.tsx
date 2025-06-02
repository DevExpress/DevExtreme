import React, { useCallback, useRef } from 'react';
import CardView, {
  CardCover, Column, Selection, CardViewRef,
} from 'devextreme-react/card-view';
import Button from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import { Employee, employees } from './data.ts';

// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};

// TODO: Nested component does not exist
const searchPanelConfig = {
  visible: true,
};

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

function calculateAssignedTo({ Head_ID }) {
  const assignedTo = employees
    .find((employee) => employee.ID === Head_ID)

  if (!assignedTo) {
    return 'None';
  }

  return `${assignedTo.First_Name} ${assignedTo.Last_Name}`;
}

function CardFooterComponent() {
  return <div className='footer'>
    <Button
      text="Call"
      icon="tel"
      type="default"
      stylingMode="contained"
      onClick={() => { notify('The "Call" button is clicked.'); }}
    />
    <Button
      text="Send Email"
      icon="send"
      type="default"
      stylingMode="contained"
      onClick={() => { notify('The "Send Email" button is clicked.'); }}
    />
  </div>
}

function StatusComponent({ data: { field: { value }}}) {
  const className = value === 'Salaried'
    ? 'status-ok'
    : 'status-warning';

  return (
    <div className={className}>
      <span className="indicator"></span>
      <span>{ value }</span>
    </div>
  );
}

function App() {
  const cardView = useRef<CardViewRef>();

  const navigateToAssignee = useCallback(async (value) => {
    const cardViewInstance = cardView.current!.instance();
    
    document.querySelectorAll('.card-highlight').forEach((card) => {
      card.classList.remove('card-highlight');
    });

    const index = employees.findIndex(
      (employee) => employee.ID === value,
    );

    const pageIndex = Math.floor(index / cardViewInstance.pageSize());
    await cardViewInstance.pageIndex(pageIndex);

    const cardIndex = cardViewInstance.getCardIndexByKey(value);
    const cardElement = cardViewInstance.getCardElement(cardIndex)
    cardElement.focus();
    cardElement.classList.add('card-highlight');
  }, []);

  const AssignedToComponent = useCallback(({ data: { field: { value, text }}}) => {
    if (!value) {
      return text;
    }

    return (
      <a
        onClick={() => navigateToAssignee(value)}
      >
        {text}
      </a>
    )
  }, [navigateToAssignee]);

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
      <Column
        dataField="Department"
      />
      <Column
        dataField="Head_ID"
        caption="Assigned To"
        calculateDisplayValue={calculateAssignedTo}
        fieldValueComponent={AssignedToComponent}
      />
      <Column
        dataField="Mobile_Phone"
      />
      <Column
        dataField="Email"
      />
      <Column
        caption="Address"
        calculateFieldValue={calculateAddress}
      />
    </CardView>
  );
};

export default App;
