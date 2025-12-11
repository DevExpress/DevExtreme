import React, { useMemo } from 'react';
import { employees } from './data.js';

const EmployeeComponent = ({ employeeID }) => {
  const employee = useMemo(() => employees.find((e) => e.ID === employeeID), [employeeID]);
  return <button className="task__link-button">{employee.Name}</button>;
};
export default EmployeeComponent;
