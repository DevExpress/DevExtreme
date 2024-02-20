import React, { useCallback, useState } from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import notify from 'devextreme/ui/notify';
import { EmployeeItem } from './EmployeeItem.js';
import { employees } from './data.js';

const defaultCurrentEmployee = {};
export default function App() {
  const [currentEmployee, setCurrentEmployee] = useState(defaultCurrentEmployee);
  const [popupVisible, setPopupVisible] = useState(false);
  const [positionOf, setPositionOf] = useState('');
  const showInfo = useCallback(
    (employee) => {
      setCurrentEmployee(employee);
      setPositionOf(`#image${employee.ID}`);
      setPopupVisible(true);
    },
    [setCurrentEmployee, setPositionOf, setPopupVisible],
  );
  const hideInfo = useCallback(() => {
    setCurrentEmployee({});
    setPopupVisible(false);
  }, [setCurrentEmployee, setPopupVisible]);
  const sendEmail = useCallback(() => {
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
  const showMoreInfo = useCallback(() => {
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
  const getInfoButtonOptions = useCallback(
    () => ({
      text: 'More info',
      onClick: showMoreInfo,
    }),
    [showMoreInfo],
  );
  const getEmailButtonOptions = useCallback(
    () => ({
      icon: 'email',
      stylingMode: 'contained',
      text: 'Send',
      onClick: sendEmail,
    }),
    [sendEmail],
  );
  const getCloseButtonOptions = useCallback(
    () => ({
      text: 'Close',
      stylingMode: 'outlined',
      type: 'normal',
      onClick: hideInfo,
    }),
    [hideInfo],
  );
  const getItems = useCallback(
    () =>
      employees.map((employee) => (
        <li key={employee.ID}>
          <EmployeeItem
            employee={employee}
            showInfo={showInfo}
          />
        </li>
      )),
    [showInfo],
  );
  return (
    <div id="container">
      <div className="header">Employees</div>
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
        <Position
          at="bottom"
          my="center"
          of={positionOf}
          collision="fit"
        />
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
