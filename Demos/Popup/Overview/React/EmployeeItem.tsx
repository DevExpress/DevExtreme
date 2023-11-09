import React from 'react';
import { Button } from 'devextreme-react/button';

export interface EmployeeItemProps {
  employee: { ID: number; FirstName: string; LastName: string; Prefix: string; Position: string; Picture: string; BirthDate: string; HireDate: string; Notes: string; Address: string; };
  showInfo: any;
}

export function EmployeeItem(props: EmployeeItemProps) {
  const showInfo = React.useCallback(() => {
    props.showInfo(props.employee);
  }, [props]);

  return (
    <React.Fragment>
      <img alt={`${props.employee.FirstName} ${props.employee.LastName}`} src={ props.employee.Picture } id={ `image${props.employee.ID}` } /><br />
      <i>{props.employee.FirstName} {props.employee.LastName}</i><br />
      <Button
        className="button-info"
        text="Details"
        onClick={showInfo}
      />
    </React.Fragment>
  );
}
