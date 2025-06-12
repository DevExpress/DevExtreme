import React, { useMemo } from 'react';
import { employees } from './data.js';

const Employee = ({ employeeID }) => {
  const employee = useMemo(() => employees.find((e) => e.ID === employeeID), [employeeID]);
  return <a href="#">{employee.Name}</a>;
};
export default Employee;
