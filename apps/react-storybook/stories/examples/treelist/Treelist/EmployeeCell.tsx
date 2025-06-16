import { type TreeListTypes } from 'devextreme-react/tree-list';
import React from 'react';

const EmployeeCell = (props: TreeListTypes.ColumnCellTemplateData) => {
  const employee = props.data.data.Task_Assigned_Employee;

  if (!employee) {
    return <span className="name">not assigned</span>;
  }

  return (
    <React.Fragment>
      <div className="img" style={{ backgroundImage: `url(${employee.Picture})` }} />
      &nbsp;
      <span className="name">{employee.Name}</span>
    </React.Fragment>
  );
};

export default EmployeeCell;
