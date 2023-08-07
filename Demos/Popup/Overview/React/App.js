import React from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';
import { EmployeeItem } from './EmployeeItem.js';
import { employees } from './data.js';

export default function App() {
  const [currentEmployee, setCurrentEmployee] = React.useState({});
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [positionOf, setPositionOf] = React.useState('');

  const showInfo = React.useCallback((employee) => {
    setCurrentEmployee(employee);
    setPositionOf(`#image${employee.ID}`);
    setPopupVisible(true);
  }, [setCurrentEmployee, setPositionOf, setPopupVisible]);

  const hideInfo = React.useCallback(() => {
    setCurrentEmployee({});
    setPopupVisible(false);
  }, [setCurrentEmployee, setPopupVisible]);

  const sendEmail = React.useCallback(() => {
    const message = `Email is sent to ${currentEmployee.FirstName} ${currentEmployee.LastName}`;
    notify(
      {
        message,
        position: {
          my: 'center top',
          at: 'center top',
        },
      },
      'success',
      3000,
    );
  }, [currentEmployee]);

  const showMoreInfo = React.useCallback(() => {
    const message = `More info about ${currentEmployee.FirstName} ${currentEmployee.LastName}`;
    notify(
      {
        message,
        position: {
          my: 'center top',
          at: 'center top',
        },
      },
      'success',
      3000,
    );
  }, [currentEmployee]);

  const getInfoButtonOptions = React.useCallback(() => ({
    text: 'More info',
    onClick: showMoreInfo,
  }), [showMoreInfo]);

  const getEmailButtonOptions = React.useCallback(() => ({
    icon: 'email',
    text: 'Send',
    onClick: sendEmail,
  }), [sendEmail]);

  const getCloseButtonOptions = React.useCallback(() => ({
    text: 'Close',
    onClick: hideInfo,
  }), [hideInfo]);

  const getItems = React.useCallback(() => employees.map((employee) => (
    <li key={employee.ID}>
      <EmployeeItem employee={employee} showInfo={showInfo} />
    </li>
  )), [showInfo]);

  return (
    <div id="container">
      <h1>Employees</h1>
      <ul>{getItems()}</ul>
      <Popup
        visible={popupVisible}
        onHiding={hideInfo}
        dragEnabled={false}
        hideOnOutsideClick={true}
        showCloseButton={false}
        showTitle={true}
        title="Information"
        container=".dx-viewport"
        width={300}
        height={280}
      >
        <Position at="bottom" my="center" of={positionOf} collision="fit" />
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          locateInMenu="always"
          options={getInfoButtonOptions()}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="before"
          options={getEmailButtonOptions()}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={getCloseButtonOptions()}
        />
        <p>
          Full Name:&nbsp;
          <span>{currentEmployee.FirstName}</span>&nbsp;
          <span>{currentEmployee.LastName}</span>
        </p>
        <p>
          Birth Date: <span>{currentEmployee.BirthDate}</span>
        </p>
        <p>
          Address: <span>{currentEmployee.Address}</span>
        </p>
        <p>
          Hire Date: <span>{currentEmployee.HireDate}</span>
        </p>
        <p>
          Position: <span>{currentEmployee.Position}</span>
        </p>
      </Popup>
    </div>
  );
}
