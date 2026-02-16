import React, { useCallback } from 'react';
import { Button } from 'devextreme-react/button';

export function EmployeeItem(props) {
  const { employee, showInfo } = props;
  const onInfoButtonClick = useCallback(() => {
    showInfo(employee);
  }, [employee, showInfo]);
  return (
    <>
      <img
        alt={`${employee.FirstName} ${employee.LastName}`}
        src={employee.Picture}
        id={`image${employee.ID}`}
      />
      <br />
      <i>
        {employee.FirstName} {employee.LastName}
      </i>
      <br />
      <Button
        className="button-info"
        text="Details"
        onClick={onInfoButtonClick}
      />
    </>
  );
}
