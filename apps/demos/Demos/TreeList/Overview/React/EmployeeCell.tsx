import { type TreeListTypes } from 'devextreme-react/tree-list';
import React from 'react';

const EmployeeCell = (props: TreeListTypes.ColumnCellTemplateData) => {
  const employee = props.data.data.Task_Assigned_Employee;

  if (!employee) {
    return <span className="name">not assigned</span>;
  }

  return (
    <>
      <img
        className="img"
        src={employee.Picture}
        alt=""
      />
      &nbsp;
      <span className="name">{employee.Name}</span>
    </>
  );
};

export default EmployeeCell;
