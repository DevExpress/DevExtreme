import React, { useMemo } from 'react';
import { employees } from './data.js';

const Employee = ({ employeeID }) => {
  const employee = useMemo(() => employees.find((e) => e.ID === employeeID), [employeeID]);
  return <button className="task__link-button">{employee.Name}</button>;
};
export default Employee;
