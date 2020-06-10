import React from 'react';

export default function EmployeeCell(options) {
  const employee = options.data.Task_Assigned_Employee;
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
}
