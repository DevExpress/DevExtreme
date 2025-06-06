import React from 'react';
import { employees } from './data.js';

const Employee = ({ employeeID }) => {
  const employee = employees.find((e) => e.ID === employeeID);
  return <a href="#">{employee.Name}</a>;
};
export default Employee;
