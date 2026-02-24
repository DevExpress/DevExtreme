import React, { useCallback, useMemo, useState } from 'react';

import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import type { ButtonTypes } from 'devextreme-react/button';

import notify from 'devextreme/ui/notify';

import { EmployeeItem } from './EmployeeItem.tsx';
import { employees } from './data.ts';
import type { Employee } from './types.ts';

export default function App() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(true);
  const [positionOf, setPositionOf] = useState<string>('');

  const showInfo = useCallback((employee: Employee): void => {
    setCurrentEmployee(employee);
    setPositionOf(`#image${employee.ID}`);
    setPopupVisible(true);
  }, []);

  const hideInfo = useCallback(() => {
    setCurrentEmployee(null);
    setPopupVisible(false);
  }, []);

  const sendEmail = useCallback(() => {
    const message = `Email is sent to ${currentEmployee?.FirstName} ${currentEmployee?.LastName}`;
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

  // const showMoreInfo = useCallback(() => {
  //   const message = `More info about ${currentEmployee?.FirstName} ${currentEmployee?.LastName}`;
  //   notify(
  //     {
  //       message,
  //       position: {
  //         my: 'center top',
  //         at: 'center top',
  //       },
  //     },
  //     'success',
  //     3000,
  //   );
  // }, [currentEmployee]);

  // const getInfoButtonOptions = useMemo((): ButtonTypes.Properties => ({
  //   text: 'More info',
  //   onClick: showMoreInfo,
  // }), [showMoreInfo]);

  const getEmailButtonOptions = useMemo((): ButtonTypes.Properties => ({
    icon: 'email',
    stylingMode: 'contained',
    text: 'Send',
    onClick: sendEmail,
  }), [sendEmail]);

  const getCloseButtonOptions = useMemo((): ButtonTypes.Properties => ({
    text: 'Close',
    stylingMode: 'outlined',
    type: 'normal',
    onClick: hideInfo,
  }), [hideInfo]);

  const getItems = useCallback(() => employees.map((employee: Employee) => (
    <li key={employee.ID}>
      <EmployeeItem employee={employee} showInfo={showInfo} />
    </li>
  )), [showInfo]);

  const renderTitle = () => <p className="title">Title template</p>;

  return (
    <div id="container">
      <div className="header">Employees</div>
      <ul>{getItems()}</ul>
      <Popup
        visible={popupVisible}
        onHiding={hideInfo}
        dragEnabled={false}
        width={450}
        height={600}
        titleRender={renderTitle}
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="before"
          options={getEmailButtonOptions}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={getCloseButtonOptions}
        />
      </Popup>
    </div>
  );
}
